['form', 'async-form'].forEach(function(formId) {
  module(formId);

  promiseTest('form GET ignores unclicked buttons', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'submit';
      input.name = 'a';
      input.value = '1';
      form.appendChild(input);

      var button = window.document.createElement('button');
      button.name = 'b';
      button.value = '2';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'submit';
      button.name = 'c';
      button.value = '3';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'reset';
      button.name = 'd';
      button.value = '3';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'button';
      button.name = 'e';
      button.value = '4';
      form.appendChild(button);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST ignores unclicked buttons', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'submit';
      input.name = 'a';
      input.value = '1';
      form.appendChild(input);

      var button = window.document.createElement('button');
      button.name = 'b';
      button.value = '2';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'submit';
      button.name = 'c';
      button.value = '3';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'reset';
      button.name = 'd';
      button.value = '3';
      form.appendChild(button);

      button = window.document.createElement('button');
      button.type = 'button';
      button.name = 'e';
      button.value = '4';
      form.appendChild(button);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form GET submit by button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form GET submit by named button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      submitButton.name = 'foo';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      var submit = window.AsyncFormElement.prototype.localizedDefaultSubmitButtonValue.replace(' ', '+');
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?foo=' + submit, 'request url should be "/foo?foo=Submit"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form GET submit by named and value button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      submitButton.name = 'foo';
      submitButton.value = 'bar';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?foo=bar', 'request url should be "/foo?foo=bar"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST submit by button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST submit by named button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      submitButton.name = 'foo';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      var submit = window.AsyncFormElement.prototype.localizedDefaultSubmitButtonValue.replace(' ', '+');
      equal(window.request.method, 'POST', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, 'foo=' + submit);
    });
  });

  promiseTest('form POST submit by named and value button click', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      var submitButton = window.document.createElement('input');
      submitButton.type = 'submit';
      submitButton.name = 'foo';
      submitButton.value = 'bar';
      form.appendChild(submitButton);

      QUnit.click(submitButton);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, 'foo=bar');
    });
  });
});
