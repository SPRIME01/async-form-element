['form', 'async-form'].forEach(function(formId) {
  module('shared method ' + formId);

  promiseTest('form GET request', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      equal(form.method, 'get', 'form.method should be "get"');

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    });
  });

  promiseTest('form POST request', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      equal(form.method, 'post', 'form.method should be "post"');

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
      equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
    });
  });

  promiseTest('form request with unknown method', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      if (QUnit.unknownFormMethodSupported) {
        form.method = 'BREW';
      } else {
        form.setAttribute('method', 'BREW');
      }
      form.action = '/foo';

      equal(form.method, 'get', 'form.method should be "get"');

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    });
  });
});
