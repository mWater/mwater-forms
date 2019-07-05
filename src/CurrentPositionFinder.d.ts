import LocationFinder from "./LocationFinder";

/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
 * Only call start once and be sure to call stop after
 */
export default class CurrentPositionFinder {
  /** Use a location finder that is passed in */
  constructor(options: { locationFinder: LocationFinder })

  /** Start looking for position */
  start(): void

  /** Stop looking for position */
  stop(): void

  /** Listen for errors in getting position */
  on(event: "error", callback: () => void): void
  off(event: "error", callback: () => void): void

  /** Listen for position found */
  on(event: "found", callback: (position: Position) => void): void
  off(event: "found", callback: (position: Position) => void): void

  /** Listen for status updates */
  on(event: "status", callback: (status: PositionStatus) => void): void
  off(event: "status", callback: (status: PositionStatus) => void): void
}

/** Status of the position finding */
export interface PositionStatus {
  /** Best position found */
  pos: Position | null

  /** Strength of GPS for position (based on accuracy) */
  strength: PositionStrength

  /** Accuracy in meters */
  accuracy: number | null

  /** True whether position is useable (great, or enough time passed) */
  useable: boolean
}

export type PositionStrength = "none" | "poor" | "fair" | "good" | "excellent"
