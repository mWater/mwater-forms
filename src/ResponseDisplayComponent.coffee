_ = require 'lodash'
React = require 'react'
H = React.DOM

moment = require 'moment'
ezlocalize = require 'ez-localize'
ResponseAnswersComponent = require './ResponseAnswersComponent'

# Static view of a response
module.exports = class ResponseDisplayComponent extends React.Component
  @propTypes:
    form: React.PropTypes.object.isRequired
    response: React.PropTypes.object.isRequired
    schema: React.PropTypes.object.isRequired  # Schema including the form
    formCtx: React.PropTypes.object.isRequired
    apiUrl: React.PropTypes.string
    locale: React.PropTypes.string # Defaults to english

  @childContextTypes: _.extend({}, require('./formContextTypes'), {
    T: React.PropTypes.func.isRequired
    locale: React.PropTypes.string          # e.g. "fr"
  })

  constructor: (props) ->
    super(props)

    @state = {
      eventsUsernames: null,
      loadingUsernames: false
      showCompleteHistory: false
      T: @createLocalizer(@props.form.design, @props.formCtx.locale)
    }

  componentWillMount: () ->
    events = @props.response.events or []
    
    if events.length > 0 and @props.apiUrl?
      byArray = _.map(events, (event) -> "\"#{event.by}\"" )
      url = @props.apiUrl + 'users_public_data?filter={"_id":{"$in":[' + byArray.join(',') + ']}}'
      @setState(loadingUsernames: true)
      $.ajax({ dataType: "json", url: url })
      .done (rows) =>
        # eventsUsernames is an object with a key for each _id value
        @setState(loadingUsernames: false, eventsUsernames: _.indexBy(rows, '_id'))
      .fail (xhr) =>
        @setState(loadingUsernames: false, eventsUsernames: null)

  componentWillReceiveProps: (nextProps) ->
    if @props.form.design != nextProps.form.design or @props.locale != nextProps.locale
      @setState(T: @createLocalizer(nextProps.form.design, nextProps.locale))

    events = @props.response.events or []

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

  handleHideHistory: =>
    @setState(showCompleteHistory: false)

  handleShowHistory: =>
    @setState(showCompleteHistory: true)

  renderEvent: (ev) ->
    if not @state.eventsUsernames?
      return null

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
      @state.eventsUsernames[ev.by].username
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
    if @state.loadingUsernames
      return H.div key: "history",
        H.label(null, @props.T("Loading History..."))

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
        @state.T('User'), ": ", H.b(null, @props.response.username)
      H.div key: "code", 
        @state.T('Response Id'), ": ", H.b(null, @props.response.code)
      if @props.response and @props.response.modified
        H.div key: "date", 
          @state.T('Date'), ": ", H.b(null, moment(@props.response.modified.on).format('lll'))
      @renderStatus()
      @renderHistory()

  render: ->
    H.div null,
      @renderHeader()
      React.createElement(ResponseAnswersComponent, {
        formDesign: @props.form.design
        data: @props.response.data
        schema: @props.schema
        locale: @props.locale
        T: @props.T
        formCtx: @props.formCtx
      })
