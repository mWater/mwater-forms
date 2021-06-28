/// <reference types="node" />
import { EventEmitter } from "events";
import LocationFinder from "./LocationFinder";
import { PositionStrength } from "./utils";
/** Status of the position finding */
export interface PositionStatus {
    /** Best position found */
    pos: Position | null;
    /** Strength of GPS for position (based on accuracy) */
    strength: PositionStrength;
    /** Accuracy in meters */
    accuracy: number | null;
    /** True whether position is useable (great, or enough time passed) */
    useable: boolean;
    /** Amount of initial delay left in seconds */
    initialDelayLeft: number;
    /** Amount of delay before a good position is used */
    goodDelayLeft: number | null;
}
/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event.
 * Only call start once and be sure to call stop after */
export default class CurrentPositionFinder {
    eventEmitter: EventEmitter;
    locationFinder: LocationFinder;
    running: boolean;
    /** Number of seconds remaining in initial delay */
    initialDelayLeft: number;
    /** Interval handle to stop timer */
    initialDelayInterval: number | null;
    /** Number of seconds left in good delay (time waiting before using a "good" signal) */
    goodDelayLeft: number | null;
    /** Interval handle to stop timer */
    goodDelayInterval: number | null;
    strength: PositionStrength;
    pos: Position | null;
    error: string | null;
    constructor(options: {
        locationFinder: LocationFinder;
    });
    /** Start looking for position */
    start(): void;
    /** Stop looking for position */
    stop(): void;
    /** Listen for errors in getting position */
    on(event: "error", callback: () => void): void;
    /** Listen for position found */
    on(event: "found", callback: (position: Position) => void): void;
    /** Listen for status updates */
    on(event: "status", callback: (status: PositionStatus) => void): void;
    off(event: "error", callback: () => void): void;
    off(event: "found", callback: (position: Position) => void): void;
    off(event: "status", callback: (status: PositionStatus) => void): void;
    _reset(): void;
    locationFinderFound: (pos: Position) => void;
    locationFinderError: (err: string) => boolean;
    updateStatus(): void;
}
