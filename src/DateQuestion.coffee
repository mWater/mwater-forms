_ = require 'underscore'
$ = require 'jquery'
Question = require './Question'

moment = require 'moment'
require('bootstrap-datetimepicker')


# Date question. Options include:
# format: Any moment.js format
module.exports = class DateQuestion extends Question
  initialize: (options = {}) ->
    _.defaults(options, {
      format: "YYYY-MM-DD"
    })

    # Determine detail level: 0 = year, 1 = year+month, 2=year+month+day, 3=date+hours, 4=date+hours+minutes, 5=date+hours+min+sec
    if options.format.match /ss|LLL|lll/
      @detailLevel = 5
    else if options.format.match /m/
      @detailLevel = 4
    else if options.format.match /h|H/
      @detailLevel = 3
    else if options.format.match /D|l|L/
      @detailLevel = 2
      @isoFormat = "YYYY-MM-DD"
    else if options.format.match /M/
      @detailLevel = 1
      @isoFormat = "YYYY-MM"
    else if options.format.match /Y/
      @detailLevel = 0
      @isoFormat = "YYYY"
    else 
      throw new Error("Invalid format: " + options.format)

    # Set placeholder if not set
    if not options.placeholder
      # Can't set for full dates
      if not options.format.match /l|L/
        options.placeholder = options.format

    super(options)

  events:
    "dp.change #datetimepicker": -> 
      # No error if changed
      @$(".form-group").removeClass("has-error")
      @save()

    "dp.error #datetimepicker": -> 
      # Error if not blank
      if @$("#date_input").val()
        @$(".form-group").addClass("has-error")

  save: ->
    # Get date
    date = @$('#datetimepicker').data("DateTimePicker").getDate()
    if not date
      @setAnswerValue(null)
      return

    # Get iso format (if date, use format to avoid timezone wrapping)
    if @isoFormat
      date = date.format(@isoFormat)
    else
      date = date.toISOString()

    # Trim to detail level
    switch @detailLevel
      when 0 then date = date.substring(0,4)
      when 1 then date = date.substring(0,7)
      when 2 then date = date.substring(0,10)
      when 3 then date = date.substring(0,13) + "Z"
      when 4 then date = date.substring(0,16) + "Z"
      when 5 then date = date.substring(0,19) + "Z"
      else 
        throw new Error("Invalid detail level")

    @setAnswerValue(date)

  renderAnswer: (answerEl) ->
    answerEl.html require('./templates/DateQuestion.hbs')(placeholder: @options.placeholder)

    if @options.readonly
      answerEl.find("input").attr('readonly', 'readonly')
    else

      pickerOptions = {
        pickTime: @detailLevel > 2
        format: @options.format
        useMinutes: @detailLevel > 3
        useSeconds: @detailLevel > 4
        useCurrent: false
      }

      if @detailLevel == 0
        pickerOptions.minViewMode = 2
      else if @detailLevel == 1
        pickerOptions.minViewMode = 1

      @$('#datetimepicker').datetimepicker(pickerOptions)

  updateAnswer: (answerEl) ->
    # Parse using isoFormat to avoid timezone wrapping
    value = @getAnswerValue()

    if @isoFormat
      value = moment(value, @isoFormat)
    else
      value = moment(value, moment.ISO_8601)

    # Handle readonly case
    if @options.readonly
      if value
        @$("#date_input").val(value.format(@options.format))
      else
        @$("#date_input").val("")
    else
      @$('#datetimepicker').data("DateTimePicker").setDate(value)

  validateInternal: ->
    return @$(".form-group").hasClass("has-error")