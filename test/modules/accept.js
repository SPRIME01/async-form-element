module('async-form');

promiseTest('form POST request with default async-accept', 6, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';

    equal(form.asyncAccept, '*/*');

    QUnit.submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
    equal(window.request.headers.accept, '*/*');
  });
});

promiseTest('form POST request with async-accept', 6, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';
    form.asyncAccept = 'application/json';

    equal(form.asyncAccept, 'application/json');

    QUnit.submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(QUnit.normalizeContentType(window.request.headers['content-type']), 'application/x-www-form-urlencoded');
    equal(window.request.headers.accept, 'application/json');
  });
});
