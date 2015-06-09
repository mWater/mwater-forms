Form Questions have a context object which they use.

Fields:

### displayImage

Used by ImageQuestion and ImagesQuestion

Function which takes { id: image id, remove: function called when image deleted, setCover: function called to set image cover } as single parameter

### imageManager

Used by ImageQuestion and ImagesQuestion

Contains getImageThumbnailUrl(id, success, error) which returns url of image thumbnail

### imageAcquirer

Used by ImageQuestion and ImagesQuestion

Contains acquire(success, error)

Success is called with id of image, error with error message

### selectSite

Used by SiteQuestion

Function which takes siteTypes and success parameters. Success is called with code of site.

siteTypes is array of acceptable site types or null for all

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
type: entity type
filter: optional filter of entities that are acceptable
selectProperties: properties to display in the list when selecting
mapProperty: optional property to map with
callback: called with _id of entity selected

## getEntity(type, _id, callback)

callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found

entity includes pseudo-property _editable (true/false) to indicate if entity can be edited

## getProperty(id)

Gets a property by _id. Note: synchronous call!

## getUnit(code)

Gets a unit by code. Note: synchronous call!

## formEntity --- deprecated!!

Entity set at form level. Entire entity object

## editEntity(type, _id, callback)

callback: is called when update is complete