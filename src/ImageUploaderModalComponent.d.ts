import React from "react";

/** Based on http://www.matlus.com/html5-file-upload-with-progress/ */
export default class ImageUploaderModalComponent extends React.Component<{
  apiUrl: string
  client: string | null
  onCancel: () => void
  /** Called with id of image */
  onSuccess: (id: string) => void
  /** Localizer to use */
  T: (str: string, ...args: any[]) => string
  /** True to force use of camera */
  forceCamera?: boolean
}> {
  /** Static function to show modal easily */
  static show(apiUrl: string, client: string | null, T: (str: string, ...args: any[]) => string, success: (id: string) => void, forceCamera?: boolean): void
}
