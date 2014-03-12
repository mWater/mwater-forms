_ = require 'lodash'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'
sectionedForm = require './sectionedForm'
UIDriver = require './helpers/UIDriver'


describe "Sections", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model, locale: "es")
    @view = @compiler.compileForm(sectionedForm).render()
    @ui = new UIDriver(@view.el)

  it "opens to first section", ->
    assert.equal @view.$(".question:contains('Section1q1')").closest(".section").css('display'), 'block'
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'none'

  it "moves to second section with next click", ->
    @ui.click("Next")
    assert.equal @view.$(".question:contains('Section1q1')").closest(".section").css('display'), 'none'
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'block'

  it "moves to back with back click", ->
    @ui.click("Next")
    @ui.click("Back")
    assert.equal @view.$(".question:contains('Section1q1')").closest(".section").css('display'), 'block'
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'none'

  it "refuses to move forward with invalid question", ->
    form = _.cloneDeep(sectionedForm)
    form.contents[0].contents[0].required = true
    @view = @compiler.compileForm(form).render()

    @ui = new UIDriver(@view.el)
    @ui.click("Next")
    assert.equal @view.$(".question:contains('Section1q1')").closest(".section").css('display'), 'block'
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'none'

  it "triggers 'close' when Save for later clicked", ->
    @view.on 'close', =>
      @done = true

    @ui.click("Save for Later")
    assert @done

  it "triggers 'discard' when Discard clicked", ->
    @view.on 'discard', =>
      @done = true

    @ui.click("Discard")
    assert @done

  it "triggers 'complete' when Finish clicked", ->
    @view.on 'complete', =>
      @done = true

    @ui.click("Next")
    @ui.click("Next")
    @ui.click("Finish")
    assert @done

  it "allows going back with breadcrumbs", ->
    @ui.click("Next")
    @view.$('.section-crumb:contains("Section1")').click()
    assert.equal @view.$(".question:contains('Section1q1')").closest(".section").css('display'), 'block'
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'none'

  it "skips section with false conditions", ->
    form = _.cloneDeep(sectionedForm)
    form.contents[1].conditions = [
      {
        lhs: { question: "0001" }
        op: "present"
      }
    ]
    @view = @compiler.compileForm(form).render()

    @ui = new UIDriver(@view.el)
    @ui.click("Next")
    assert.equal @view.$(".question:contains('Section2q1')").closest(".section").css('display'), 'none'
    assert.equal @view.$(".question:contains('Section3q1')").closest(".section").css('display'), 'block'
    

