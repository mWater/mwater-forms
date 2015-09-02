# ControlList is used by FormControls and Section to manage their questions
# It takes care of the validation and handling the nextQuestion event that any Question can trigger

module.exports = class ControlList
  constructor: (contents, view) ->
    @contents = contents
    @view = view

    for content in @contents
      @view.listenTo content, 'nextQuestion', @focusNextQuestion.bind(this, content)

  focusNextQuestion: (content) ->
    # Look for the current Question
    index = @contents.indexOf(content)

    # Find the next content that is not invisible (could be a Question, but could also be an Instruction)
    index++
    while index < @contents.length
      # Take the next content
      content = @contents[index]
      # Skip any invisible content
      if content.visible
        content.setFocus(@view.$el[0].offsetTop)
        return true
      index++

    return false

  validate: () ->
    # Get all visible items
    items = _.filter @contents, (c) ->
      c.visible and c.validate

    # Get validation results
    results = _.map items, (item) ->
      item.validate()

    # Scroll item into view
    for i in [0...items.length]
      if results[i]
        items[i].$el.scrollintoview()

    return not _.any(results)
