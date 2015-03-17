var _;

_ = require('underscore');

exports.isAvailable = function(success, error) {
  if (window.OpenCVActivity != null) {
    return window.OpenCVActivity.processList((function(_this) {
      return function(list) {
        if (_.contains(list, "ec-plate")) {
          return success(true);
        } else {
          return success(false);
        }
      };
    })(this));
  } else {
    return success(false);
  }
};

exports.processImage = function(imgUrl, success, error) {
  console.log("Processing image url: " + imgUrl);
  return window.resolveLocalFileSystemURI(imgUrl, (function(_this) {
    return function(fileEntry) {
      var fullPath;
      fullPath = fileEntry.fullPath;
      if (fullPath.match(/^file:\/\//)) {
        fullPath = fullPath.substring(7);
      }
      console.log("Got image fullPath: " + fullPath);
      return OpenCVActivity.process("ec-plate", [fullPath], "EC Compact Dry Plate Counter", function(args) {
        return success(args);
      });
    };
  })(this), this.error);
};
