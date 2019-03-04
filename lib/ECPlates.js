"use strict";

// Module that handles calling EC Compact Dry Plate automatic counting
var _;

_ = require('lodash');

exports.isAvailable = function (success, error) {
  if (window.OpenCVActivity != null) {
    return window.OpenCVActivity.processList(function (list) {
      if (_.contains(list, "ec-plate")) {
        return success(true);
      } else {
        return success(false);
      }
    });
  } else {
    return success(false);
  }
};

exports.processImage = function (imgUrl, success, error) {
  console.log("Processing image url: ".concat(imgUrl));
  return window.resolveLocalFileSystemURI(imgUrl, function (fileEntry) {
    var fullPath;
    fullPath = fileEntry.fullPath; // Handle bug in Cordova fullPath

    if (fullPath.match(/^file:\/\//)) {
      fullPath = fullPath.substring(7);
    }

    console.log("Got image fullPath: ".concat(fullPath));
    return OpenCVActivity.process("ec-plate", [fullPath], "EC Compact Dry Plate Counter", function (args) {
      return success(args);
    });
  }, this.error);
};