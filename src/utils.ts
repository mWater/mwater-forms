// Utility functions and classes for mwater-forms

export type PositionStrength = "none" | "poor" | "fair" | "good" | "excellent"


/** Gets the { angle, distance } from and to locations */
export function getRelativeLocation(fromLoc: { latitude: number, longitude: number }, toLoc: { latitude: number, longitude: number }) {
  const x1 = fromLoc.longitude
  const y1 = fromLoc.latitude
  const x2 = toLoc.longitude
  const y2 = toLoc.latitude

  // Convert to relative position (approximate)
  const dy = ((y2 - y1) / 57.2957795) * 6371000
  const dx = ((Math.cos(y1 / 57.2957795) * (x2 - x1)) / 57.2957795) * 6371000

  // Determine direction and angle
  const distance = Math.sqrt(dx * dx + dy * dy)
  let angle = 90 - Math.atan2(dy, dx) * 57.2957795
  if (angle < 0) {
    angle += 360
  }
  if (angle > 360) {
    angle -= 360
  }

  return { angle, distance }
}

export function getCompassBearing(angle: any, T: any) {
  // Get approximate direction
  const compassDir = Math.floor((angle + 22.5) / 45) % 8
  const compassStrs = [T("N"), T("NE"), T("E"), T("SE"), T("S"), T("SW"), T("W"), T("NW")]
  return compassStrs[compassDir]
}

export function formatRelativeLocation(relLoc: any, T: any) {
  let distance
  if (relLoc.distance > 1000) {
    distance = (relLoc.distance / 1000).toFixed(1) + " " + T("km")
  } else {
    distance = relLoc.distance.toFixed(0) + " " + T("m")
  }

  return distance + " " + getCompassBearing(relLoc.angle, T)
}

/** Calculates the relative strength of a GPS signal into "none", "poor", "fair", "good" or "excellent" */
export function calculateGPSStrength(pos?: GeolocationPosition | null): PositionStrength {
  const excellentAcc = 5
  const goodAcc = 10
  const fairAcc = 50
  // Recent is 90 seconds because some devices update only once per minute if no movement
  const recentThreshold = 90000

  if (!pos) {
    return "none"
  }

  // If old, accuracy is none
  if (pos.timestamp < new Date().getTime() - recentThreshold) {
    return "none"
  }

  if (pos.coords.accuracy <= excellentAcc) {
    return "excellent"
  }

  if (pos.coords.accuracy <= goodAcc) {
    return "good"
  }

  if (pos.coords.accuracy <= fairAcc) {
    return "fair"
  }

  return "poor"
}

// Format GPS strength in human-readable, Bootstrap-friendly way
export let formatGPSStrength = (pos: any, T: any) => {
  let text, textClass
  const strength = calculateGPSStrength(pos)
  switch (strength) {
    case "none":
      text = T("Waiting for GPS...")
      textClass = "text-danger"
      break
    case "poor":
      text = T("Very Low GPS Signal ±{0}m", pos.coords.accuracy.toFixed(0))
      textClass = "text-warning"
      break
    case "fair":
      text = T("Low GPS Signal ±{0}m", pos.coords.accuracy.toFixed(0))
      textClass = "text-warning"
      break
    case "good":
    case "excellent":
      text = T("Good GPS Signal ±{0}m", pos.coords.accuracy.toFixed(0))
      textClass = "text-success"
      break
  }

  return { class: textClass, text }
}
