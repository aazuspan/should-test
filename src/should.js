var UI = require("users/aazuspan/should:src/ui.js");

// Globals
var totalTests = 0;
var runTests = 0;
var failedTests = 0;
var skipRegex = new RegExp("^$");
var runRegex = new RegExp("");

// Evaluate an assertion. This handler takes a boolean (usually server-side), evaluates it, and records
// the results in the UI.
// The message is the error message if the assert fails. The description is the name of the test.
var evaluateAssert = function (condition, message, description) {
  var PASS = 0;
  var FAIL = -1;

  if (skipRegex.test(description) || !runRegex.test(description)) {
    var status = "skip";
    UI.addResult(description, status);
    return;
  }

  totalTests++;

  // The condition could be a server- or client-side boolean, so we pass it through
  // an If to convert it to a ComputedObject that can be evaluated
  var result = ee.Algorithms.If(condition, PASS, FAIL);
  result.evaluate(function (result, error) {
    runTests++;
    var status = "pass";

    if (result === FAIL || error) {
      failedTests++;
      status = "fail";
      var errorMessage = error || message;
      UI.addFailed(description, errorMessage);
    }

    UI.addResult(description, status);
    UI.updateSummary(totalTests, runTests, failedTests);
    UI.display();
  });
};


var isEEObject = function (object) {
  return object instanceof ee.ComputedObject;
};

exports.settings = {
  // Asserts will be skipped if their descirption matches the skip regex pattern.
  skip: function (pattern) {
    skipRegex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  },
  // Asserts will only run if their description matches the run regex pattern.
  run: function (pattern) {
    runRegex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  },
};

exports.utils = {
  // A convenience function for running anonymous functions
  call: function (fn) {
    fn();
  },
};

// Function should throw an error
exports.throw = function (fn, description) {
  try {
    fn();
    var result = false;
  } catch (e) {
    result = true;
  }

  evaluateAssert(result, "Function did not throw", description);
};

// Function should not throw an error
exports.notThrow = function (fn, description) {
  try {
    fn();
    var result = true;
    var message = "";
  } catch (e) {
    result = false;
    message = "Function did throw " + String(e);
  }

  evaluateAssert(result, message, description);
};

// Values should be strictly equal
exports.equal = function (actual, expected, description) {
  var condition = isEEObject(actual)
    ? actual.eq(expected)
    : isEEObject(expected)
    ? expected.eq(actual)
    : JSON.stringify(actual) === JSON.stringify(expected);
  var message = actual + " not equal to " + expected;
  evaluateAssert(condition, message, description);
};

// Values should be strictly unequal
exports.notEqual = function (actual, expected, description) {
  var condition = isEEObject(actual)
    ? actual.neq(expected)
    : isEEObject(expected)
    ? expected.neq(actual)
    : JSON.stringify(actual) !== JSON.stringify(expected);
  var message = actual + " equal to " + expected;
  evaluateAssert(condition, message, description);
};

// Values should be nearly equal, compared to allowable relative error
exports.almostEqual = function (actual, expected, description, error) {
  error = error || 1e-6;
  var condition = isEEObject(actual)
    ? actual.subtract(expected).divide(actual).lt(error)
    : isEEObject(expected)
    ? expected.subtract(actual).divide(actual).lt(error)
    : (actual - expected) / actual < error;
  var message = actual + " not almost equal to " + expected;
  evaluateAssert(condition, message, description);
};

// Value should be greater than other
exports.beGreater = function (value, other, description) {
  var condition = isEEObject(value)
    ? value.gt(other)
    : isEEObject(other)
    ? other.lt(value)
    : value > other;
  var message = value + " not greater than " + other;
  evaluateAssert(condition, message, description);
};

// Value should be greater or equal to other
exports.beGreaterOrEqual = function (value, other, description) {
  var condition = isEEObject(value)
    ? value.gte(other)
    : isEEObject(other)
    ? other.lte(value)
    : value >= other;
  var message = value + " not greater or equal to " + other;
  evaluateAssert(condition, message, description);
};

// Value should be less than other
exports.beLess = function (value, other, description) {
  var condition = isEEObject(value)
    ? value.lt(other)
    : isEEObject(other)
    ? other.gt(value)
    : value < other;
  var message = value + " not less than " + other;
  evaluateAssert(condition, message, description);
};

// Value should be less or equal to other
exports.beLessOrEqual = function (value, other, description) {
  var condition = isEEObject(value)
    ? value.lte(other)
    : isEEObject(other)
    ? other.gte(value)
    : value <= other;
  var message = value + " not less or equal to " + other;
  evaluateAssert(condition, message, description);
};

// Value should be true
exports.beTrue = function (value, description) {
  var condition = isEEObject(value)
    ? ee.Algorithms.IsEqual(value, 1)
    : value === true;
  var message = value + " is not true";
  evaluateAssert(condition, message, description);
};

// Value should be false
exports.beFalse = function (value, description) {
  var condition = isEEObject(value)
    ? ee.Algorithms.IsEqual(value, 0)
    : value !== true;
  var message = value + " is not false";
  evaluateAssert(condition, message, description);
};

// Array (or ee.List) should contain element
exports.contain = function (array, element, description) {
  var condition = isEEObject(array)
    ? ee.List(array).contains(element)
    : array.indexOf(element) !== -1;
  var message = element + " not in " + array;
  evaluateAssert(condition, message, description);
};

// Array (or ee.List) should not contain element
exports.notContain = function (array, element, description) {
  var condition = isEEObject(array)
    ? ee.Algorithms.If(array.contains(element), false, true)
    : array.indexOf(element) === -1;
  var message = element + " in " + array;
  evaluateAssert(condition, message, description);
};

// String should match regex pattern
exports.match = function (string, pattern, description) {
  var condition = isEEObject(string)
    ? ee.String(string).match(pattern).size().gt(0)
    : new RegExp(pattern).test(string);
  var message = "`" + string + "` does not match pattern `" + pattern + "`";
  evaluateAssert(condition, message, description);
};

// String should not match regex pattern
exports.notMatch = function (string, pattern, description) {
  var condition = isEEObject(string)
    ? ee.String(string).match(pattern).size().eq(0)
    : !new RegExp(pattern).test(string);
  var message = "`" + string + "` matches pattern `" + pattern + "`";
  evaluateAssert(condition, message, description);
};

// Asset should exist
exports.exist = function (assetID, description) {
  ee.data.getAsset(assetID, function(result, err) {
    var condition = result !== undefined && err === undefined;
    var message = "`" + assetID + "` does not exist";
    evaluateAssert(condition, message, description);
  })
}

exports.bePublic = function (assetID, description) {
  ee.data.getAssetAcl(assetID, function(result, err) {
    var condition = result !== undefined && result.all_users_can_read === true;
    var message = "`" + assetID + "` is not public";
    evaluateAssert(condition, message, description);
  })
}