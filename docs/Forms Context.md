Form Questions have a context object which they use.

Fields:

### imageManager

Used by ImageQuestion and ImagesQuestion

Contains:

getImageUrl(id, success, error) which returns url of image 

getImageThumbnailUrl(id, success, error) which returns url of thumbnail of image 

### imageAcquirer

Used by ImageQuestion and ImagesQuestion

Contains acquire(success, error)

Success is called with id of image, error with error message

### selectSite

Used by SiteQuestion

Function which takes siteTypes and success parameters. Success is called with code of site.

siteType is type of entity (e.g. "water_point")

### getSite

Used by SiteQuestion

Function which takes site code, success, error. Success is called with site document.
 
(optional)

### locationFinder

Used by all questions. Optional.

Override default locationFinder which is new LocationFinder

### displayMap

Used by LocationQuestion

Function which takes location object ( latitude, longitude, accuracy, altitude?, altitudeAccuracy? )
Opens a map to the location

## stickyStorage

Stores key-value pairs for sticky questions. Object with two functions:
get(keyname) : gets object stored under keyname. null/undefined if none
set(keyname, value) : saves object as keyname

## scanBarcode

Scans a barcode. Calls options.success with string if successful

## selectEntity(<options>)

Function which takes options:
title: title of popup screen
entityType: entity type
filter: optional filter of entities that are acceptable
callback: called with _id of entity selected

## getEntityById(entityType, entityId, callback)

callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found

entity includes pseudo-property `_editable` (true/false) to indicate if entity can be edited. Default is false

## getEntityByCode(entityType, entityCode, callback)

callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found

entity includes pseudo-property `_editable` (true/false) to indicate if entity can be edited. Default is false

## getProperty(id)

Gets a property by _id. Note: synchronous call!

## getUnit(code)

Gets a unit by code. Note: synchronous call!

## formEntity --- deprecated!!

Entity set at form level. Entire entity object

## editEntity(type, _id, callback)

callback: is called when update is complete

## getUniqueCode()

returns a unique mWater code (e.g. 10007) if one is available

## getProperties(type)

Gets all properties for an entity type (e.g. "water_point"). Note: synchronous call!

## renderEntitySummaryView(entityType, entity)

Renders an entity as a React element.

## canEditEntity(entityType, entity)

True if current user can edit the entity specified