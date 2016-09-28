
exports.getHealthRiskString = (healthRiskCode, T) ->
  if healthRiskCode == 'safe'
    return T('Low Risk/Safe')
  if healthRiskCode == 'probably_safe'
    return T('Intermediate Risk/Probably Safe')
  if healthRiskCode == 'possibly_safe'
    return T('Intermediate Risk/Possibly Safe')
  if healthRiskCode == 'possibly_unsafe'
    return T('High Risk/Possibly Unsafe')
  if healthRiskCode == 'probably_unsafe'
    return T('High Risk/Probably Unsafe')
  if healthRiskCode == 'unsafe'
    return T('Unsafe')

  throw new Error('Unknown health risk code ' + healthRiskCode)
