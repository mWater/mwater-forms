exports.seqToCode = function(seq) {
  var digit, i, str, sum, _i, _ref;
  str = "" + seq;
  sum = 0;
  for (i = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
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
  return str + (sum % 10);
};

exports.isValid = function(code) {
  var seq;
  seq = parseInt(code.substring(0, code.length - 1));
  return exports.seqToCode(seq) === code;
};
