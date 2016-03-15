_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

QuestionListComponent = require './QuestionListComponent'
formUtils = require './formUtils'

module.exports = class SectionsComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    contents: React.PropTypes.array.isRequired 
    responseData: React.PropTypes.object      # Current data of response. 
    onResponseDataChange: React.PropTypes.func.isRequired
    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

  constructor: ->
    super

    @state = {} # TODO pages

  renderSection: (section) =>
    H.div key: section._id,
      H.h3 null, formUtils.localizeString(section.name, @context.locale)

      R QuestionListComponent, 
        contents: section.contents
        responseData: @props.responseData
        onResponseDataChange: @props.onResponseDataChange

  render: ->
    H.div null,
      _.map(@props.contents, (section) => @renderSection(section))
