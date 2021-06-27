# Validates mWater water site codes
exports.seqToCode = (seq) ->
  # Get string of seq number
  str = "" + seq

  sum = 0
  for i in [0...str.length]
    digit = parseInt(str[str.length-1-i])
    if i%3 == 0
      sum += 7 * digit
    if i%3 == 1
      sum += 3 * digit
    if i%3 == 2
      sum +=  digit
  return str + (sum % 10)

exports.isValid = (code) ->
  seq = parseInt(code.substring(0, code.length - 1))

  return exports.seqToCode(seq) == code