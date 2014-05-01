Backbone = require 'backbone'
_ = require 'underscore'

# HTML5 Device Orientation Normalizer
# Subscribes to the default 'deviceorientation' event and
# then publishes normalized values under the custom event 'orientationChange'
# orientationFinder.active property will tell you if the device 
# supports orientation events and if they are active
class OrientationFinder
  constructor: ->
    _.extend @, Backbone.Events
    @active = false

  startWatch: =>
    if window.DeviceOrientationEvent and not @active
      window.addEventListener "deviceorientation", @orientationChange, false
      @active = true

  stopWatch: ->
    if window.DeviceOrientationEvent
      window.removeEventListener "deviceorientation", @orientationChange, false
      @active = false

  getNormalizerKey: (ua) ->
    userAgent = ua or window.navigator.userAgent

    if userAgent.match(/(iPad|iPhone|iPod)/i) then return "ios"
    else if userAgent.match(/Firefox/i) then return "firefox"
    else if userAgent.match(/Opera/i) then return "opera"
    else if userAgent.match(/Android/i)
      if userAgent.match(/Chrome/i) then return "android_chrome"
      else return "android_stock"
    else return "unknown"

  cloneEvent: (e) ->
    return {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
      absolute: e.absolute
    }

  # Normalization functions to adjust the alpha value based
  # on how the browser implemented as well as the devices current
  # orientation.
  normalize: (key, eventData) ->
    normalizers = {
      # Firefox rotates counter clockwise
      firefox: (e) =>
        normalized = @cloneEvent e
        normalized.alpha = normalized.alpha * -1
        normalized.alpha = normalized.alpha - ( window.orientation or 0)
        return normalized

      # Android stock starts facing West
      android_stock: (e) =>
        normalized = @cloneEvent e
        normalized.alpha = (normalized.alpha + 270) % 360
        normalized.alpha = normalized.alpha - ( window.orientation or 0)
        return normalized

      # Android Chrome is good to go
      android_chrome: (e) =>
        normalized = @cloneEvent e
        normalized.alpha = normalized.alpha - ( window.orientation or 0)
        return normalized

      # Opera Mobile is good to go
      opera: (e) =>
        normalized = @cloneEvent e
        normalized.alpha = normalized.alpha - ( window.orientation or 0)
        return normalized

      # IOS uses a custom property and rotates counter clockwise
      ios: (e) =>
        normalized = @cloneEvent e
        # Use the custom IOS property otherwise it will be relative
        if e.webkitCompassHeading
          normalized.alpha = e.webkitCompassHeading

        # IOS is counter clockwise
        normalized.alpha = (normalized.alpha * -1) - ( window.orientation or 0)
        return normalized

      # Fall through to normalize based on Chrome Desktop
      unknown: (e) =>
        normalized = @cloneEvent e
        normalized.alpha = normalized.alpha * -1
        return normalized
    }
    return normalizers[key](eventData)

  # Normalize based on user agent
  orientationChange: (e, ua) =>
    if e.alpha == null then @active = false
    normalizerKey = @getNormalizerKey ua
    normalizedValues = @normalize normalizerKey, e
    
    @trigger "orientationChange", {
      orientation: window.orientation or 0
      normalizerKey: normalizerKey
      raw: @cloneEvent(e)
      normalized: normalizedValues
    }

module.exports = OrientationFinder