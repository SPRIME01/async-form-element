(function() {
  'use strict';

  function nextTick(fn) {
    Promise.resolve().then(fn);
  }

  function makeDeferred() {
    var resolve, reject;
    var promise = new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    return Object.defineProperties(promise, {
      resolve: { value: resolve },
      reject: { value: reject }
    });
  }

  function isAsyncForm(el) {
    return el.nodeName === 'FORM' &&
      el.getAttribute('is') === 'async-form';
  }

  function elementClosestButton(el) {
    while (el) {
      if (el.nodeName === 'BUTTON' || el.nodeName === 'INPUT') {
        return el;
      } else if (el.nodeName === 'FORM') {
        return null;
      } else {
        el = el.parentElement;
      }
    }
    return null;
  }


  var lastElementClickTarget;

  function captureLastButton(event) {
    lastElementClickTarget = event.target;
  }

  window.addEventListener('click', captureLastButton, true);


  var formSubmitter = new WeakMap();

  function captureFormSubmitter(event) {
    var form = event.target;

    if (lastElementClickTarget) {
      var button = elementClosestButton(lastElementClickTarget);

      if (form.contains(button)) {
        formSubmitter.set(form, button);
        return;
      }
    }

    formSubmitter['delete'](event.target);
  }

  window.addEventListener('submit', captureFormSubmitter, true);


  var submitEventDefaultPrevented = new WeakMap();
  var submitEventDispatched = new WeakMap();

  function resolveSubmitDispatch(event) {
    if (isAsyncForm(event.target)) {
      var dispatched = submitEventDispatched.get(event);
      if (submitEventDefaultPrevented.get(event)) {
        dispatched.reject(new Error('submit default action canceled'));
      } else {
        dispatched.resolve();
      }
    }
  }

  function captureAsyncFormSubmit(event) {
    if (isAsyncForm(event.target)) {
      var target = event.target;

      // Always disable default form submit
      event.preventDefault();

      event.preventDefault = function() {
        submitEventDefaultPrevented.set(event, true);
      };

      var dispatched = makeDeferred();
      submitEventDispatched.set(event, dispatched);

      nextTick(function() {
        resolveSubmitDispatch(event);
      });

      window.removeEventListener('submit', resolveSubmitDispatch, false);
      window.addEventListener('submit', resolveSubmitDispatch, false);

      dispatched.then(function() {
        var asyncevent = document.createEvent('Event');
        asyncevent.initEvent('asyncsubmit', true, true);
        var submission = asyncevent.submission = makeDeferred();
        asyncevent.submitter = formSubmitter.get(target);

        if (target.dispatchEvent(asyncevent)) {
          target.request(asyncevent.submitter).then(submission.resolve, submission.reject);
        } else {
          submission.reject(new Error('asyncsubmit default action canceled'));
        }
      });
    }
  }

  window.addEventListener('submit', captureAsyncFormSubmit, true);


  var AsyncFormElementPrototype = Object.create(HTMLFormElement.prototype);

  // When a input type=submit button has no value, the browser supplies an
  // implementation specific localized default string such as "Submit" or
  // "Submit Query".
  //
  //   https://html.spec.whatwg.org/multipage/forms.html#submit-button-state-(type=submit)
  //
  AsyncFormElementPrototype.localizedDefaultSubmitButtonValue =
    navigator.userAgent.match(/WebKit/) ? 'Submit' : 'Submit Query';

  Object.defineProperty(AsyncFormElementPrototype, 'asyncAccept', {
    get: function() {
      return this.getAttribute('async-accept') || '*/*';
    },
    set: function(value) {
      this.setAttribute('async-accept', value);
    }
  });

  Object.defineProperty(AsyncFormElementPrototype, 'asyncMethod', {
    get: function() {
      var method = this.getAttribute('method');
      if (method) {
        method = method.toLowerCase();
      }
      switch (method) {
        case 'get':
        case 'post':
        case 'put':
        case 'delete':
          return method;
      }
      return 'get';
    },
    set: function(value) {
      this.setAttribute('method', value);
    }
  });

  var onasyncsubmitProps = new WeakMap();

  Object.defineProperty(AsyncFormElementPrototype, 'onasyncsubmit', {
    get: function() {
      return onasyncsubmitProps.get(this);
    },
    set: function(value) {
      var oldValue = onasyncsubmitProps.get(this);
      this.removeEventListener('asyncsubmit', oldValue, false);
      this.addEventListener('asyncsubmit', value, false);
      return value;
    }
  });

  AsyncFormElementPrototype.createdCallback = function() {
    var value = this.getAttribute('onasyncsubmit');
    if (value) {
      this.attributeChanged('onasyncsubmit', null, value);
    }
  };

  AsyncFormElementPrototype.attributeChanged = function(attrName, oldValue, newValue) {
    if (attrName === 'onasyncsubmit') {
      this.onasyncsubmit = new Function('event', newValue);
    }
  };

  AsyncFormElementPrototype.asyncSubmit = function(submitter) {
    return this.request(submitter);
  };

  AsyncFormElementPrototype.serializeFormData = function() {
    return new FormData(this);
  };

  // https://html.spec.whatwg.org/multipage/forms.html#category-submit
  AsyncFormElementPrototype.submittableElements = function() {
    var submittable = [];
    var i, els = this.elements;
    for (i = 0; i < els.length; i++) {
      switch (els[i].nodeName.toUpperCase()) {
        case 'BUTTON':
        case 'INPUT':
        case 'KEYGEN':
        case 'OBJECT':
        case 'SELECT':
        case 'TEXTAREA':
          submittable.push(els[i]);
      }
    }
    return submittable;
  };

  // TODO: Prefer URLSearchParams when available
  //   https://url.spec.whatwg.org/#dom-urlsearchparams
  AsyncFormElementPrototype.serializeURLSearchParams = function(submitter) {
    var urlencoded = [];
    var i, el, els = this.submittableElements();
    for (i = 0; i < els.length; i++) {
      el = els[i];

      if (!el.name) {
        continue;
      }

      if (el.disabled) {
        continue;
      }

      if ((el.nodeName.toUpperCase() === 'BUTTON' ||
          (el.nodeName.toUpperCase() === 'INPUT' && el.type === 'submit')) &&
          el !== submitter) {
        continue;
      }

      var value = el.value;
      if (el === submitter && !value) {
        value = this.localizedDefaultSubmitButtonValue;
      }

      urlencoded.push(encodeURIComponent(el.name).replace(/%20/g, '+') +
        '=' +
        encodeURIComponent(value).replace(/%20/g, '+'));
    }
    return urlencoded.join('&');
  };

  AsyncFormElementPrototype.request = function(submitter) {
    var form = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      var method = form.asyncMethod;
      var url = form.action;
      if (method === 'get') {
        url += '?' + form.serializeURLSearchParams(submitter);
      }
      var body;

      req.open(method.toUpperCase(), url);
      req.setRequestHeader('Accept', form.asyncAccept);

      if (method !== 'get') {
        req.setRequestHeader('Content-Type', form.enctype);

        if (form.enctype === 'multipart/form-data') {
          body = form.serializeFormData(submitter);
        } else {
          body = form.serializeURLSearchParams(submitter);
        }
      }

      req.onload = function() {
        if (req.status === 200) {
          resolve(req.responseText);
        } else {
          reject(new Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(new Error('Network Error'));
      };

      req.send(body);
    });
  };

  window.AsyncFormElement = document.registerElement('async-form', {
    prototype: AsyncFormElementPrototype,
    'extends': 'form'
  });

  // FF bug
  //   https://bugzilla.mozilla.org/show_bug.cgi?id=1081037
  if (!window.AsyncFormElement.prototype) {
    window.AsyncFormElement.prototype = AsyncFormElementPrototype;
  }
})();
