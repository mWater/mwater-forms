_ = require 'lodash'
siteCodes = require '../siteCodes'
PromiseExprEvaluator = require('mwater-expressions').PromiseExprEvaluator
ValidationCompiler = require './ValidationCompiler'
formUtils = require '../formUtils'

# AnswerValidator gets called when a form is submitted (or on next)
# Only the validate method is not internal
module.exports = class AnswerValidator
  constructor: (schema, responseRow, locale) ->
    @schema = schema
    @responseRow = responseRow
    @locale = locale

  # It returns null if everything is fine
  # It makes sure required questions are properly answered
  # It checks answer type specific validations
  # It checks custom validations
  validate: (question, answer) ->
    # If it has an alternate value, it cannot be invalid
    if answer.alternate
      return null

    if question.disabled
      return null

    # Check required and answered
    if question.required
      if not answer.value? or answer.value == ''
        return true

      # Handle specify
      if question.choices
        # MulticheckQuestion
        if _.isArray answer.value
          specifyChoices = question.choices.filter((c) -> c.specify).map((c) -> c.id)
          selectedSpecifyChoicecs = _.intersection(specifyChoices, answer.value)

          if selectedSpecifyChoicecs.length > 0
            for selectedChoice in selectedSpecifyChoicecs
              if not answer.specify?[selectedChoice]
                return true
        else
          # RadioQuestion
          choiceOption = _.find(question.choices, {specify: true})
          if choiceOption and (answer.value == choiceOption.id) and not answer.specify
            return true

      # Handling empty string for Units values
      if answer.value? and answer.value.quantity? and answer.value.quantity == ''
        return true
      # A required LikertQuestion needs an answer for all items
      if question._type == 'LikertQuestion'
        for item in question.items
          if not answer.value[item.id]?
            return true
      if question._type == 'AquagenxCBTQuestion'
        if not answer.value.cbt?
          return true

    # Check internal validation
    specificValidation = @validateSpecificAnswerType(question, answer)
    if specificValidation?
      return specificValidation

    # Skip validation if value is not set
    if not answer.value? or answer.value == ''
      return null

    # Check custom validation
    if question.validations?
      result = new ValidationCompiler(@locale).compileValidations(question.validations)(answer)
      if result
        return result

    if question.advancedValidations? and @responseRow
      for { expr, message } in question.advancedValidations
        if expr
          # Evaluate expression
          exprEvaluator = new PromiseExprEvaluator({ schema: @schema })
          value = await exprEvaluator.evaluate(expr, { row: @responseRow })
          if value != true
            return formUtils.localizeString(message, @locale) or true

    return null

  validateSpecificAnswerType: (question, answer) ->
    switch question._type
      when "TextQuestion"
        return @validateTextQuestion(question, answer)
      when "UnitsQuestion"
        return @validateUnitsQuestion(question, answer)
      when "NumbersQuestion"
        return @validateNumberQuestion(question, answer)
      when "SiteQuestion"
        return @validateSiteQuestion(question, answer)
      when "LikertQuestion"
        return @validateLikertQuestion(question, answer)
      when "MatrixQuestion"
        return @validateMatrixQuestion(question, answer)
      else
        return null

  # Valid if null or empty
  # Valid if code is valid (checksum)
  validateSiteQuestion: (question, answer) ->
    if not answer.value
      return null

    if not answer.value?.code
      return true

    if siteCodes.isValid(answer.value.code)
      return null
    else
      return "Invalid code"

  # Valid if null or empty
  # Valid if not email or url format
  # Else a match is performed on the anser value
  validateTextQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    if question.format == "email"
      if answer.value.match /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return null
      else
        return "Invalid format"
    else if question.format == "url"
      if answer.value.match /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        return null
      else
        return "Invalid format"

    return null

  # Valid if null or empty
  # Valid if quantity is not set
  # Invalid if quantity is set but not units
  validateUnitsQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    if answer.value.quantity? and answer.value.quantity != ''
      if not answer.value.units? or answer.value.units == ''
        return 'units field is required when a quantity is set'

    return null

  # Valid if null or empty
  # Valid if quantity is not set
  # Invalid if quantity is set but not units
  validateLikertQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    for item, choiceId of answer.value
      if not _.findWhere(question.choices, {id: choiceId})?
        return 'Invalid choice'

    return null

  # Valid if null or empty
  validateNumberQuestion: (question, answer) ->
    if not answer.value? or answer.value == ''
      return null

    return null

  validateMatrixQuestion: (question, answer) ->
    validationErrors = {}

    # For each entry
    for item, rowIndex in question.items
      # For each column
      for column, columnIndex in question.columns
        key = "#{item.id}_#{column._id}"

        data = answer.value?[item.id]?[column._id]

        if column.required and (not data?.value? or data?.value == '')
          return true

        if column.validations and column.validations.length > 0
          validationError = new ValidationCompiler(@locale).compileValidations(column.validations)(data)
          if validationError
            return validationError

    return null
