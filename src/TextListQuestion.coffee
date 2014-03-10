Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

# Question that has a variable number of textboxes that the user
# can add more as needed

module.exports = class TextListQuestion extends Question
  events:
    "input .box" : "record"
    "click .remove" : "removeItem"

  renderAnswer: (answerEl) ->
    @answerEl = answerEl
    @update()

  record: ->
    # Save to data
    items = []
    for box in @$(".box")
      box = $(box)
      items.push box.val()

    # Last item can't be blank
    if _.last(items) == ""
      items = items[0...-1]

    @setAnswerValue(items)

  removeItem: (ev) ->
    items = @getAnswerValue()

    # Remove item
    index = parseInt($(ev.currentTarget).data("index"))
    items.splice(index, 1)
    @setAnswerValue(items)

  update: ->
    items = @getAnswerValue() or []

    # Perform a render
    boxes = []
    for i in [0...items.length]
      boxes.push { index: i, position: i+1, text: items[i] } 

    @preserveInputs require('./templates/TextListQuestion.hbs')({
      boxes: boxes, length: boxes.length}), @answerEl

  # Apply a template of newHtml to an oldElem, preserving inputs focus 
  preserveInputs: (newHtml, oldElem) ->
    # Create div with contents
    div = $("<div></div>")
    div.html(newHtml)

    # Focus must be done when visible again
    toFocus = []

    # Find inputs in new html
    for input in div.find("input")
      # Only those with id can be preserved
      if input.id
        # Find matching input in old element
        oldInput = $("input#" + input.id)

        # If found
        if oldInput.length > 0
          # Get new attributes
          attrs = input.attributes

          # Replace old attributes with new (except value, which must be done manually)
          for attr in attrs
            if attr.name isnt "value"
              $(oldInput).attr(attr.name, attr.value)

          # Copy value across
          $(oldInput).val($(input).val())

          # Save information on whether focused
          wasFocused = $(oldInput).is(":focus")
          if wasFocused
            toFocus.push(oldInput)

            # Temporarily turn off transition effects to avoid flicker
            $(oldInput).css("transition", "none")
            $(oldInput).css("-webkit-transition", "none")

          # Replace new control with old
          inp = $(oldInput).detach()
          $(input).replaceWith(oldInput)

    # Add new element to old, clearing old html
    $(oldElem).empty()
    $(oldElem).append($(div).children())

    # Set focus
    for input in toFocus
      $(input).focus()
      # Restore transition effects to avoid flicker
      $(input).css("transition", "")
      $(input).css("-webkit-transition", "")
