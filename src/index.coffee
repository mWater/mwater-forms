$ = require 'jquery'
Backbone = require 'backbone'
_ = require 'lodash'

# Deprecated exports.CompositeQuestion = require './CompositeQuestion'

# Legacy
#exports.RadioQuestion = require './RadioQuestion'
#exports.CheckQuestion = require './CheckQuestion'
#exports.TextQuestion = require './TextQuestion'
#exports.LocationQuestion = require './LocationQuestion'
#exports.DateQuestion = require './DateQuestion'
#exports.DropdownQuestion = require './DropdownQuestion'
#exports.NumberQuestion = require './NumberQuestion'
#exports.MulticheckQuestion = require './MulticheckQuestion'
#exports.SiteQuestion = require './SiteQuestion'
#exports.BarcodeQuestion = require './BarcodeQuestion'
#exports.ImageQuestion = require './ImageQuestion'
#exports.ImagesQuestion = require './ImagesQuestion'
#exports.EntityQuestion = require './EntityQuestion'
#exports.TextListQuestion = require './TextListQuestion'
#exports.UnitsQuestion = require './UnitsQuestion'
#exports.AdminRegionQuestion = require './AdminRegionQuestion'
#exports.Question = require './Question'

exports.AdminRegionAnswerComponent = require './answers/AdminRegionAnswerComponent'
exports.ImageAnswerComponent = require './answers/ImageAnswerComponent'
exports.ImagesAnswerComponent = require './answers/ImagesAnswerComponent'

#exports.LocationView = require './LocationView'

exports.formUtils = require './formUtils'
exports.Sections = require './Sections'
exports.Section = require './Section'
exports.QuestionGroup = require './QuestionGroup'
exports.SaveCancelForm = require './SaveCancelForm'
exports.Instructions = require './Instructions'
exports.ECPlates = require './ECPlates'
exports.utils = require './utils'
exports.LocationFinder = require './LocationFinder'
exports.LocationEditorComponent = require './LocationEditorComponent'

exports.AdminRegionDataSource = require './AdminRegionDataSource'
exports.AdminRegionSelectComponent = require './AdminRegionSelectComponent'
exports.AdminRegionDisplayComponent = require './AdminRegionDisplayComponent'

exports.DateTimePickerComponent = require './DateTimePickerComponent'
exports.FormModel = require './FormModel'
exports.ResponseModel = require './ResponseModel'
exports.ResponseDisplayComponent = require './ResponseDisplayComponent'
exports.FormComponent = require './FormComponent'
exports.ItemComponent = require './ItemComponent'
exports.formContextTypes = require './formContextTypes'

exports.schemaVersion = 13 # Version of the schema that this package supports (cannot compile if higher)
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

