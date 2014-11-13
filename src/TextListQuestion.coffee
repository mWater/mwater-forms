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
    # Create base table
    answerEl.html '''
<table style="width:100%">
</table>
    '''

  updateAnswer: (answerEl) ->
    items = @getAnswerValue() or []

    # Check that correct number of rows present (1 extra for prompt)
    while @$("tr").length < items.length + 1
      index = @$("tr").length
      @$("table").append $(_.template('''
  <tr id="row_<%=index%>">
    <td id="position_<%=index%>"></td>
    <td>
      <div class="input-group">
        <input type="text" id="input_<%=index%>" class="form-control box">
        <span class="input-group-btn">
          <button class="btn btn-link remove" id="remove_<%=index%>" data-index="<%=index%>" type="button">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </span>
      </div>
    </td>
  </tr>        
        ''', { index: index }))

    # Remove extra rows
    while @$("tr").length > items.length + 1
      @$("tr:last-child").remove()

    # Set text fields
    for i in [0...items.length]
      @$("#input_" + i).val(items[i])

    # Set position fields
    for i in [0...items.length]
      @$("#position_" + i).html(_.template("<b><%=position%>.&nbsp;</b>", { position: i + 1 }))

    @$("#position_" + items.length).html("")

    # Set remove visibility
    for i in [0...items.length]
      @$("#remove_" + i).css('visibility', 'visible')

    @$("#remove_" + items.length).css('visibility', 'hidden')

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
    items = _.clone(@getAnswerValue())

    # Remove item
    index = parseInt($(ev.currentTarget).data("index"))
    items.splice(index, 1)
    @setAnswerValue(items)

