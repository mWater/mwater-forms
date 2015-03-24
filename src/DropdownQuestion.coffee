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

  updateAnswer: (answerEl) ->
    html = _.template("<select class=\"form-control\" style=\"width: auto;\"><%=renderDropdownOptions()%></select>")(this)

    # Add specify
    choice = _.findWhere(@options.choices, { id: @getAnswerValue() })
    if choice?
      # Find item number selected
      itemSelected = _.indexOf(@options.choices, choice)

      # Append specify input
      if @options.choices[itemSelected].specify
        html += _.template('''
          <input class="form-control specify-input" data-id="<%=id%>" type="text" id="specify_<%=id%>" value="<%=specifyValue%>">
            ''')({ 
            id: @options.choices[itemSelected].id, 
            specifyValue: if @model.get(@id)? and @model.get(@id).specify? then @model.get(@id).specify[@options.choices[itemSelected].id]
            })

    answerEl.html(html)

    # Check if answer present 
    if not _.any(@options.choices, (opt) => opt.id == @getAnswerValue()) and @getAnswerValue()?
      answerEl.find("select").attr('disabled', 'disabled')

  renderDropdownOptions: ->
    html = ""
    
    # Add empty option
    html += "<option value=\"\"></option>"
    for i in [0...@options.choices.length]
      selected = @getAnswerValue() is @options.choices[i].id
      data = {
        id: @options.choices[i].id
        position: i
        text: @options.choices[i].label
        selected: selected
        hint: @options.choices[i].hint
      }

      html += require("./templates/DropdownQuestionChoice.hbs")(data, helpers: { T: @T })

    return html
