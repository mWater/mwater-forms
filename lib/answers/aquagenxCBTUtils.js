'use strict';

exports.healthRiskEnum = [{
  id: 'safe',
  name: {
    _base: 'en',
    'en': 'Low Risk/Safe'
  },
  code: 'safe'
}, {
  id: 'probably_safe',
  name: {
    _base: 'en',
    'en': 'Intermediate Risk/Probably Safe'
  },
  code: 'probably_safe'
}, {
  id: 'possibly_safe',
  name: {
    _base: 'en',
    'en': 'Intermediate Risk/Possibly Safe'
  },
  code: 'possibly_safe'
}, {
  id: 'possibly_unsafe',
  name: {
    _base: 'en',
    'en': 'High Risk/Possibly Unsafe'
  },
  code: 'possibly_unsafe'
}, {
  id: 'probably_unsafe',
  name: {
    _base: 'en',
    'en': 'High Risk/Probably Unsafe'
  },
  code: 'probably_unsafe'
}, {
  id: 'unsafe',
  name: {
    _base: 'en',
    'en': 'Unsafe'
  },
  code: 'unsafe'
}];

exports.getHealthRiskString = function (healthRiskId, T) {
  if (healthRiskId === 'safe') {
    return T('Low Risk/Safe');
  }
  if (healthRiskId === 'probably_safe') {
    return T('Intermediate Risk/Probably Safe');
  }
  if (healthRiskId === 'possibly_safe') {
    return T('Intermediate Risk/Possibly Safe');
  }
  if (healthRiskId === 'possibly_unsafe') {
    return T('High Risk/Possibly Unsafe');
  }
  if (healthRiskId === 'probably_unsafe') {
    return T('High Risk/Probably Unsafe');
  }
  if (healthRiskId === 'unsafe') {
    return T('Unsafe');
  }
  throw new Error('Unknown health risk id ' + healthRiskId);
};