['form', 'async-form'].forEach(function(formId) {
  module(formId);

  promiseTest('form with submit event propagation stopped', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      form.addEventListener('submit', function(event) {
        event.stopPropagation();
      });

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
    });
  });

  promiseTest('form submit prevent default', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var nextSubmitEvent = new Promise(function(resolve) {
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          equal(event.defaultPrevented, true);
          resolve(event);
        });
      });

      QUnit.submit(form);
      return nextSubmitEvent;
    }).then(function() {
      return ready(100);
    }).then(function() {
      ok(false, 'form was submitted');
    }, function() {
      ok(true, 'form was not submitted');
    });
  });

  promiseTest('form submit prevent default and stopped propagation', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var nextSubmitEvent = new Promise(function(resolve) {
        form.addEventListener('submit', function(event) {
          event.stopPropagation();
          event.preventDefault();
          equal(event.defaultPrevented, true);
          resolve(event);
        });
      });

      QUnit.submit(form);
      return nextSubmitEvent;
    }).then(function() {
      return ready(100);
    }).then(function() {
      ok(false, 'form was submitted');
    }, function() {
      ok(true, 'form was not submitted');
    });
  });
});
