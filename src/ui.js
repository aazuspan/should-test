// Styles
var PASS_SYMBOL = "✅";
var FAIL_SYMBOL = "🛑";
var SKIP_SYMBOL = "🔇️";
var FAIL_COLOR = "#eb4034";
var SUCCESS_COLOR = "#009900";
var TEXT_COLOR = "#3b3b3b";
var LIGHT_TEXT_COLOR = "#ababab";

var startTime = Date.now();
var displayed = false;


exports.progressLabel = ui.Label({ value: ".", style: { color: LIGHT_TEXT_COLOR, margin: "0 0 4px 8px"} });
exports.summaryLabel = ui.Label({value: ". . .", style: { margin: "0 0 0 8px"}});
exports.summaryPanel = ui.Panel({
  widgets: [exports.progressLabel, exports.summaryLabel],
});
exports.resultsPanel = ui.Panel();
exports.errorsPanel = ui.Panel({style: {shown: false}});

exports.display = function() {
  if (displayed) return;
  
  print(exports.summaryPanel);
  print(exports.resultsPanel);
  print(exports.errorsPanel);  
  
  displayed = true;
}

// Update the UI to track test progress
exports.updateSummary = function (totalTests, runTests, failedTests) {
  if (runTests === totalTests) {
    var elapsed = (Date.now() - startTime) / 1000;

    if (failedTests > 0) {
      exports.summaryLabel.setValue(failedTests + " tests failed.");
      exports.summaryLabel.style().set("color", FAIL_COLOR);
      exports.summaryLabel.style().set("fontWeight", "bold");
    } else {
      exports.summaryLabel.setValue("All tests passed!");
      exports.summaryLabel.style().set("color", SUCCESS_COLOR);
    }
    exports.progressLabel.setValue("Done in " + elapsed + " seconds");
    return;
  }

  exports.progressLabel.setValue("Run " + runTests + " of " + totalTests + " tests");
};

// Add a test label to the results panel. Status must be one of ["fail", "pass", "skip"]
exports.addResult = function(description, status) {
  if (status === "skip") var status = SKIP_SYMBOL + " " + description;
  else if (status === "pass") status = PASS_SYMBOL + " " + description;
  else status = FAIL_SYMBOL + " " + description;
  
  var label = ui.Label({value: status, style: {color: LIGHT_TEXT_COLOR, margin: "0 8px 2px 8px"}});
  exports.resultsPanel.add(label);
}

// Add a failed test to the errors panel
exports.addFailed = function(description, message) {
    var panel = ui.Panel({style: {padding: "4px", margin: "6px", border: "1px solid " + FAIL_COLOR }});
    var panelIndex = exports.errorsPanel.widgets().length();
    
    panel.add(ui.Label(panelIndex + ") " + description));
    panel.add(ui.Label({value: message, style: {color: FAIL_COLOR}}));
    
    exports.errorsPanel.add(panel);
    exports.errorsPanel.style().set("shown", true);
}