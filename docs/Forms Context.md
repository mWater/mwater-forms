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

### locationFinder

Used by all questions. Optional.

Override default locationFinder which is new LocationFinder

### displayMap

Used by LocationQuestion

Function which takes location object { latitude, longitude, accuracy, altitude?, altitudeAccuracy? } and callback with new location object
Opens a map to the location and allows setting.

## stickyStorage

Stores key-value pairs for sticky questions. Object with two functions:
get(keyname) : gets object stored under keyname. null/undefined if none
set(keyname, value) : saves object as keyname

## scanBarcode

Scans a barcode. Calls options.success with string if successful

## selectEntity(<options>)

Function which takes options:
entityType: entity type
filter: optional filter of entities that are acceptable
callback: called with _id of entity selected

## getEntityById(entityType, entityId, callback)

callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found

## getEntityByCode(entityType, entityCode, callback)

callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found

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

Renders an entity as a React element for summary (small box)

# renderEntityListItemView(entityType, entity) 

Renders an entity as a React element for list (compact)

## canEditEntity(entityType, entity)

True if current user can edit the entity specified

## getAdminRegionPath(id, callback)

Gets complete path (country downward) for an administrative region
Callback (error, [{ id:, level: e.g. 1, name: e.g. "Manitoba", full_name: e.g. "Manitoba, Canada", type: e.g. "Province" }, ...] in level ascending order)
    
## getSubAdminRegions(id, level, callback)

Gets list of adminstrative regions at a level that are under a region. 
Callback (error, [{ id:, level: e.g. 1, name: e.g. "Manitoba", full_name: e.g. "Manitoba, Canada", type: e.g. "Province" }, ...])

## findAdminRegionByLatLng(lat, lng, callback)

Gets id for an admin region by lat/lng
Callback (error, id)
