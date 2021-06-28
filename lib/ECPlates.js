"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = exports.isAvailable = void 0;
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// Module that handles calling EC Compact Dry Plate automatic counting
const lodash_1 = __importDefault(require("lodash"));
function isAvailable(success, error) {
    if (window.OpenCVActivity != null) {
        return window.OpenCVActivity.processList((list) => {
            if (lodash_1.default.contains(list, "ec-plate")) {
                return success(true);
            }
            else {
                return success(false);
            }
        });
    }
    else {
        return success(false);
    }
}
exports.isAvailable = isAvailable;
function processImage(imgUrl, success, error) {
    console.log(`Processing image url: ${imgUrl}`);
    return window.resolveLocalFileSystemURI(imgUrl, (fileEntry) => {
        let { fullPath } = fileEntry;
        // Handle bug in Cordova fullPath
        if (fullPath.match(/^file:\/\//)) {
            fullPath = fullPath.substring(7);
        }
        console.log(`Got image fullPath: ${fullPath}`);
        return OpenCVActivity.process("ec-plate", [fullPath], "EC Compact Dry Plate Counter", (args) => success(args));
    }, error);
}
exports.processImage = processImage;
