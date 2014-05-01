OrientationFinder = require('../src/OrientationFinder')
assert = require('chai').assert
orientationFinder = new OrientationFinder()

console.log orientationFinder
describe "OrientationFinder", ->

  beforeEach -> 
    @event = { 
      alpha: 90
      beta: 10
      gamma: 10
      absolute: true
    }
  userAgents = {
    iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25",
    ipad: "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25 (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)",
    opera: "Opera/9.80 (Android; Opera Mini/7.5.33361/31.1448; U; en) Presto/2.8.119 Version/11.1010",
    androidChrome: "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19",
    androidStock: "Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
    firefox: "Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0",
    IEMobile: "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)",
    chromeDesktop: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
    IE8Desktop: "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3)"
  }  

  describe "getNormalizerKey", ->
    it "should return ios when an IPhone user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.iphone)
      assert.equal key, 'ios'

    it "should return ios when an IPad user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.ipad)
      assert.equal key, 'ios'

    it "should return opera when an Opera user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.opera)
      assert.equal key, 'opera'

    it "should return android_chrome when Chrome for Android user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.androidChrome)
      assert.equal key, 'android_chrome'

    it "should return android_stock when stock Android browser user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.androidStock)
      assert.equal key, 'android_stock'

    it "should return unknown when IE mobile user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.IEMobile)
      assert.equal key, 'unknown'

    it "should return unknown when Chrome desktop user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.chromeDesktop)
      assert.equal key, 'unknown'

    it "should return unknown when IE8 user agent is passed in", ->
      key = orientationFinder.getNormalizerKey(userAgents.IE8Desktop)
      assert.equal key, 'unknown'

  describe "cloneEvent", ->
    it "should copy the alpha, beta, gamma, and absolute properties", ->
      clone = orientationFinder.cloneEvent @event
      assert.property clone, "alpha"
      assert.property clone, "beta"
      assert.property clone, "gamma"
      assert.property clone, "absolute"
      assert.deepEqual clone, @event
      assert.isFalse clone == @event

  describe "normalizers", -> 

    describe "Firefox", -> 
      it "should negate the alpha value", ->
        e = orientationFinder.normalize "firefox", @event
        assert.equal e.alpha, -90

    describe "Android Stock", ->
      it "should compensate for starting facing West", ->
        #passing in 90 means it should normalize to North
        e = orientationFinder.normalize "android_stock", @event
        assert.equal e.alpha, 0

        #passing in zero means it should normalize to West
        @event.alpha = 0
        e = orientationFinder.normalize "android_stock", @event
        assert.equal e.alpha, 270

    describe "Android Chrome", ->
      it "should stay the same", ->
        e = orientationFinder.normalize "android_chrome", @event
        assert.equal e.alpha, 90

    describe "Opera", ->
      it "should stay the same", ->
        e = orientationFinder.normalize "opera", @event
        assert.equal e.alpha, 90

    describe "IOS", ->
      it "should use the custom property instead of alpha and negate it", ->
        @event.webkitCompassHeading = 180;
        e = orientationFinder.normalize "ios", @event
        assert.equal e.alpha, -180

  describe "startWatch", -> 
    it "should only add the deviceorientation event listener once", ->
      count = 0
      addEvent = window.addEventListener
      window.addEventListener = (name, handler) -> 
        if name is "deviceorientation"
          count++
        addEvent name, handler

      assert.equal count, 0
      orientationFinder.startWatch()
      assert.equal count, 1
      orientationFinder.startWatch()
      assert.equal count, 1

      window.addEventListener = addEvent

  describe "orientationChange (DeviceOrientationEvent handler)", ->
    
    it "should trigger an 'orientationChange' event", (done) ->
      orientationFinder.on 'orientationChange', ->
        assert.isTrue true, "The orientationChange event was triggered"
        orientationFinder.off 'orientationChange'
        done()

      orientationFinder.orientationChange @event

    it "should return the orientation, raw values, and normalized values", (done) ->
      orientationFinder.on 'orientationChange', (values) =>
        assert.property values, "orientation"
        assert.property values, "raw";
        assert.deepEqual values.raw, @event
        assert.isString values.normalizerKey
        console.log values.normalizerKey
        manuallyNormalized = orientationFinder.normalize values.normalizerKey, @event
        assert.deepEqual values.normalized, manuallyNormalized
        orientationFinder.off 'orientationChange'
        done()

      orientationFinder.orientationChange @event, userAgents.chromeDesktop + "test"

  describe "stopWatch", ->
    it "should call window.removeEventListener for the 'deviceorientation' event", ->
      count = 0
      removeEvent = window.removeEventListener
      window.removeEventListener = (name, handler) -> 
        if name is "deviceorientation"
          count++
        removeEvent name, handler

      orientationFinder.stopWatch()
      assert.equal 1, count

    it "should be able to call stopWatch twice without erroring", ->
      orientationFinder.stopWatch()
      orientationFinder.stopWatch()
