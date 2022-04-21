// Styles
exports.PASS_SYMBOL = "✅";
exports.FAIL_SYMBOL = "🛑";
exports.SKIP_SYMBOL = "🔇️";
exports.FAIL_COLOR = "#eb4034";
exports.SUCCESS_COLOR = "#009900";
exports.TEXT_COLOR = "#3b3b3b";
exports.LIGHT_TEXT_COLOR = "#ababab";
exports.HEADER = "\
\n▒██▀▒██▀░▀█▀\
\n░█▄▄░█▄▄░▒█▒";

var startTime = Date.now();

exports.progressLabel = ui.Label({
  value: ".",
  style: { color: exports.LIGHT_TEXT_COLOR, margin: "0 0 4px 8px" },
});
exports.summaryLabel = ui.Label({
  value: ". . .",
  style: { margin: "0 0 0 8px" },
});
exports.summaryPanel = ui.Panel({
  widgets: [exports.progressLabel, exports.summaryLabel],
});
exports.resultsPanel = ui.Panel();
exports.errorsPanel = ui.Panel({
  style: { shown: false, border: "1px solid " + exports.FAIL_COLOR },
});

print(exports.HEADER);
print(exports.summaryPanel);
print(exports.resultsPanel);
print(exports.errorsPanel);

// Update the UI to track test progress
exports.updateSummary = function (totalTests, runTests, failedTests) {
  if (runTests === totalTests) {
    var elapsed = (Date.now() - startTime) / 1000;

    if (failedTests > 0) {
      exports.summaryLabel.setValue(failedTests + " tests failed.");
      exports.summaryLabel.style().set("color", exports.FAIL_COLOR);
      exports.summaryLabel.style().set("fontWeight", "bold");
    } else {
      exports.summaryLabel.setValue("All tests passed!");
      exports.summaryLabel.style().set("color", exports.SUCCESS_COLOR);
    }
    exports.progressLabel.setValue("Done in " + elapsed + " seconds");
    return;
  }

  exports.progressLabel.setValue(
    "Run " + runTests + " of " + totalTests + " tests"
  );
};

// Add a test label to the results panel. Status must be one of ["fail", "pass", "skip"]
exports.addResult = function (description, status) {
  if (status === "skip") var status = exports.SKIP_SYMBOL + " " + description;
  else if (status === "pass") status = exports.PASS_SYMBOL + " " + description;
  else status = exports.FAIL_SYMBOL + " " + description;

  var label = ui.Label({
    value: status,
    style: { color: exports.LIGHT_TEXT_COLOR, margin: "0 8px 2px 8px" },
  });
  exports.resultsPanel.add(label);
};

// Add a label for a failed tests to the error panel.
exports.addFailed = function (description, message) {
  var panel = ui.Panel({ style: { padding: "4px", margin: "6px" } });
  panel.add(ui.Label("> " + description));
  panel.add(ui.Label({ value: message, style: { color: exports.FAIL_COLOR } }));

  exports.errorsPanel.add(panel);
  exports.errorsPanel.style().set("shown", true);
};
