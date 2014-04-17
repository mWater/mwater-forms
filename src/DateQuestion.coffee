_ = require 'underscore'
$ = require 'jquery'
Question = require './Question'
require './mobiscroll.custom-2.5.4.min'

# TODO Fix to have editable YYYY-MM-DD with click to popup scroller

module.exports = class DateQuestion extends Question
  events:
    "change input[name='date']": "changed"

  toIso: (formatted) ->
    if not formatted
      return ""

    switch @options.format 
      when "YYYY-MM-DD"
        return formatted
      when "MM/DD/YYYY"
        return formatted.substring(6, 10) + "-" + formatted.substring(0, 2) + "-" + formatted.substring(3, 5)
      else   
        throw new Error("Unknown format " + @options.format)

  fromIso: (iso) ->
    if not iso
      return ""

    switch @options.format 
      when "YYYY-MM-DD"
        return iso
      when "MM/DD/YYYY"
        return iso.substring(5, 7) + "/" + iso.substring(8, 10) + "/" + iso.substring(0, 4)
      else   
        throw new Error("Unknown format " + @options.format)
  
  changed: ->
    @setAnswerValue(@toIso(@$el.find("input[name=\"date\"]").val()))

  updateAnswer: (answerEl) ->
    answerEl.html _.template("<input class=\"needsclick\" name=\"date\" />", this)
    answerEl.find("input").val(@fromIso(@getAnswerValue()))

    switch @options.format
      when "YYYY-MM-DD"
        dateOrder = "yymmD dd"
        dateFormat = "yy-mm-dd"
      when "MM/DD/YYYY"
        dateOrder = "mmD ddyy"
        dateFormat = "mm/dd/yy"

    # Support readonly
    if @options.readonly
      answerEl.find("input").attr('readonly', 'readonly')
    else
      answerEl.find("input").scroller
        preset: "date"
        theme: "ios"
        display: "modal"
        mode: "scroller"
        dateOrder: dateOrder
        dateFormat: dateFormat
