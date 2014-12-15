module('async-form');

promiseTest('form asyncSubmit GET request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    equal(form.asyncMethod, 'get');

    return window.handleFormResponse(form.asyncSubmit());
  }).then(function(window) {
    equal(window.request.method, 'GET', 'request method should be "GET"');
    equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], null);
  });
});

promiseTest('form asyncSubmit POST request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';

    equal(form.asyncMethod, 'post');

    return window.handleFormResponse(form.asyncSubmit());
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
  });
});
