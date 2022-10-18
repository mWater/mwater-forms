// Validates mWater water site codes
export function seqToCode(seq: any) {
  // Get string of seq number
  const str = "" + seq

  let sum = 0
  for (let i = 0, end = str.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
    const digit = parseInt(str[str.length - 1 - i])
    if (i % 3 === 0) {
      sum += 7 * digit
    }
    if (i % 3 === 1) {
      sum += 3 * digit
    }
    if (i % 3 === 2) {
      sum += digit
    }
  }
  return str + (sum % 10)
}

export function isValid(code: any) {
  const seq = parseInt(code.substring(0, code.length - 1))

  return seqToCode(seq) === code
}
