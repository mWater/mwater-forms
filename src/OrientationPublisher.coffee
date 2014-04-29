Backbone = require 'backbone'
_ = require 'underscore'

orientationPublisher = { active: false }
_.extend orientationPublisher, Backbone.Events

orientationPublisher.init = ->
  if window.DeviceOrientationEvent and not orientationPublisher.active
    window.addEventListener "deviceorientation", orientationPublisher.orientationChange, false
    orientationPublisher.active = true

orientationPublisher.getNormalizerKey = (ua) ->
  userAgent = ua or window.navigator.userAgent

  if userAgent.match(/(iPad|iPhone|iPod)/i) then return "ios"
  else if userAgent.match(/Firefox/i) then return "firefox"
  else if userAgent.match(/Opera/i) then return "opera"
  else if userAgent.match(/Android/i)
    if userAgent.match(/Chrome/i) then return "android_chrome"
    else return "android_stock"
  else return "unknown"

orientationPublisher.cloneEvent = (e) ->
  return {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma,
    absolute: e.absolute
  }

orientationPublisher.normalizers = {
  #Firefox rotates counter clockwise
  firefox: (e) ->
    normalized = orientationPublisher.cloneEvent e
    normalized.alpha = normalized.alpha * -1;
    normalized.alpha = normalized.alpha - ( window.orientation or 0)
    return normalized

  #Android stock starts facing West
  android_stock: (e) ->
    normalized = orientationPublisher.cloneEvent e
    normalized.alpha = (normalized.alpha + 270) % 360;
    normalized.alpha = normalized.alpha - ( window.orientation or 0)
    return normalized

  #Android Chrome is good to go
  android_chrome: (e) ->
    normalized = orientationPublisher.cloneEvent e
    normalized.alpha = normalized.alpha - ( window.orientation or 0)
    return normalized

  #Opera Mobile is good to go
  opera: (e) ->
    normalized = orientationPublisher.cloneEvent e
    normalized.alpha = normalized.alpha - ( window.orientation or 0)
    return normalized

  #IOS uses a custom property and rotates counter clockwise
  ios: (e) ->
    normalized = orientationPublisher.cloneEvent e;
    #use the custom IOS property otherwise it will be relative
    if e.webkitCompassHeading
      normalized.alpha = e.webkitCompassHeading;

    #IOS is counter clockwise
    normalized.alpha = (normalized.alpha * -1) - ( window.orientation or 0);
    return normalized

  unknown: (e) ->
    normalized = orientationPublisher.cloneEvent e
    normalized.alpha = normalized.alpha * -1;
    return normalized
}

orientationPublisher.orientationChange = (e, ua) ->
  normalizerKey = orientationPublisher.getNormalizerKey ua
  normalizedValues = orientationPublisher.normalizers[normalizerKey] e
  
  orientationPublisher.trigger "orientationChange", {
    orientation: window.orientation or 0
    normalizerKey: normalizerKey
    raw: orientationPublisher.cloneEvent(e)
    normalized: normalizedValues
  }

module.exports = orientationPublisher; 