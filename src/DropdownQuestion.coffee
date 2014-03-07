Question = require './Question'
_ = require 'underscore'
$ = require 'jquery'

module.exports = class DropdownQuestion extends Question
  events:
    "change select": "changed"
    "change .specify-input": "specifyChange"

  setOptions: (options) ->
    @options.choices = options
    @render()

  changed: (e) ->
    val = $(e.target).val()
    if not val? or val is ""
      @setAnswerValue null
    else
      index = parseInt(val)
      value = @options.choices[index].id
      @setAnswerValue value

    # Remove other specifies
    specify = _.clone(@getAnswerField('specify') || {})
    specify = _.pick(specify, [value || ""])
    @setAnswerField('specify', specify)

  specifyChange: (e) ->
    specify = _.clone(@getAnswerField('specify') || {})
    specify[$(e.currentTarget).data('id')] = $(e.currentTarget).val()
    @setAnswerField('specify', specify)

  renderAnswer: (answerEl) ->
    html = _.template("<select class=\"form-control\"><%=renderDropdownOptions()%></select>", this)

    # Add specify
    choice = _.findWhere(@options.choices, { id: @getAnswerValue() })
    if choice?
      # Find item number selected
      itemChecked = _.indexOf(@options.choices, choice)

      # Append specify input
      if @options.choices[itemChecked].specify
        html += _.template('''
          <input class="form-control specify-input" data-id="<%=id%>" type="text" id="specify_<%=id%>" value="<%=specifyValue%>">
            ''', { 
            id: @options.choices[itemChecked].id, 
            specifyValue: if @model.get(@id)? and @model.get(@id).specify? then @model.get(@id).specify[@options.choices[itemChecked].id]
            })

    answerEl.html(html)

    # Check if answer present 
    if not _.any(@options.choices, (opt) => opt.id == @getAnswerValue()) and @getAnswerValue()?
      @$("select").attr('disabled', 'disabled')

  renderDropdownOptions: ->
    html = ""
    
    # Add empty option
    html += "<option value=\"\"></option>"
    itemChecked = null
    for i in [0...@options.choices.length]
      checked = @getAnswerValue() is @options.choices[i].id
      data = {
        id: @options.choices[i].id
        position: i
        text: @options.choices[i].label
        checked: checked
        hint: @options.choices[i].hint
      }

      if checked
        itemChecked = i

      html += require("./templates/DropdownQuestionChoice.hbs")(data)

    return html
