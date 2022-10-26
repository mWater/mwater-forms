import LocationFinder from "./LocationFinder";
import { ReactNode } from "react";
import { Row } from "mwater-expressions";
export interface StickyStorage {
    get(keyname: string): any;
    set(keyname: string, value: any): void;
}
/** Form Questions have a context object which they use. */
export interface FormContext {
    /** Used by ImageQuestion and ImagesQuestion */
    imageManager: ImageManager;
    /** Used by ImageQuestion and ImagesQuestion */
    imageAcquirer?: ImageAcquirer;
    /** Used by all questions. Optional. Override default locationFinder which is new LocationFinder */
    locationFinder?: LocationFinder;
    /** Used by LocationQuestion
     * Function which takes location object { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
     * and callback with new location object. Opens a map to the location and allows setting if onSet present.
     */
    displayMap?: (location: Location, onSet?: (location: Location) => void) => void;
    /** Stores key-value pairs for sticky questions. Object with two functions:
     * get(keyname) : gets object stored under keyname. null/undefined if none
     * set(keyname, value) : saves object as keyname
     */
    stickyStorage?: StickyStorage;
    /** Scans a barcode. Calls options.success with string if successful */
    scanBarcode?: (value: string) => void;
    /** Select an entity */
    selectEntity?: (options: {
        /** e.g. "water_point" */
        entityType: string;
        /** Optional filter of entities that are acceptable */
        filter?: any;
        /** called with _id of entity selected */
        callback: (entityId: string) => void;
    }) => void;
    /**
     * entityType: e.g. "water_point"
     * entityId: _id of entity
     * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void;
    /**
     * entityType: e.g. "water_point"
     * entityCode: code of entity
     * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityByCode: (entityType: string, entityCode: string, callback: (entity: any) => void) => void;
    /** Edit an entity
     * callback: is called when update is complete
     */
    editEntity?: (entityType: string, entityId: string, callback: () => void) => void;
    /** Renders an entity as a React element for summary (small box) */
    renderEntitySummaryView: (entityType: string, entity: any) => ReactNode;
    /** Renders an entity as a React element for list (compact) */
    renderEntityListItemView: (entityType: string, entity: any) => ReactNode;
    /** True if current user can edit the entity specified. Required if editEntity present */
    canEditEntity?: (entityType: string, entity: any) => boolean;
    /** Get all rows of a custom table
     * @param tableId table id e.g. custom.abc.xyz
     */
    getCustomTableRows: (tableId: string) => Promise<Row[]>;
    /** Get a specific row of a custom table */
    getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>;
    /** Select an asset with optional filter
     * @param assetSystemId id of the asset system
     * @param filter MongoDB-style filter on assets
     * @param callback called with _id of asset selected or null. Never called if cancelled
     */
    selectAsset?: (assetSystemId: number, filter: any, callback: (assetId: string | null) => void) => void;
    /** Renders an asset as a React element for summary (small box) */
    renderAssetSummaryView?: (assetSystemId: number, assetId: string) => ReactNode;
}
/** Used by ImageQuestion and ImagesQuestion */
export interface ImageManager {
    /** Gets url of image  */
    getImageUrl: (id: string, success: (url: string) => void, error: () => void) => void;
    /** Gets url of thumbnail of image  */
    getImageThumbnailUrl: (id: string, success: (url: string) => void, error: () => void) => void;
}
/** Used by ImageQuestion and ImagesQuestion */
export interface ImageAcquirer {
    /** Acquire an image. Success is called with id of image, error with error message */
    acquire(success: (imageId: string) => void, error: () => void): void;
}
interface Location {
    latitude: number;
    longitude: number;
    /** Elevation, taking into account mastHeight and depth if present */
    altitude?: number;
    accuracy?: number;
    altitudeAccuracy?: number;
}
export {};
