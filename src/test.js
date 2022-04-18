// Styles
var PASS_SYMBOL = "✅";
var FAIL_SYMBOL = "🛑";
var SKIP_SYMBOL = "🔇️";
var FAIL_COLOR = "#eb4034";
var SUCCESS_COLOR = "#009900";
var TEXT_COLOR = "#3b3b3b";
var LIGHT_TEXT_COLOR = "#ababab";
var HEADER = "\
\n▒██▀▒██▀░▀█▀\
\n░█▄▄░█▄▄░▒█▒"

// Globals
var tests = {};
var failed = {};
var results = ui.Panel();

// Register a test to run.
exports.test = function (description, fn) {
  if (tests[description]) {
    throw new Error("Duplicate test: " + description);
  }

  tests[description] = fn;
};

// Run all tests and display results.
exports.run = function (pattern) {
  print(HEADER);

  var start = Date.now();
  runTests(pattern);
  var elapsed = (Date.now() - start) / 1000;

  results.add(
    ui.Label({
      value: "\nDone in " + elapsed + " seconds",
      style: { color: LIGHT_TEXT_COLOR },
    })
  );

  var summary;
  if (Object.keys(failed).length > 0) {
    summary = ui.Label({
      value: Object.keys(failed).length + " tests failed.",
      style: { color: FAIL_COLOR, fontWeight: "bold" },
    });
  } else {
    summary = ui.Label({
      value: "All tests passed!",
      style: { color: SUCCESS_COLOR },
    });
  }
  results.add(summary);
  print(results);

  for (var desc in failed) {
    print(failedPanel(desc, failed[desc]));
  }
};

// Run a single test, adding it's results to the results panel.
var runTest = function (description, fn) {
  try {
    fn();
    results.add(
      ui.Label({
        value: PASS_SYMBOL + " " + description,
        style: { margin: "0 8px 2px 8px" },
      })
    );
  } catch (e) {
    results.add(
      ui.Label({
        value: FAIL_SYMBOL + " " + description,
        style: { margin: "0 8px 2px 8px" },
      })
    );
    failed[description] = String(e);
  }
};

var skipTest = function(description) {
  results.add(ui.Label({value: SKIP_SYMBOL + " " + description, style: {margin: "0 8px 2px 8px", color: LIGHT_TEXT_COLOR}}))
}

// Run all tests that match an optional regex pattern.
var runTests = function (pattern) {
  pattern = pattern instanceof RegExp ? pattern : new RegExp(pattern);

  for (var test in tests) {
    if (pattern.test(test)) runTest(test, tests[test]);
    else skipTest(test);
  }
};

// Build a UI panel to display a single failed test.
var failedPanel = function (description, error) {
  var header = ui.Label({
    value: "> " + description,
    style: { color: TEXT_COLOR },
  });
  var body = ui.Label({ value: error, style: { color: FAIL_COLOR } });
  var panel = ui.Panel({
    widgets: [header, body],
    style: { border: "1px solid " + FAIL_COLOR, padding: "4px", margin: "6px" },
  });

  return panel;
};
