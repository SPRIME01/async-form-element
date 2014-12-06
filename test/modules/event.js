module('event');

promiseTest('form asyncsubmit skipped if submit prevent default', 1, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    var nextSubmit = new Promise(function(resolve) {
      form.addEventListener('submit', function(event) {
        ok(true);
        event.preventDefault();
        setTimeout(resolve, 500);
      });

      form.addEventListener('asyncsubmit', function() {
        ok(false, 'asyncsubmit should not be dispatched');
      });
    });

    QUnit.submit(form);
    return nextSubmit;
  });
});

promiseTest('form asyncsubmit with prevent default', 2, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    var nextSubmit = new Promise(function(resolve) {
      form.addEventListener('asyncsubmit', function(event) {
        event.submission.then(function() {
          ok(false, 'submission should not be resolved');
          resolve();
        }, function(error) {
          ok(error, 'submission shoud be rejected');
          equal(error.message, 'asyncsubmit default action canceled');
          resolve();
        });
        event.preventDefault();
      });
    });

    QUnit.submit(form);
    return nextSubmit;
  });
});

promiseTest('form asyncsubmit with prevent default and propagation stopped', 2, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    var nextSubmit = new Promise(function(resolve) {
      form.addEventListener('asyncsubmit', function(event) {
        event.submission.then(function() {
          ok(false, 'submission should not be resolved');
          resolve();
        }, function(error) {
          ok(error, 'submission shoud be rejected');
          equal(error.message, 'asyncsubmit default action canceled');
          resolve();
        });
        event.preventDefault();
        event.stopPropagation();
      });
    });

    QUnit.submit(form);
    return nextSubmit;
  });
});
