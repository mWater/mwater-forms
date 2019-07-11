/** Used by ImageQuestion and ImagesQuestion */
export interface ImageManager {
  getImageUrl: (id: string, success: (url: string) => void, error: () => void) => void
  
  /** Returns url of thumbnail of image  */
  getImageThumbnailUrl: (id: string, success: (url: string) => void, error: () => void) => void
}

/** Used by ImageQuestion and ImagesQuestion */
export interface ImageAcquirer {
  /** Acquire an image */
  acquire(success: (imageId: string) => void, error: () => void): void
}


