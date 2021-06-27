PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement
ResponseAnswersComponent = require './ResponseAnswersComponent'
moment = require 'moment'

# Show complete change history of response
module.exports = class ResponseArchivesComponent extends React.Component
  @propTypes:
    formDesign: PropTypes.object.isRequired
    response: PropTypes.object.isRequired
    schema: PropTypes.object.isRequired  # Schema of the 
    locale: PropTypes.string # Defaults to english
    T: PropTypes.func.isRequired  # Localizer to use
    formCtx: PropTypes.object.isRequired    # Form context to use

    history: PropTypes.array.isRequired # The archives
    eventsUsernames: PropTypes.object.isRequired # The usernames

  renderRecord: (record, previousRecord) =>
    R 'div', key: record._rev , style: {marginTop: 10},
      R 'p', key: 'summary',
        "Changes made by "
        R 'b', null, if record.modified.by then @props.eventsUsernames[record.modified.by]?.username else "Anonymous"
        " on "
        moment(record.modified.on).format('lll')

      R 'div', key: 'detail',
        R ResponseAnswersComponent,
          formDesign: @props.formDesign
          data: record.data
          schema: @props.schema
          locale: @props.locale
          T: @props.T
          formCtx: @props.formCtx
          prevData: previousRecord
          showPrevAnswers: true
          showChangedLink: false
          highlightChanges: true
          hideUnchangedAnswers: true
          deployment: record.deployment


  render: ->
    if @props.history.length == 0
      return R 'div', null, 
        R 'i', null, "No changes made since submission"
    R 'div', null,
      _.map(@props.history, (record, index) => 
        if index == 0
          @renderRecord(@props.response, record)
        else
          @renderRecord(@props.history[index - 1], record)
      )