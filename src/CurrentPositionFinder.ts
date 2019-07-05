import _ from 'lodash'
import EventEmitter from 'events'
import LocationFinder from './LocationFinder'
import { calculateGPSStrength, PositionStrength } from './utils'

const initialDelay = 10000
const goodDelay = 5000

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

/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
 * Only call start once and be sure to call stop after */
export default class CurrentPositionFinder {
  eventEmitter: EventEmitter
  locationFinder: LocationFinder
  running: boolean
  initialDelayComplete: boolean
  goodDelayRunning: boolean
  strength: PositionStrength
  useable: boolean
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

    setTimeout(this.afterInitialDelay, initialDelay)
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
    this.initialDelayComplete = false
    this.goodDelayRunning = false

    this.strength = 'none'
    this.pos = null
    this.useable = false
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
    if (!this.goodDelayRunning && (this.strength === "good")) {
      setTimeout(this.afterGoodDelay, goodDelay)
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
    this.useable = (this.initialDelayComplete && ["fair", "poor"].includes(this.strength)) || (this.strength === "good")
    
    // Trigger status
    return this.eventEmitter.emit('status', { strength: this.strength, pos: this.pos, useable: this.useable, accuracy: (this.pos != null ? this.pos.coords.accuracy : undefined) })
  }

  afterInitialDelay = () => {
    // Set useable if strength is not none
    this.initialDelayComplete = true
    if (this.running) { 
      this.updateStatus()
    }
  }

  afterGoodDelay = () => {
    if (this.running) {
      this.stop()
      this.eventEmitter.emit('found', this.pos)
    }
  }
}
