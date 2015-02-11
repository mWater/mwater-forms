
# Utility functions and classes for mwater-forms

# Gets the { angle, distance } from and to locations
exports.getRelativeLocation = (fromLoc, toLoc) ->
  x1 = fromLoc.longitude
  y1 = fromLoc.latitude
  x2 = toLoc.longitude
  y2 = toLoc.latitude
  
  # Convert to relative position (approximate)
  dy = (y2 - y1) / 57.2957795 * 6371000
  dx = Math.cos(y1 / 57.2957795) * (x2 - x1) / 57.2957795 * 6371000
  
  # Determine direction and angle
  distance = Math.sqrt(dx * dx + dy * dy)
  angle = 90 - (Math.atan2(dy, dx) * 57.2957795)
  angle += 360 if angle < 0
  angle -= 360 if angle > 360

  return { angle: angle, distance: distance }

exports.getCompassBearing = (angle, T) ->
  # Get approximate direction
  compassDir = (Math.floor((angle + 22.5) / 45)) % 8
  compassStrs = [T("N"), T("NE"), T("E"), T("SE"), T("S"), T("SW"), T("W"), T("NW")]
  return compassStrs[compassDir]

exports.formatRelativeLocation = (relLoc, T) ->
  if relLoc.distance > 1000
    distance = (relLoc.distance / 1000).toFixed(1) + " " + T("km")
  else
    distance = (relLoc.distance).toFixed(0) + " " + T("meters")

  return distance + " " + exports.getCompassBearing(relLoc.angle, T)

# Calculates the relative strength of a GPS signal into "none", "poor", "fair", "good" or "excellent"
exports.calculateGPSStrength = (pos) ->
  excellentAcc = 5
  goodAcc = 10
  fairAcc = 50
  # Recent is 90 seconds because some devices update only once per minute if no movement
  recentThreshold = 90000

  if not pos
    return "none"

  # If old, accuracy is none
  if pos.timestamp < new Date().getTime() - recentThreshold
    return "none"

  if pos.coords.accuracy <= excellentAcc
    return "excellent"

  if pos.coords.accuracy <= goodAcc
    return "good"

  if pos.coords.accuracy <= fairAcc
    return "fair"

  return "poor"

# Format GPS strength in human-readable, Bootstrap-friendly way
exports.formatGPSStrength = (pos, T) =>
  strength = exports.calculateGPSStrength(pos)
  switch strength
    when "none"
      text = T('Waiting for GPS...')
      textClass = 'text-danger'
    when "poor"
      text = T('Very Low GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0))
      textClass = 'text-warning'
    when "fair"
      text = T('Low GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0))
      textClass = 'text-warning'
    when "good", "excellent"
      text = T('Good GPS Signal ±{0}m', pos.coords.accuracy.toFixed(0))
      textClass = 'text-success'
      
  return { class: textClass, text: text } 