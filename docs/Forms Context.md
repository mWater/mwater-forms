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