['form', 'async-form'].forEach(function(formId) {
  module(formId);

  promiseTest('form GET request with field', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = 'baz';
      form.appendChild(input);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?bar=baz', 'request url should be "/foo?bar=baz"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST request with field', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

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
      equal(window.request.body, 'bar=baz');
    });
  });

  promiseTest('form GET request with fields', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'text';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      var select, option;
      select = window.document.createElement('select');
      select.name = 'select';
      form.appendChild(select);
      option = window.document.createElement('option');
      option.value = 'a';
      option.selected = true;
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'b';
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'c';
      select.appendChild(option);

      var textarea;
      textarea = window.document.createElement('textarea');
      textarea.name = 'text';
      textarea.value = 'foo';
      form.appendChild(textarea);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?foo=1&bar=2&select=a&text=foo', 'request url should be "/foo?foo=1&bar=2&select=a&text=foo"');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST request with fields', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'text';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      var select, option;
      select = window.document.createElement('select');
      select.name = 'select';
      form.appendChild(select);
      option = window.document.createElement('option');
      option.value = 'a';
      option.selected = true;
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'b';
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'c';
      select.appendChild(option);

      var textarea;
      textarea = window.document.createElement('textarea');
      textarea.name = 'text';
      textarea.value = 'foo';
      form.appendChild(textarea);

      QUnit.submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      equal(window.request.body, 'foo=1&bar=2&select=a&text=foo');
    });
  });
});
