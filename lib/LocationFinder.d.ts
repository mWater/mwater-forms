/// <reference types="node" />
declare class LocationFinder {
    constructor(options: any);
    on: (event: any, callback: any) => any;
    off: (event: any, callback: any) => any;
    cacheLocation(pos: any): any;
    getCachedLocation(): any;
    getLocation(success: any, error: any): NodeJS.Timeout | undefined;
    startWatch(): NodeJS.Timeout | undefined;
    stopWatch(): void;
    pause: () => undefined;
    resume: () => number | undefined;
}
export default LocationFinder;
