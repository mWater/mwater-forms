formUtils = require './formUtils'
moment = require 'moment'
Backbone = require 'backbone'
_ = require 'lodash'

# Displays a non-editable view of a response
module.exports = class ResponseView extends Backbone.View
  constructor: (options) ->
    super(options)

    @formCtx = options.formCtx
    @form = options.form
    @response = options.response

  render: ->
    data = {
      response: @response
      date: moment(@response.modified.on).format('llll')
      items: []
    }
    
    # Add items
    for item in @form.design.contents
      if item._type == "Section"
        data.items.push { section: true, name: formUtils.localizeString(item.name, "en") }
        for subitem in item.contents
          if formUtils.isQuestion(subitem)
            data.items.push @renderQuestion(subitem)

      if formUtils.isQuestion(item)
        data.items.push @renderQuestion(item)

    html = require('./templates/ResponseView.hbs')(data)
    @$el.html(html)
    this

  # Renders a single question and answer.
  renderQuestion: (q) =>
    d = { question: true, text: formUtils.localizeString(q.text, "en") }

    # Get answer
    answer = @response.data[q._id]

    if not answer
      return d

    if answer.timestamp
      d.timestamp = moment(answer.timestamp).format('llll')
    if answer.location
      d.location = answer.location

    # Add alternates
    if answer.alternate
      switch answer.alternate 
        when "na"
          d.answerHtml = "<em>N/A</em>"
        when "dontknow"
          d.answerHtml = "<em>Don't Know</em>"
      return d

    if not answer.value?
      return d

    switch formUtils.getAnswerType(q)
      when "text", "number"
        d.answerText = answer.value
      when "choice"
        choice = _.findWhere(q.choices, { id: answer.value })
        if choice
          label = formUtils.localizeString(choice.label, 'en')
          if answer.specify?
            specify = answer.specify[answer.value]
          else
            specify = null

          d.answerHtml = _.template "<%-label%><%if (specify) {%>: <em><%=specify%></em><%}%>", { label: label, specify: specify}
        else
          d.answerHtml = '<span class="label label-danger">Invalid Choice</span>'
      when "choices"
        # TODO specify
        choices = _.map answer.value, (v) => 
          choice = _.findWhere(q.choices, { id: v })
          if choice
            return {
              label: formUtils.localizeString(choice.label, 'en')
              specify: if answer.specify? then answer.specify[v]
            }
          else 
            return {
              label: "Invalid Choice"
              specify: null
            }

        d.answerHtml = _.map choices, (choice) =>
          _.template "<%-label%><%if (specify) {%>: <em><%=specify%></em><%}%>", choice
        d.answerHtml = d.answerHtml.join("<br/>")

      when "date"
        # Depends on precision
        if answer.value.length <= 7   # YYYY or YYYY-MM
          d.answerText = answer.value
        else if answer.value.length <= 10 # Date
          d.answerText = moment(answer.value).format("LL")
        else
          d.answerText = moment(answer.value).format("LLL")

      when "units"
        if answer.value and answer.value.quantity? and answer.value.units?
          # Find units
          units = _.findWhere(q.units, { id: answer.value.units })
          params = { 
            value: answer.value.quantity, 
            units: if units then formUtils.localizeString(units.label, 'en') else "(Invalid)"
          }

          if q.unitsPosition == "prefix" 
            d.answerHtml = _.template "<em><%-units%></em> <%-value%>", params
          else 
            d.answerHtml = _.template "<%-value%> <em><%-units%></em>", params

      when "boolean"
        if answer.value
          d.answerText = "True"
        else
          d.answerText = "False"

      when "location"
        d.answerHtml = _.template '''
          <a href="http://maps.google.com/maps?q=<%=pos.latitude%>,<%=pos.longitude%>" target="_blank">
          <%=pos.latitude%>&deg;, <%=pos.longitude%>&deg;</a>
          <%if (pos.accuracy) { %>(+/-)<%=pos.accuracy%> <%}%>''', { pos: answer.value }

      when "image"
        if answer.value
          d.answerHtml = _.template '''
            <img id="<%=answer.value.id%>" class="img-thumbnail image" src="img/image-loading.png" style="max-height: 100px" onError="this.onerror=null;this.src='img/no-image-icon.jpg';" />
            ''', { answer: answer }

      when "images"
        d.answerHtml = _.template '''
          <% for (var i=0;i<answer.value.length;i++) { %>
            <a href="<%=apiUrl%>images/<%=answer.value[i].id%>" target="_blank">
              <img src="<%=apiUrl%>images/<%=answer.value[i].id%>?h=100" class="img-thumbnail">
            </a>
          <% } %>
          ''', { answer: answer, apiUrl: @ctx.apiUrl }
      when "texts"
        d.answerHtml = _.template '''
          <% for (var i=0;i<answer.value.length;i++) { %>
            <div><%- answer.value[i] %></div>
          <% } %>
          ''', { answer: answer }
      when "site"
        code = answer.value
        # TODO Eventually always go to code parameter. Legacy responses used code directly as value.
        if code.code
          code = code.code
        d.answerHtml = _.template '''
          Site: <b><%= code %></b>
          ''', { code: code }
      when "entity"
        # TODO
        d.answerHtml = answer.value

    # Add advanced options
    return d
