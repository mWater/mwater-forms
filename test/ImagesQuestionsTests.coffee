_ = require 'underscore'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require("chai").assert
forms = require '../src'
UIDriver = require './helpers/UIDriver'
sinon = require 'sinon'
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

class MockImageManager 
  getImageThumbnailUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

  getImageUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

class MockImageAcquirer
  acquire: (success, error) ->
    success("1234")

describe 'ImagesQuestion', ->
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
      @compiler = new FormCompiler(model: @model, locale: "es")
      @q = {
        _id: "q1234"
        _type: "ImagesQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q, @ctx).render()

    # Run common tests
    commonQuestionTests.call(this)

    it 'displays no image', ->
      @model.set(q1234: { value: [] })
      assert.isTrue true

    it 'displays one image', ->
      @model.set(q1234: { value: [{id: "1234"}]})
      assert.equal @qview.$("img.img-thumbnail").attr("src"), "images/1234.jpg"

    it 'opens page', ->
      @model.set(q1234: {value:[{id: "1234"}]})
      spy = sinon.spy()
      @ctx.displayImage = spy 
      @qview.$("img.img-thumbnail").click()

      assert.isTrue spy.calledOnce
      assert.equal spy.args[0][0].id, "1234"

    it 'allows removing image', ->
      @model.set(q1234: {value: [{id: "1234"}]})
      @ctx.displayImage = (options) ->
        options.remove()

      @qview.$("img.img-thumbnail").click()
      assert.equal @qview.$("img#add").length, 0

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
      @compiler = new FormCompiler(model: @model, locale: "es")
      @q = {
        _id: "q1234"
        _type: "ImagesQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q, @ctx).render()

    it 'gets an image', ->
      @qview.$("img#add").click()
      assert.isTrue _.isEqual(@model.get("q1234"), {value: [{id:"1234"}]}), @model.get("q1234")

    