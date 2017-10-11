PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

moment = require 'moment'
ezlocalize = require 'ez-localize'
ResponseAnswersComponent = require './ResponseAnswersComponent'
ResponseArchivesComponent = require './ResponseArchivesComponent'
ModalPopupComponent = require('react-library/lib/ModalPopupComponent')

# Static view of a response
module.exports = class ResponseDisplayComponent extends React.Component
  @propTypes:
    form: PropTypes.object.isRequired
    response: PropTypes.object.isRequired
    schema: PropTypes.object.isRequired  # Schema including the form
    formCtx: PropTypes.object.isRequired
    apiUrl: PropTypes.string
    locale: PropTypes.string # Defaults to english
    login: PropTypes.object  # Current login (contains user, username, groups)

  @childContextTypes: _.extend({}, require('./formContextTypes'), {
    T: PropTypes.func.isRequired
    locale: PropTypes.string          # e.g. "fr"
  })

  constructor: (props) ->
    super(props)

    @state = {
      eventsUsernames: null
      loadingUsernames: false
      showCompleteHistory: false
      T: @createLocalizer(@props.form.design, @props.formCtx.locale)
      history: null
      loadingHistory: false
      showArchive: false
      showPrevAnswers: false
    }

  componentWillMount: ->
    @loadEventUsernames(@props.response.events)
    
  componentDidMount: ->
    @loadHistory(@props)

  loadHistory: (props) ->
    url = props.apiUrl + 'archives/responses/' + props.response._id + '?client=' + (props.login?.client or "")
    @setState(loadingHistory: true)
    $.ajax({ dataType: "json", url: url })
      .done (history) =>
        # Get only ones since first submission
        index = _.findIndex(history, (rev) -> rev.status in ['pending', 'final'])
        history = history.slice(0, index + 1)

        # Remove history where there was no change to data
        compactHistory = []
        for entry, i in history
          prevEntry = if i == 0 then @props.response else history[i - 1]
          if not _.isEqual(entry.data, prevEntry.data)
            compactHistory.push(entry)

        @setState(loadingHistory: false, history: compactHistory)
      .fail (xhr) =>
        @setState(loadingHistory: false, history: null)

  # Load user names related to events
  loadEventUsernames: (events) ->
    events = @props.response.events or []
    
    byArray = _.compact(_.pluck(events, "by"))
    if byArray.length > 0 and @props.apiUrl?
      filter = { _id: { $in: byArray } }
      url = @props.apiUrl + 'users_public_data?filter=' + JSON.stringify(filter)
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

    if not _.isEqual(@props.response.response, nextProps.response.response)
      @loadHistory(nextProps)

    if not _.isEqual(@props.response.events, nextProps.response.events)
      @loadEventUsernames(nextProps.response.events)

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
      if ev.by then @state.eventsUsernames[ev.by]?.username else "Anonymous"
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
        contents.push(H.div(null, H.a(style: { cursor: "pointer" }, onClick: @handleHideHistory, @state.T("Hide History"))))
        contents.push(H.div(null, H.a(style: { cursor: "pointer" }, onClick: (=> @setState(showArchive: true)), @state.T("Show Complete History of Changes"))))
      else
        contents.push(H.div(null, H.a(style: { cursor: "pointer" }, onClick: @handleShowHistory, @state.T("Show History"))))

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

  renderArchives: ->
    if not @state.history or not @state.showArchive
      return null
    
    R ModalPopupComponent,
      header: "Change history"
      size: "large"
      showCloseX: true
      onClose: (() => @setState(showArchive: false)),
        R ResponseArchivesComponent,
          formDesign: @props.form.design
          response: @props.response
          schema: @props.schema
          locale: @props.locale
          T: @props.T
          formCtx: @props.formCtx
          history: @state.history
          eventsUsernames: @state.eventsUsernames

  # Header which includes basics
  renderHeader: ->
    H.div style: { paddingBottom: 10 },
      H.div key: "user", 
        @state.T('User'), ": ", H.b(null, @props.response.username or "Anonymous")
      H.div key: "code", 
        @state.T('Response Id'), ": ", H.b(null, @props.response.code)
      if @props.response and @props.response.modified
        H.div key: "date", 
          @state.T('Date'), ": ", H.b(null, moment(@props.response.modified.on).format('lll'))
      if @props.response.ipAddress
        H.div key: "ipAddress", 
          @state.T('IP Address'), ": ", H.b(null, @props.response.ipAddress)
      @renderStatus()
      @renderHistory()
      @renderArchives()
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
        prevData: if @state.history then _.last(@state.history) else null
        showPrevAnswers: @state.history? and @state.showPrevAnswers
        highlightChanges: @state.showPrevAnswers
        showChangedLink: @state.history?
        onChangedLinkClick: => 
          @setState(showPrevAnswers: not @state.showPrevAnswers)
        onCompleteHistoryLinkClick: =>
          @setState(showArchive: true)
      })
