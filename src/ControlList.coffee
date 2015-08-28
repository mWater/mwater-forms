module.exports = class ControlList
  constructor: (contents, view) ->
    @contents = contents
    @view = view

    for content in @contents
      @view.listenTo content, 'nextQuestion', @focusNextQuestion.bind(this, content)

  focusNextQuestion: (content) ->
    # Look for the next Question
    index = @contents.indexOf(content)
    index++
    while index < @contents.length
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
