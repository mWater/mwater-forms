$ = require 'jquery'
_ = require 'lodash'

exports.AdminRegionAnswerComponent = require './answers/AdminRegionAnswerComponent'
exports.ImageEditorComponent = require './ImageEditorComponent'
exports.ImagelistEditorComponent = require './ImagelistEditorComponent'
exports.ResponseAnswersComponent = require './ResponseAnswersComponent'
exports.LocationView = require './legacy/LocationView'

exports.formUtils = require './formUtils'
exports.formRenderUtils = require './formRenderUtils'
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
exports.formContextTypes = require './formContextTypes'
exports.FormSchemaBuilder = require './FormSchemaBuilder'

exports.ResponseDataUpdater = require './ResponseDataUpdater'

exports.schemaVersion = 13 # Version of the schema that this package supports (cannot compile if higher)
exports.minSchemaVersion = 1 # Minimum version of forms schema that can be compiled

# JSON schema of form
exports.schema = require('./schema')

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

