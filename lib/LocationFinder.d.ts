/// <reference types="node" />
import { EventEmitter } from "events";
export interface Storage {
    get: (key: string) => string | null;
    set: (key: string, value: string) => string | null;
}
/** Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
 * Pass storage as option (implementing localStorage API) to get caching of position */
export default class LocationFinder {
    eventEmitter: EventEmitter;
    storage: Storage | undefined;
    watchCount: number;
    locationWatchId: number | undefined;
    constructor(options?: {
        storage?: Storage;
    });
    on(ev: "found", callback: (position: GeolocationPosition) => void): void;
    on(ev: "error", callback: (error: any) => void): void;
    off(ev: "found", callback: (position: GeolocationPosition) => void): void;
    off(ev: "error", callback: (error: any) => void): void;
    cacheLocation(pos: any): void;
    getCachedLocation(): any;
    getLocation(success: (position: GeolocationPosition) => void, error: (err: any) => void): void;
    /** Start watching current location */
    startWatch(): NodeJS.Timeout | undefined;
    /** Stop watching current location */
    stopWatch(): void;
    pause: () => void;
    resume: () => void;
}
