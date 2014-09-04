$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'underscore'

exports.formUtils = require './formUtils'
exports.Sections = require './Sections'
exports.Section = require './Section'
exports.Question = require './Question'
exports.RadioQuestion = require './RadioQuestion'
exports.CheckQuestion = require './CheckQuestion'
exports.TextQuestion = require './TextQuestion'
# Deprecated exports.CompositeQuestion = require './CompositeQuestion'
exports.LocationQuestion = require './LocationQuestion'
exports.DateQuestion = require './DateQuestion'
exports.DropdownQuestion = require './DropdownQuestion'
exports.NumberQuestion = require './NumberQuestion'
exports.QuestionGroup = require './QuestionGroup'
exports.MulticheckQuestion = require './MulticheckQuestion'
exports.SaveCancelForm = require './SaveCancelForm'
exports.SiteQuestion = require './SiteQuestion'
exports.ImageQuestion = require './ImageQuestion'
exports.ImagesQuestion = require './ImagesQuestion'
exports.Instructions = require './Instructions'
exports.ECPlates = require './ECPlates'
exports.TextListQuestion = require './TextListQuestion'
exports.UnitsQuestion = require './UnitsQuestion'
exports.FormCompiler = require './FormCompiler'
exports.LocationView = require './LocationView'
exports.FormView = require './FormView'
exports.utils = require './utils'
exports.LocationFinder = require './LocationFinder'

exports.schemaVersion = 2 # Version of the schema that this package supports (cannot compile if higher)
exports.minSchemaVersion = 1 # Minimum version of forms schema that can be compiled

# # JSON schema of form design # Explicitly import for now
# exports.designSchema = require('./schema').design

# Simple form that displays a template based on loaded data
exports.templateView = (template) -> 
  return {
    el: $('<div></div>')
    load: (data) ->
      $(@el).html template(data)
  }

  # class TemplateView extends Backbone.View
  # constructor: (template) ->
  #   @template = template

  # load: (data) ->
  #   @$el.html @template(data)


exports.SurveyView = class SurveyView extends exports.FormView

# TODO localize and perhaps remove
exports.WaterTestEditView = class WaterTestEditView extends exports.FormView
  initialize: (options) ->
    super(options)

    # Add buttons at bottom
    # TODO move to template and sep file
    @$el.append $('''
      <div>
          <button id="discard_button" type="button" class="btn btn-default"><span class="glyphicon glyphicon-trash"></span> Discard</button>
          &nbsp;
          <button id="close_button" type="button" class="btn btn-default margined">Save for Later</button>
          &nbsp;
          <button id="complete_button" type="button" class="btn btn-primary margined"><span class="glyphicon glyphicon-ok"></span> Complete</button>
      </div>
    ''')

  events: 
    "click #discard_button" : "discard"
    "click #close_button" : "close"
    "click #complete_button" : "complete"

  # TODO refactor with SaveCancelForm
  # Returns true if validates ok
  validate: ->
    # Get all visible items
    items = _.filter(@contents, (c) ->
      c.visible and c.validate
    )
    return not _.any(_.map(items, (item) ->
      item.validate()
    ))

  close: ->
    @trigger 'close'

  discard: ->
    @trigger 'discard'

  complete: ->
    if @validate()
      @trigger 'complete'
      
# Creates a form view from a string
exports.instantiateView = (viewStr, options) =>
  viewFunc = new Function("options", viewStr)
  viewFunc(options)

# Create a base32 time code to write on forms
exports.createBase32TimeCode = (date) ->
  # Characters to use (skip 1, I, 0, O)
  chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ"

  # Subtract date from July 1, 2013
  base = new Date(2013, 6, 1, 0, 0, 0, 0)

  # Get seconds since
  diff = Math.floor((date.getTime() - base.getTime()) / 1000)

  # Convert to array of base 32 characters
  code = ""

  while diff >= 1
    num = diff % 32
    diff = Math.floor(diff / 32)
    code = chars[num] + code

  return code
