
# Utility functions and classes for mwater-forms

# Gets the { angle, distance } from and to locations
exports.getRelativeLocation = (fromLoc, toLoc) =>
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