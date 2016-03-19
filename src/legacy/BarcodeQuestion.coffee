Question = require './Question'
_ = require 'lodash'

# Allows user to scan a barcode
# Context should have scanBarcode({ success: callback })
module.exports = class BarcodeQuestion extends Question
  updateAnswer: (answerEl) ->
    val = @getAnswerValue()
    html = require("./templates/BarcodeQuestion.hbs")({ supported: @ctx.scanBarcode?, value: val }, helpers: { T: @T })
    answerEl.html(html)

  events:
    'click #scan' : "scan"
    'click #clear': "clear"

  scan: ->
    @ctx.scanBarcode({ success: (text) =>
      @setAnswerValue(text)
    })

  clear: ->
    @setAnswerValue(null)
