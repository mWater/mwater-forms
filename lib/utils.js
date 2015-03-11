exports.getRelativeLocation = function(fromLoc, toLoc) {
  var angle, distance, dx, dy, x1, x2, y1, y2;
  x1 = fromLoc.longitude;
  y1 = fromLoc.latitude;
  x2 = toLoc.longitude;
  y2 = toLoc.latitude;
  dy = (y2 - y1) / 57.2957795 * 6371000;
  dx = Math.cos(y1 / 57.2957795) * (x2 - x1) / 57.2957795 * 6371000;
  distance = Math.sqrt(dx * dx + dy * dy);
  angle = 90 - (Math.atan2(dy, dx) * 57.2957795);
  if (angle < 0) {
    angle += 360;
  }
  if (angle > 360) {
    angle -= 360;
  }
  return {
    angle: angle,
    distance: distance
  };
};

exports.getCompassBearing = function(angle, T) {
  var compassDir, compassStrs;
  compassDir = (Math.floor((angle + 22.5) / 45)) % 8;
  compassStrs = [T("N"), T("NE"), T("E"), T("SE"), T("S"), T("SW"), T("W"), T("NW")];
  return compassStrs[compassDir];
};

exports.formatRelativeLocation = function(relLoc, T) {
  var distance;
  if (relLoc.distance > 1000) {
    distance = (relLoc.distance / 1000).toFixed(1) + " " + T("km");
  } else {
    distance = relLoc.distance.toFixed(0) + " " + T("m");
  }
  return distance + " " + exports.getCompassBearing(relLoc.angle, T);
};

exports.calculateGPSStrength = function(pos) {
  var excellentAcc, fairAcc, goodAcc, recentThreshold;
  excellentAcc = 5;
  goodAcc = 10;
  fairAcc = 50;
  recentThreshold = 90000;
  if (!pos) {
    return "none";
  }
  if (pos.timestamp < new Date().getTime() - recentThreshold) {
    return "none";
  }
  if (pos.coords.accuracy <= excellentAcc) {
    return "excellent";
  }
  if (pos.coords.accuracy <= goodAcc) {
    return "good";
  }
  if (pos.coords.accuracy <= fairAcc) {
    return "fair";
  }
  return "poor";
};

exports.formatGPSStrength = (function(_this) {
  return function(pos, T) {
    var strength, text, textClass;
    strength = exports.calculateGPSStrength(pos);
    switch (strength) {
      case "none":
        text = T('Waiting for GPS...');
        textClass = 'text-danger';
        break;
      case "poor":
        text = T('Very Low GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0));
        textClass = 'text-warning';
        break;
      case "fair":
        text = T('Low GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0));
        textClass = 'text-warning';
        break;
      case "good":
      case "excellent":
        text = T('Good GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0));
        textClass = 'text-success';
    }
    return {
      "class": textClass,
      text: text
    };
  };
})(this);
