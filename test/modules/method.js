module('method');

promiseTest('form PUT request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    if (QUnit.unknownFormMethodSupported) {
      form.method = 'PUT';
    } else {
      form.setAttribute('method', 'PUT');
    }
    form.action = '/foo/1';

    equal(form.asyncMethod, 'put');

    QUnit.submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'PUT', 'request method should be "PUT"');
    equal(window.request.url, '/foo/1', 'request url should be "/foo/1"');
    equal(window.request.body, '');
    equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
  });
});

promiseTest('form DELETE request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    if (QUnit.unknownFormMethodSupported) {
      form.method = 'DELETE';
    } else {
      form.setAttribute('method', 'DELETE');
    }
    form.action = '/foo/1';

    equal(form.asyncMethod, 'delete');

    QUnit.submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'DELETE', 'request method should be "DELETE"');
    equal(window.request.url, '/foo/1', 'request url should be "/foo/1"');
    equal(window.request.body, '');
    equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
  });
});
