Form Questions have a context object which they use.

Fields:

### displayImage

Used by ImageQuestion and ImagesQuestion

Function which takes { id: image id, remove: function called when image deleted } as single parameter

### imageManager

Used by ImageQuestion and ImagesQuestion

Contains getImageThumbnailUrl(id, success, error) which returns url of image thumbnail

### imageAcquirer

Used by ImageQuestion and ImagesQuestion

Contains acquire(success, error)

Success is called with id of image, error with error message

### selectSite

Used by SiteQuestion

Function which takes success parameter. Success is called with code of site

### locationFinder

Used by all questions. Optional.

Override default locationFinder which is new LocationFinder
