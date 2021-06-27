// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// Module that handles calling EC Compact Dry Plate automatic counting
import _ from "lodash"

export function isAvailable(success: any, error: any) {
  if (window.OpenCVActivity != null) {
    return window.OpenCVActivity.processList((list: any) => {
      if (_.contains(list, "ec-plate")) {
        return success(true)
      } else {
        return success(false)
      }
    });
  } else {
    return success(false)
  }
}

export function processImage(this: any, imgUrl: any, success: any, error: any) {
  console.log(`Processing image url: ${imgUrl}`)
  return window.resolveLocalFileSystemURI(
    imgUrl,
    (fileEntry: any) => {
      let { fullPath } = fileEntry

      // Handle bug in Cordova fullPath
      if (fullPath.match(/^file:\/\//)) {
        fullPath = fullPath.substring(7)
      }

      console.log(`Got image fullPath: ${fullPath}`)
      return OpenCVActivity.process("ec-plate", [fullPath], "EC Compact Dry Plate Counter", (args: any) => success(args));
    },
    this.error
  );
}
