$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'underscore'

exports.Sections = require './Sections'
exports.Section = require './Section'
exports.Question = require './Question'
exports.RadioQuestion = require './RadioQuestion'
exports.CheckQuestion = require './CheckQuestion'
exports.TextQuestion = require './TextQuestion'
exports.CompositeQuestion = require './CompositeQuestion'
exports.GPSQuestion = require './GPSQuestion'
exports.DateQuestion = require './DateQuestion'
exports.DropdownQuestion = require './DropdownQuestion'
exports.NumberQuestion = require './NumberQuestion'
exports.QuestionGroup = require './QuestionGroup'
exports.MulticheckQuestion = require './MulticheckQuestion'
exports.SaveCancelForm = require './SaveCancelForm'
exports.SourceQuestion = require './SourceQuestion'
exports.ImageQuestion = require './ImageQuestion'
exports.ImagesQuestion = require './ImagesQuestion'
exports.Instructions = require './Instructions'
exports.ECPlates = require './ECPlates'
exports.VariableTextsQuestion = require './VariableTextsQuestion'
exports.UnitQuestion = require './UnitQuestion'

# Setup controls
$ ->
  # Make checkboxes clickable
  $("body").on "click", ".touch-checkbox", ->
    $(this).toggleClass "checked"
    $(this).trigger "checked"

  # Make radio buttons clickable if not readonly (to make readonly, add to class readonly to radiogroup)
  $("body").on "click", ".touch-radio", ->
    if not $(this).parents(".touch-radio-group").hasClass("readonly")
      # Find parent radiogroup
      $(this).parents(".touch-radio-group").find(".touch-radio").removeClass "checked"
      $(this).addClass "checked"
      $(this).trigger "checked"

# Must be created with model (backbone model) and contents (array of views)
exports.FormView = class FormView extends Backbone.View
  initialize: (options) ->
    # Save options
    @options = options || {}

    @contents = options.contents
    
    # Add contents and listen to events
    for content in options.contents
      @$el.append(content.el);
      @listenTo content, 'close', => @trigger('close')
      @listenTo content, 'complete', => @trigger('complete')
      @listenTo content, 'discard', => @trigger('discard')

    # Add listener to model
    @listenTo @model, 'change', => @trigger('change')

    # Override save if passed as option
    if options.save
      @save = options.save

  # Remove the form view, which in turn removes all contents
  remove: ->
    for content in @contents
      content.remove()
      
    # Call built-in remove 
    super()

  load: (data) ->
    @model.clear()  #TODO clear or not clear? clearing removes defaults, but allows true reuse.

    # Apply defaults 
    @model.set(_.defaults(_.cloneDeep(data || {}), @options.defaults || {}))

  save: ->
    return @model.toJSON()


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


exports.SurveyView = class SurveyView extends FormView

exports.WaterTestEditView = class WaterTestEditView extends FormView
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

# TODO figure out how to allow two surveys for differing client versions? Or just use minVersion?

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
