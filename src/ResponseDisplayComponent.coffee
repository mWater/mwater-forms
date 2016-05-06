React = require 'react'
H = React.DOM
#Backbone = require 'backbone'
formUtils = require './formUtils'
ImageDisplayComponent = require './ImageDisplayComponent'
EntityDisplayComponent = require './EntityDisplayComponent'
AdminRegionDisplayComponent = require './AdminRegionDisplayComponent'
moment = require 'moment'
ezlocalize = require 'ez-localize'

VisibilityCalculator = require './VisibilityCalculator'

# Static view of a response
module.exports = class ResponseDisplayComponent extends React.Component
  @propTypes:
    form: React.PropTypes.object.isRequired
    response: React.PropTypes.object.isRequired
    formCtx: React.PropTypes.object.isRequired
    locale: React.PropTypes.string # Defaults to english

  @childContextTypes: _.extend({}, require('./formContextTypes'), {
    T: React.PropTypes.func.isRequired
    locale: React.PropTypes.string          # e.g. "fr"
  })

  constructor: (props) ->
    super(props)

    @state = {
      showCompleteHistory: false
      T: @createLocalizer(@props.form.design, @props.formCtx.locale)
    }

  componentWillReceiveProps: (nextProps) ->
    if @props.design != nextProps.design
      @setState(formExprEvaluator: new FormExprEvaluator(nextProps.design))

    if @props.design != nextProps.design or @props.locale != nextProps.locale
      @setState(T: @createLocalizer(nextProps.design, nextProps.locale))

  getChildContext: -> 
    _.extend({}, @props.formCtx, {
      T: @state.T
      locale: @props.locale
    })

  # Creates a localizer for the form design
  createLocalizer: (design, locale) ->
    # Create localizer
    localizedStrings = design.localizedStrings or []
    localizerData = {
      locales: design.locales
      strings: localizedStrings
    }
    T = new ezlocalize.Localizer(localizerData, locale).T
    return T

  handleLocationClick: (location) ->
    if @props.formCtx.displayMap
      @props.formCtx.displayMap(location)

  handleHideHistory: =>
    @setState(showCompleteHistory: false)

  handleShowHistory: =>
    @setState(showCompleteHistory: true)

  renderEvent: (ev) ->
    eventType = switch ev.type
      when "draft"
        @state.T("Drafted")
      when "submit"
        @state.T("Submitted")
      when "approve"
        @state.T("Approved")
      when "reject"
        @state.T("Rejected")
      when "edit"
        @state.T("Edited")

    return H.div null, 
      eventType
      " "
      @state.T("by")
      " "
      ev.by
      " "
      @state.T("on")
      " "
      moment(ev.on).format('lll')
      if ev.message
        [": ", H.i(null, ev.message)]
      if ev.override
        H.span(className: "label label-warning", @state.T("Admin Override"))

  # History of events
  renderHistory: ->
    contents = []

    events = @props.response.events or []

    if @state.showCompleteHistory
      for ev in _.initial(events)
        contents.push(@renderEvent(ev))

    lastEvent = _.last(events)
    if lastEvent
      contents.push(@renderEvent(lastEvent))

    if events.length > 1
      if @state.showCompleteHistory
        contents.push(H.a(style: { cursor: "pointer" }, onClick: @handleHideHistory, @state.T("Hide History")))
      else
        contents.push(H.a(style: { cursor: "pointer" }, onClick: @handleShowHistory, @state.T("Show History")))

    return H.div key: "history", contents

  renderStatus: ->
    status = switch @props.response.status
      when "draft"
        @state.T("Draft")
      when "rejected"
        @state.T("Rejected")
      when "pending"
        @state.T("Pending")
      when "final"
        @state.T("Final")

    H.div key: "status", 
      @state.T('Status'), ": ", H.b(null, status)

  # Header which includes basics
  renderHeader: ->
    H.div style: { paddingBottom: 10 },
      H.div key: "user", 
        @state.T('User'), ": ", H.b(null, @props.response.user)
      H.div key: "code", 
        @state.T('Response Id'), ": ", H.b(null, @props.response.code)
      if @props.response and @props.response.modified
        H.div key: "date", 
          @state.T('Date'), ": ", H.b(null, moment(@props.response.modified.on).format('lll'))
      @renderStatus()
      @renderHistory()

  renderLocation: (location) ->
    if location
      return H.div null, 
        H.a onClick: @handleLocationClick.bind(this, location), style: { cursor: "pointer" },
          "#{location.latitude}\u00B0 #{location.longitude}\u00B0"
          if location.accuracy then "(+/-) #{location.accuracy} m"

  renderAnswer: (q, answer) ->
    if not answer
      return null

    # Handle alternates
    if answer.alternate
      switch answer.alternate 
        when "na"
          return H.em null, @state.T("Not Applicable")
        when "dontknow"
          return H.em null, @state.T("Don't Know")

    if not answer.value?
      return null

    switch formUtils.getAnswerType(q)
      when "text", "number"
        return "" + answer.value
      when "choice"
        choice = _.findWhere(q.choices, { id: answer.value })
        if choice
          label = formUtils.localizeString(choice.label, 'en')
          if answer.specify?
            specify = answer.specify[answer.value]
          else
            specify = null

          return H.div null,
            label
            if specify 
              ": "  
              H.em null, specify
        else
          return H.span className: "label label-danger", "Invalid Choice"
      when "choices"
        return _.map answer.value, (v) => 
          choice = _.findWhere(q.choices, { id: v })
          if choice
            return H.div null, 
              formUtils.localizeString(choice.label, 'en')
              if answer.specify? and answer.specify[v]
                ": "
                H.em null, answer.specify[v]
          else 
            return H.div className: "label label-danger", "Invalid Choice"
  
      when "date"
        # Depends on precision
        if answer.value.length <= 7   # YYYY or YYYY-MM
          return H.div null, answer.value
        else if answer.value.length <= 10 # Date
          return H.div null, moment(answer.value).format("LL")
        else
          return H.div null, moment(answer.value).format("LLL")

      when "units"
        if answer.value and answer.value.quantity? and answer.value.units?
          # Find units
          units = _.findWhere(q.units, { id: answer.value.units })

          valueStr = "" + answer.value.quantity
          unitsStr = if units then formUtils.localizeString(units.label, 'en') else "(Invalid)"

          if q.unitsPosition == "prefix" 
            return H.div null,
              H.em null, unitsStr
              " "
              valueStr
          else 
            return H.div null,
              valueStr
              " "
              H.em null, unitsStr

      when "boolean"
        return if answer.value then @state.T("True") else @state.T("False")

      when "location"
        return @renderLocation(answer.value)

      when "image"
        if answer.value
          return React.createElement(ImageDisplayComponent, formCtx: @props.formCtx, id: answer.value.id)

      when "images"
        return _.map answer.value, (img) =>
          React.createElement(ImageDisplayComponent, formCtx: @props.formCtx, id: img.id)

      when "texts"
        return _.map answer.value, (txt) =>
          H.div null, txt

      when "site"
        code = answer.value
        # TODO Eventually always go to code parameter. Legacy responses used code directly as value.
        if _.isObject(code)
          code = code.code

        # Convert to new entity type
        siteType = (if q.siteTypes then q.siteTypes[0]) or "Water point" 
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")

        return React.createElement(EntityDisplayComponent, {
          formCtx: @props.formCtx
          entityCode: code
          entityType: entityType
        })

      when "entity"
        return React.createElement(EntityDisplayComponent, {
          formCtx: @props.formCtx
          entityId: answer.value
          entityType: q.entityType
        })

      when "admin_region"
        return React.createElement(AdminRegionDisplayComponent, {
          getAdminRegionPath: @props.formCtx.getAdminRegionPath
          value: answer.value
        })

  renderQuestion: (q, dataId) ->
    # Get answer
    dataIds = dataId.split('.')
    if dataIds.length == 1
      answer = @props.response.data[dataId]
    else
      rosterData = @props.response.data[dataIds[0]]
      answer = rosterData[dataIds[1]].data[dataIds[2]]

    H.tr key: dataId,
      H.td key: "name", style: { width: "50%" },
        formUtils.localizeString(q.text, @props.locale)
      H.td key: "value",
        @renderAnswer(q, answer)
        if answer and answer.timestamp
          H.div null,
            @state.T('Answered')
            ": "
            moment(answer.timestamp).format('llll')
        if answer and answer.location
          @renderLocation(answer.location)

  # Add all the items with the proper rosterId to items array
  # Looks inside groups and sections
  collectItemsReferencingRoster: (items, contents, rosterId) ->
    # Get the contents of all the other question that are referencing this roster
    for otherItem in contents
      if otherItem._type == 'Group' or otherItem._type == 'Section'
        @collectItemsReferencingRoster(items, otherItem.contents, rosterId)
      if otherItem.rosterId == rosterId
        items.push.apply(items, otherItem.contents);

  # dataId is the key used for looking up the data + testing visibility
  # dataId is simply item._id except for rosters children
  renderItem: (item, visibilityStructure, dataId) ->
    if not visibilityStructure[dataId]
      return

    # Sections and Groups behave the same
    if item._type == "Section" or item._type == "Group"
      return [
        H.tr key: item._id,
          H.td colSpan: 2, style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)
        _.map item.contents, (item) =>
          @renderItem(item, visibilityStructure, item._id)
      ]

    # RosterMatrices and RosterGroups behave the same
    # Only the one storing the data will display it
    # The rosters referencing another one will display a simple text to say so
    if item._type == "RosterMatrix" or item._type == "RosterGroup"
      items = []
      # If storing data
      if not item.rosterId?
        items = _.clone item.contents
        # Get the questions of the other rosters referencing this one
        @collectItemsReferencingRoster(items, @props.form.design.contents, item._id)

      return [
        H.tr key: item._id,
          H.td colSpan: 2, style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)
        # Simply display a text referencing the other roster
        if item.rosterId?
          referencedRoster = formUtils.findItem(@props.form.design, item.rosterId)
          H.tr null,
            H.td colSpan: 2,
              H.span style: {fontStyle: 'italic'},
                @state.T("Data is stored in {0}", referencedRoster.name[@props.formCtx.locale])
        else
          # Get the data for that roster
          data = @props.response.data[item._id]
          if data?
            # For each entry in data
            for enty, index in data
              [
                # Display the index of the answer
                H.tr null,
                  H.td colSpan: 2, style: { fontWeight: "bold" },
                    "#{index+1}."
                # And the answer for each question
                _.map items, (childItem) =>
                  dataId = "#{item._id}.#{index}.#{childItem._id}"
                  @renderItem(childItem, visibilityStructure, dataId)
              ]
      ]

    if formUtils.isQuestion(item)
      return @renderQuestion(item, dataId)

  renderContent: (visibilityStructure) ->
    H.table className: "table table-bordered",
      H.tbody null, 
        _.map @props.form.design.contents, (item) =>
          @renderItem(item, visibilityStructure, item._id)

  render: ->
    visibilityStructure = new VisibilityCalculator(@props.form.design).createVisibilityStructure(@props.response.data)

    H.div null,
      @renderHeader()
      @renderContent(visibilityStructure)
