['form', 'async-form'].forEach(function(formId) {
  module('shared multipart ' + formId);

  promiseTest('form multipart POST request with field', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';
      form.enctype = 'multipart/form-data';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = 'baz';
      form.appendChild(input);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      var lines = window.request.body.split(/\r\n?/);
      equal(lines[1], 'Content-Disposition: form-data; name="bar"');
      equal(lines[3], 'baz');
      ok(window.request.headers['content-type'].match('multipart/form-data'), window.request.headers['content-type']);
    });
  });

  promiseTest('form multipart POST request with empty file', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';
      form.enctype = 'multipart/form-data';

      var input = window.document.createElement('input');
      input.type = 'file';
      input.name = 'bar';
      form.appendChild(input);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      var lines = window.request.body.split(/\r\n?/);
      equal(lines[1], 'Content-Disposition: form-data; name="bar"; filename=""');
      equal(lines[3], '');
      ok(window.request.headers['content-type'].match('multipart/form-data'), window.request.headers['content-type']);
    });
  });
});
