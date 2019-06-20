/** Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
 * Pass storage as option (implementing localStorage API) to get caching of position */
export default class LocationFinder {
  constructor(options: { storage?: Storage }) 
   
  getLocation(success: (position: Position) => void, error: (err: any) => void): void 

  on(ev: "found", callback: (position: Position) => void): void
  on(ev: "error", callback: (error: any) => void): void

  pause(): void
  resume(): void
}

interface Storage {
  get: (key: string) => string | null
  set: (key: string, value: string) => string | null
}
