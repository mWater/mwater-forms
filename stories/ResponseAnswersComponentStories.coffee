storiesOf = require('@storybook/react').storiesOf
{action} = require('@storybook/addon-actions')
{withKnobs, text, boolean, number} = require '@storybook/addon-knobs'

_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ResponseAnswersComponent = require "../src/ResponseAnswersComponent"
simpleForm = require './formDesign'
sampleForm2 = require '../src/sampleForm2'
answers = require './formAnswer'
prevAnswers = require './previousAnswers'

T = (str) ->
  if arguments.length > 1
    for subValue, index in Array.from(arguments).slice(1)
      tag = "{#{index}}"
      str = str.replace(tag, subValue)
  return str

formCtx = {
  locale: "en" 
  getAdminRegionPath: (id, callback) ->
    if id == 'manitoba'
      callback(null, [canada, manitoba])
    else if id == 'ontario'
      callback(null, [canada, ontario])
    else if id == "canada"
      callback(null, [canada])
    else
      callback(null, [])

  getSubAdminRegions: (id, level, callback) ->
    if not id?
      callback(null, [canada])
    else if id == "canada"
      callback(null, [manitoba, ontario])
    else
      callback(null, [])

  renderEntitySummaryView: (entityType, entity) ->
    JSON.stringify(entity)

  renderEntityListItemView: (entityType, entity) ->
    JSON.stringify(entity)

  findAdminRegionByLatLng: (lat, lng, callback) -> callback("Not implemented")

  imageManager: {
    getImageUrl: (id, success, error) -> error("Not implemented")
    getImageThumbnailUrl: (id, success, error) -> error("Not implemented")
  }

  stickyStorage: {
    get: (questionId) ->
      return testStickyStorage[questionId]
    set: (questionId, value) ->
      return testStickyStorage[questionId] = value
  }

  selectEntity: (options) =>
    options.callback("1234")

  getEntityById: (entityType, entityId, callback) =>
    if entityId == "1234"
      callback({ _id: "1234", code: "10007", name: "Test" })
    else
      callback(null)

  getEntityByCode: (entityType, entityCode, callback) =>
    if entityCode == "10007"
      callback({ _id: "1234", code: "10007", name: "Test" })
    else
      callback(null)
}

stories = storiesOf('ResponseAnswersComponent', module);
stories.addDecorator(withKnobs);

stories
  .add 'With Previous Data', =>
    R ResponseAnswersComponent,
      formDesign: simpleForm
      data: answers
      schema: {}
      formCtx: formCtx
      T: T
      prevData: prevAnswers
      showPrevAnswers: boolean('Show previous answers', false)
      highlightChanges: boolean('Highlight changes', false)
      hideUnchangedAnswers: boolean('Hide unchanged answers', false)
      showChangedLink: boolean('Show changed link', false)
      onChangedLinkClick: () => action('changeLinkClicked')()