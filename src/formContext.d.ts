import LocationFinder from "./LocationFinder";
import { ReactNode } from "react";
import { Row } from "mwater-expressions";

export interface StickyStorage {
  get(keyname: string): any
  set(keyname: string, value: any): void
}

/** Form Questions have a context object which they use. */
export interface FormContext {
  /** Used by ImageQuestion and ImagesQuestion */
  imageManager: ImageManager

  /** Used by ImageQuestion and ImagesQuestion */
  imageAcquirer?: ImageAcquirer

  /** Used by all questions. Optional. Override default locationFinder which is new LocationFinder */
  locationFinder?: LocationFinder

  /** Used by LocationQuestion
   * Function which takes location object { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
   * and callback with new location object. Opens a map to the location and allows setting if onSet present.
   */
  displayMap?: (location: Location, onSet?: (location: Location) => void) => void

  /** Stores key-value pairs for sticky questions. Object with two functions:
   * get(keyname) : gets object stored under keyname. null/undefined if none
   * set(keyname, value) : saves object as keyname
   */
  stickyStorage?: StickyStorage

  /** Scans a barcode. Calls options.success with string if successful */
  scanBarcode?: (value: string) => void

  /** Select an entity */
  selectEntity?: (options: {
    /** e.g. "water_point" */
    entityType: string 
    /** Optional filter of entities that are acceptable */
    filter?: any
    /** called with _id of entity selected */
    callback: (entityId: string) => void
  }) => void

  /** 
   * entityType: e.g. "water_point"
   * entityId: _id of entity
   * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
   */
  getEntityById?: (entityType: string, entityId: string, callback: (entity: any) => void) => void

  /** 
   * entityType: e.g. "water_point"
   * entityCode: code of entity
   * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
   */
  getEntityByCode?: (entityType: string, entityCode: string, callback: (entity: any) => void) => void

  /** Edit an entity
   * callback: is called when update is complete
   */
  editEntity?: (entityType: string, entityId: string, callback: () => void) => void

  /** Renders an entity as a React element for summary (small box) */
  renderEntitySummaryView?: (entityType: string, entity: any) => ReactNode

  /** Renders an entity as a React element for list (compact) */
  renderEntityListItemView?: (entityType: string, entity: any) => ReactNode

  /** True if current user can edit the entity specified. Required if editEntity present */
  canEditEntity?: (entityType: string, entity: any) => boolean

  /** Get all rows of a custom table 
   * @param tableId table id e.g. custom.abc.xyz
  */
  getCustomTableRows: (tableId: string) => Promise<Row[]>

  /** Get a specific row of a custom table */
  getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>

  /** DEPRECATED */
  //getUniqueCode()
  //returns a unique mWater code (e.g. 10007) if one is available

  /** DEPRECATED */
  // getProperties(type)
  // Gets all properties for an entity type (e.g. "water_point"). Note: synchronous call!

  /** DEPRECATED */
  // getProperty(id)
  // Gets a property by _id. Note: synchronous call!

  /** DEPRECATED */
  // getUnit(code)
  // Gets a unit by code. Note: synchronous call!

  /** DEPRECATED */
  // formEntity --- deprecated!!
  // Entity set at form level. Entire entity object

  /** DEPRECATED. Only used by a few legacy forms */
  //getAdminRegionPath(id, callback)
  // Gets complete path (country downward) for an administrative region
  // Callback (error, [{ id:, level: e.g. 1, name: e.g. "Manitoba", full_name: e.g. "Manitoba, Canada", type: e.g. "Province" }, ...] in level ascending order)
    
  /** DEPRECATED. Only used by a few legacy forms */
  // getSubAdminRegions(id, level, callback)
  // Gets list of adminstrative regions at a level that are under a region. 
  // Callback (error, [{ id:, level: e.g. 1, name: e.g. "Manitoba", full_name: e.g. "Manitoba, Canada", type: e.g. "Province" }, ...])

  /** DEPRECATED. Only used by a few legacy forms */
  // findAdminRegionByLatLng(lat, lng, callback)
  // Gets id for an admin region by lat/lng
  // Callback (error, id)
}

/** Used by ImageQuestion and ImagesQuestion */
export interface ImageManager {
  /** Gets url of image  */
  getImageUrl: (id: string, success: (url: string) => void, error: () => void) => void
  
  /** Gets url of thumbnail of image  */
  getImageThumbnailUrl: (id: string, success: (url: string) => void, error: () => void) => void
}

/** Used by ImageQuestion and ImagesQuestion */
export interface ImageAcquirer {
  /** Acquire an image. Success is called with id of image, error with error message */
  acquire(success: (imageId: string) => void, error: () => void): void
}

interface Location {
  latitude: number
  longitude: number
  /** Elevation, taking into account mastHeight and depth if present */
  altitude?: number 
  accuracy?: number 
  altitudeAccuracy?: number
}