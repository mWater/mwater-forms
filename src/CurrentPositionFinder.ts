import _ from 'lodash'
import EventEmitter from 'events'
import LocationFinder from './LocationFinder'
import { calculateGPSStrength, PositionStrength } from './utils'

const initialDelay = 10
const goodDelay = 5

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

  /** Amount of initial delay left in seconds */
  initialDelayLeft: number

  /** Amount of delay before a good position is used */
  goodDelayLeft: number | null
}

/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
 * Only call start once and be sure to call stop after */
export default class CurrentPositionFinder {
  eventEmitter: EventEmitter
  locationFinder: LocationFinder
  running: boolean
  /** Number of seconds remaining in initial delay */
  initialDelayLeft: number
  /** Interval handle to stop timer */
  initialDelayInterval: number | null

  /** Number of seconds left in good delay (time waiting before using a "good" signal) */
  goodDelayLeft: number | null

  /** Interval handle to stop timer */
  goodDelayInterval: number | null

  strength: PositionStrength

  pos: Position | null
  error: string | null

  constructor(options: { locationFinder: LocationFinder }) {
    this.running = false

    // Add events
    this.eventEmitter = new EventEmitter()

    // "error" messages are handled specially and will crash if not handled!
    this.eventEmitter.on('error', () => {})

    this.locationFinder = options.locationFinder
    this._reset()
  }

  /** Start looking for position */
  start(): void {
    if (this.running) {
      this.stop()
    }

    this._reset()

    this.running = true
    this.locationFinder.on("found", this.locationFinderFound)
    this.locationFinder.on("error", this.locationFinderError)
    this.locationFinder.startWatch()

    // Update status
    this.updateStatus()

    // Start initial delay countdown
    this.initialDelayInterval = window.setInterval(() => {
      if (this.initialDelayLeft) {
        this.initialDelayLeft -= 1
        this.updateStatus()
      }
    }, 1000)
  }

  /** Stop looking for position */
  stop(): void {
    if (!this.running) {
      return
    }

    this.running = false
    this.locationFinder.stopWatch()
    this.locationFinder.off("found", this.locationFinderFound)
    this.locationFinder.off("error", this.locationFinderError)

    if (this.initialDelayInterval) {
      window.clearInterval(this.initialDelayInterval)
    }
    if (this.goodDelayInterval) {
      window.clearInterval(this.goodDelayInterval)
    }

    this.initialDelayInterval = null
  }

  /** Listen for errors in getting position */
  on(event: "error", callback: () => void): void
  /** Listen for position found */
  on(event: "found", callback: (position: Position) => void): void
  /** Listen for status updates */
  on(event: "status", callback: (status: PositionStatus) => void): void
  on(event: string, callback: (args: any) => void): void {
    this.eventEmitter.on(event, callback)
  }

  off(event: "error", callback: () => void): void;
  off(event: "found", callback: (position: Position) => void): void;
  off(event: "status", callback: (status: PositionStatus) => void): void;
  off(event: string, callback: (args: any) => void) {
    this.eventEmitter.removeListener(event, callback)
  }

  _reset() {
    this.running = false
    this.initialDelayLeft = initialDelay
    this.goodDelayLeft = null

    this.strength = 'none'
    this.pos = null
  }

  locationFinderFound = (pos: Position) => {
    // Calculate strength of new position
    const newStrength = calculateGPSStrength(pos)

    // If none, do nothing
    if (newStrength === "none") {
      return
    }

    // Replace position if better
    if (!this.pos || (pos.coords.accuracy <= this.pos.coords.accuracy)) {
      this.pos = pos
    }

    // Update status
    this.updateStatus()

    // Start good delay if needed
    if (!this.goodDelayInterval && (this.strength === "good")) {
      this.goodDelayLeft = goodDelay

      // Start good delay countdown
      this.goodDelayInterval = window.setInterval(() => {
        if (this.goodDelayLeft == null) {
          return
        }

        this.goodDelayLeft -= 1
        this.updateStatus()
        if (this.goodDelayLeft <= 0) {
          if (this.running) {
            this.stop()
            this.eventEmitter.emit('found', this.pos)
          }
        }
      }, 1000)
    }

    // Set position if excellent
    if (this.strength === "excellent") {
      this.stop()
      this.eventEmitter.emit('found', this.pos)
    }
  }

  locationFinderError = (err: string) => {
    this.stop()
    this.error = err
    return this.eventEmitter.emit('error', err)
  }

  updateStatus() {
    this.strength = calculateGPSStrength(this.pos)
    const useable = (this.initialDelayLeft <= 0 && ["fair", "poor"].includes(this.strength)) || (this.strength === "good")
    
    // Trigger status
    this.eventEmitter.emit('status', { 
      strength: this.strength, 
      pos: this.pos, 
      useable: useable, 
      accuracy: (this.pos != null ? this.pos.coords.accuracy : undefined),
      initialDelayLeft: this.initialDelayLeft,
      goodDelayLeft: this.goodDelayLeft
    })
  }
}
