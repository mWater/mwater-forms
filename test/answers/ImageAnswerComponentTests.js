# TODO: SurveyorPro: Make a component version of these tests
###
assert = require("chai").assert
forms = require '../src'
UIDriver = require './helpers/UIDriver'
Backbone = require 'backbone'
_ = require 'underscore'
sinon = require 'sinon'
FormCompiler = require '../src/FormCompiler'
commonQuestionTestList = require './commonQuestionTestList'

class MockImageManager 
  getImageThumbnailUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

  getImageUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

class MockImageAcquirer
  acquire: (success, error) ->
    success("1234")

describe 'ImageQuestion', ->
  beforeEach ->
    # Create model
    @model = new Backbone.Model 

  context 'With a no image acquirer', ->
    beforeEach ->
      # Create context
      @ctx = {
        imageManager: new MockImageManager()
      }

      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
      @q = {
        _id: "q1234"
        _type: "ImageQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q).render()

    # Run common tests
    commonQuestionTestList.call(this)

    it 'displays no image', ->
      assert.isTrue true

    it 'displays one image', ->
      @model.set(q1234: { value: {id: "1234"} })
      assert.equal @qview.$("img.img-thumbnail").attr("src"), "images/1234.jpg"

    it 'opens page', ->
      @model.set(q1234: { value: {id: "1234"} })
      spy = sinon.spy()
      @ctx.displayImage = spy 
      @qview.$("img.img-thumbnail").click()

      assert.isTrue spy.calledOnce
      assert.equal spy.args[0][0].id, "1234"

    it 'allows removing image', ->
      @model.set(q1234: { value: {id: "1234"} })
      @ctx.displayImage = (options) ->
        options.remove()

      @qview.$("img.img-thumbnail").click()
      assert.equal @model.get("q1234").value, null

    it 'displays no add', ->
      assert.equal @qview.$("img#add").length, 0

  context 'With an image acquirer', ->
    beforeEach ->
      # Create context
      @ctx = {
        imageManager: new MockImageManager()
        imageAcquirer: new MockImageAcquirer()
      }

      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
      @q = {
        _id: "q1234"
        _type: "ImageQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q).render()

    it 'gets an image', ->
      @qview.$("img#add").click()
      assert.isTrue _.isEqual(@model.get("q1234"), { value: {id: "1234"} })

    it 'no longer has add after taking photo', ->
      @qview.$("img#add").click()
      assert.equal @qview.$("img#add").length, 0

    it "gets consent before photo taken", ->
      @q.consentPrompt = { _base: "en", en: "Do you consent?" }
      @qview = @compiler.compileQuestion(@q).render()

      confirmed = false

      _oldConfirm = window.confirm
      window.confirm = (msg) =>
        confirmed = true
        assert.equal msg, @q.consentPrompt.en
        return false

      @qview.$("img#add").click()
      assert.isTrue confirmed, "Not confirmed"
      assert.isUndefined @model.get("q1234"), JSON.stringify(@model.get("q1234"))

      window.confirm = (msg) =>
        confirmed = true
        assert.equal msg, @q.consentPrompt.en
        return true

      confirmed = false
      @qview.$("img#add").click()
      assert.isTrue confirmed, "Not confirmed"
      assert.isTrue _.isEqual(@model.get("q1234"), { value: {id: "1234"} })

      window.confirm = _oldConfirm

###
    