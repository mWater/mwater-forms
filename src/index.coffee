$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'lodash'

exports.formUtils = require './formUtils'
exports.conditionUtils = require './conditionUtils'
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
exports.BarcodeQuestion = require './BarcodeQuestion'
exports.ImageQuestion = require './ImageQuestion'
exports.ImagesQuestion = require './ImagesQuestion'
exports.EntityQuestion = require './EntityQuestion'
exports.AdminRegionQuestion = require './AdminRegionQuestion'
exports.Instructions = require './Instructions'
exports.ECPlates = require './ECPlates'
exports.TextListQuestion = require './TextListQuestion'
exports.UnitsQuestion = require './UnitsQuestion'
exports.FormCompiler = require './FormCompiler'
exports.LocationView = require './LocationView'
exports.utils = require './utils'
exports.LocationFinder = require './LocationFinder'
exports.LocationEditorComponent = require './LocationEditorComponent'
exports.ImageEditorComponent = require './ImageEditorComponent'
exports.ImagelistEditorComponent = require './ImagelistEditorComponent'

exports.AdminRegionDataSource = require './AdminRegionDataSource'
exports.AdminRegionSelectComponent = require './AdminRegionSelectComponent'

exports.DateTimePickerComponent = require './DateTimePickerComponent'
exports.FormModel = require './FormModel'
exports.ResponseModel = require './ResponseModel'
exports.ResponseDisplayComponent = require './ResponseDisplayComponent'
exports.FormComponent = require './FormComponent'

exports.schemaVersion = 12 # Version of the schema that this package supports (cannot compile if higher)
exports.minSchemaVersion = 1 # Minimum version of forms schema that can be compiled

# # JSON schema of form design # Explicitly import for now
# exports.designSchema = require('./schema').design

# This only works in browser. Load datetime picker
if process.browser
  require('eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js')


# Simple form that displays a template based on loaded data
exports.templateView = (template) -> 
  return {
    el: $('<div></div>')
    load: (data) ->
      $(@el).html template(data)
  }

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
