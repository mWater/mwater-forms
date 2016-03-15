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

    @state = {
      sectionNum: 0
    } 

  handleSubmit: =>
    # TODO validate
    @props.onSubmit()

  handleBack: =>
    # TODO validate?
    @setState(sectionNum: @state.sectionNum - 1)

  handleNext: =>
    # TODO validate
    @setState(sectionNum: @state.sectionNum + 1)

  renderBreadcrumbs: ->
    # TODO breadcrumbs
    return null
    # H.ul className: "breadcrumb" # TODO
    # Setup breadcrumbs
    # visibleSections = _.filter(_.take(@sections, index + 1), (s) ->
    #   s.shouldBeVisible()
    # )
    # index = 1
    # sectionsIndex = _.map _.initial(visibleSections), (s) -> {label: "#{index++}."}
    # data = {
    #   lastSectionLabel: "#{index}. #{_.last(visibleSections).name} "
    #   sectionsIndex: sectionsIndex
    # }
    # @$(".breadcrumb").html require('./templates/Sections_breadcrumbs.hbs')(data, helpers: { T: @T })
    # @renderNextPrev()
    #       {{#each sectionsIndex}}
    # <li><b><a class="section-crumb" data-value="{{@index}}">{{label}}</a></b></li>
    # {{/each}}
    # <li><b>{{lastSectionLabel}}</b></li>

  renderSection: ->
    section = @props.contents[@state.sectionNum]

    H.div key: section._id,
      H.h3 null, formUtils.localizeString(section.name, @context.locale)

      R QuestionListComponent, 
        contents: section.contents
        responseData: @props.responseData
        onResponseDataChange: @props.onResponseDataChange

  renderButtons: ->
    H.div className: "form-controls",
      # If can go back
      if @state.sectionNum > 0
        [
          H.button type: "button", className: "btn btn-default", onClick: @handleBack,
            H.span className: "glyphicon glyphicon-backward"
            " " + T("Back")
          "\u00A0"
        ]

      # Can go forward or submit
      if @state.sectionNum < @props.contents.length - 1  
        H.button type: "button", className: "btn btn-primary", onClick: @handleNext,
          T("Next") + " " 
          H.span className: "glyphicon glyphicon-forward"
      else  
        H.button type: "button", className: "btn btn-primary", onClick: @handleSubmit,
          T("Submit")

      "\u00A0"

      if @props.onSaveLater
        [
          H.button type: "button", className: "btn btn-default", onClick: @props.onSaveLater,
            T("Save for Later")
          "\u00A0"
        ]

      H.button type:"button", className: "btn btn-default", onClick: @props.onDiscard,
        H.span className: "glyphicon glyphicon-trash"
        " " + T("Discard")

  render: ->
    H.div null,
      @renderBreadcrumbs()
      H.div className: "sections",
        @renderSection()
      @renderButtons()
