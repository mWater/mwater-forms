_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

QuestionComponent = require './QuestionComponent'
formUtils = require './formUtils'

module.exports = class QuestionListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    responseData: React.PropTypes.object      # Current data of response. 
    onResponseDataChange: React.PropTypes.func.isRequired

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onResponseDataChange(_.extend({}, @props.responseData, change))

  renderItem: (item) =>
    if formUtils.isQuestion(item)
      return R QuestionComponent, 
        key: item._id
        question: item
        answer: @props.responseData[item._id]
        onAnswerChange: @handleAnswerChange.bind(null, item._id)

  render: ->
    H.div null,
      _.map(@props.contents, (item) => @renderItem(item))

