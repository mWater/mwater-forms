"use strict";

// Validates mWater water site codes
exports.seqToCode = function (seq) {
  var digit, i, j, ref, str, sum;
  // Get string of seq number
  str = "" + seq;
  sum = 0;
  for (i = j = 0, ref = str.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    digit = parseInt(str[str.length - 1 - i]);
    if (i % 3 === 0) {
      sum += 7 * digit;
    }
    if (i % 3 === 1) {
      sum += 3 * digit;
    }
    if (i % 3 === 2) {
      sum += digit;
    }
  }
  return str + sum % 10;
};

exports.isValid = function (code) {
  var seq;
  seq = parseInt(code.substring(0, code.length - 1));
  return exports.seqToCode(seq) === code;
};