// Throw a failure
exports.fail = function (message) {
  message = message || "Undefined failure.";
  throw new Error(message);
};

// Assert that object is truthy
exports.ok = function (object, message) {
  exports.equal(object, true, message);
};

// Assert that object is falsey
exports.notOk = function (object, message) {
  exports.equal(object, false, message);
};

// Assert non-strict equality (==) of actual and expected.
exports.equal = function (actual, expected, message) {
  message = message || actual + " != " + expected;
  if (actual != expected) throw new Error(message);
};

// Assert non-strict inequality (!=) of actual and expected.
exports.notEqual = function (actual, expected, message) {
  message = message || actual + " == " + expected;
  if (actual == expected) throw new Error(message);
};

// Assert strict equality (===) of actual and expected.
exports.strictEqual = function (actual, expected, message) {
  message = message || actual + " !== " + expected;
  if (actual !== expected) throw new Error(message);
};

// Assert strict inequality (!==) of actual and expected.
exports.notStrictEqual = function (actual, expected, message) {
  message = message || actual + " === " + expected;
  if (actual === expected) throw new Error(message);
};

// Assert that value is neither null nor undefined
exports.exists = function (value, message) {
  message = message || "`" + value + "` is `null` or `undefined`.";
  if (value === null || value === undefined) throw new Error(message);
};

// Assert that value is either null nor undefined
exports.notExists = function (value, message) {
  message = message || "`" + value + "` is not `null` or `undefined`.";
  if (value !== null && value !== undefined) throw new Error(message);
};

// Assert that a string does match a regular expression.
exports.match = function (string, regexp, message) {
  message =
    message ||
    "`" + string + "` does not match pattern `" + String(regexp) + "`.";
  regexp = regexp instanceof RegExp ? regexp : new RegExp(regexp);

  if (regexp.test(string) !== true) throw new Error(message);
};

// Assert that a string does not match a regular expression.
exports.doesNotMatch = function (string, regexp, message) {
  message =
    message || "`" + string + "` matches pattern `" + String(regexp) + "`.";
  regexp = regexp instanceof RegExp ? regexp : new RegExp(regexp);

  if (regexp.test(string) === true) throw new Error(message);
};

// Assert value in array
exports.in = function(value, array, message) {
  message = message || "`" + value + "` not in `" + array + "`.";
  if (array.indexOf(value) === -1) throw new Error(message);
}

// Assert value not in array
exports.notIn = function(value, array, message) {
  message = message || "`" + value + "` is in `" + array + "`.";
  if (array.indexOf(value) !== -1) throw new Error(message);
}

// Assert function throws error.
exports.throws = function (fn, errorLike, errMsgMatcher, message) {
  var regexp =
    errMsgMatcher instanceof RegExp ? errMsgMatcher : new RegExp(errMsgMatcher);
  // Return true if error matches errorLike type or if errorLike type is undefined
  var checkError = function (e, like) {
    return like != null ? e instanceof like : true;
  };
  try {
    fn();
  } catch (e) {
    if (!checkError(e, errorLike)) {
      message =
        message ||
        "Error was of type `" +
          e.constructor.name +
          "`, not `" +
          errorLike.name +
          "`.";
      throw new TypeError(message);
    }

    if (!regexp.test(e.message)) {
      message =
        message ||
        "Error message `" +
          e.message +
          "` did not match pattern `" +
          String(regexp) +
          "`.";
      throw new Error(message);
    }

    return;
  }

  message = message || "No error was thrown.";
  throw new Error(message);
};
