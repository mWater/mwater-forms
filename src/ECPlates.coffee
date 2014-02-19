# Module that handles calling EC Compact Dry Plate automatic counting
_ = require 'underscore'

exports.isAvailable = (success, error) ->
  if window.OpenCVActivity?
    window.OpenCVActivity.processList (list) =>
      if _.contains(list, "ec-plate")
        success(true)
      else
        success(false)
  else
    success(false)


exports.processImage = (imgUrl, success, error) ->
  console.log "Processing image url: #{imgUrl}"
  window.resolveLocalFileSystemURI imgUrl, (fileEntry) =>
    fullPath = fileEntry.fullPath

    # Handle bug in Cordova fullPath
    if fullPath.match /^file:\/\//
      fullPath = fullPath.substring(7)

    console.log "Got image fullPath: #{fullPath}"
    OpenCVActivity.process "ec-plate", [fullPath], "EC Compact Dry Plate Counter", (args) ->
      success(args)
  , @error
