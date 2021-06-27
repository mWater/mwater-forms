// Module that handles calling EC Compact Dry Plate automatic counting
import _ from 'lodash';

export function isAvailable(success, error) {
  if (window.OpenCVActivity != null) {
    return window.OpenCVActivity.processList(list => {
      if (_.contains(list, "ec-plate")) {
        return success(true);
      } else {
        return success(false);
      }
    });
  } else {
    return success(false);
  }
}

export function processImage(imgUrl, success, error) {
  console.log(`Processing image url: ${imgUrl}`);
  return window.resolveLocalFileSystemURI(imgUrl, fileEntry => {
    let {
      fullPath
    } = fileEntry;

    // Handle bug in Cordova fullPath
    if (fullPath.match(/^file:\/\//)) {
      fullPath = fullPath.substring(7);
    }

    console.log(`Got image fullPath: ${fullPath}`);
    return OpenCVActivity.process("ec-plate", [fullPath], "EC Compact Dry Plate Counter", args => success(args));
  }
  , this.error);
}
