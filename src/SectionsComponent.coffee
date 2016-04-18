_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemListComponent = require './ItemListComponent'
formUtils = require './formUtils'

module.exports = class SectionsComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired

    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

  constructor: ->
    super

    @state = {
      sectionNum: 0
    }

  handleSubmit: =>
    if not @refs.itemListComponent.validate(true)
      @props.onSubmit()

  hasPreviousSection: ->
    # Returns true if a visible index exist with a higher value
    return @nextVisibleSectionIndex(@state.sectionNum - 1, -1) != -1

  hasNextSection: ->
    # Returns true if a visible index exist with a higher value
    return @nextVisibleSectionIndex(@state.sectionNum + 1, 1) != -1

  nextVisibleSectionIndex: (index, increment) ->
    if index < 0
      return -1
    if index >= @props.contents.length
      return -1
    section = @props.contents[index]
    isVisible = @props.isVisible(section._id)
    if isVisible
      return index
    else
      return @nextVisibleSectionIndex(index + increment, increment)

  handleBackSection: =>
    # Move to previous that is visible
    previousVisibleIndex = @nextVisibleSectionIndex(@state.sectionNum - 1, -1)
    if previousVisibleIndex != -1
      @setState(sectionNum: previousVisibleIndex)
    # This should never happen... simply ignore

  handleNextSection: =>
    # Move to next that is visible
    nextVisibleIndex = @nextVisibleSectionIndex(@state.sectionNum + 1, 1)
    if nextVisibleIndex != -1
      @setState(sectionNum: nextVisibleIndex)
    # This should never happen... simply ignore

  handleBreadcrumbClick: (index) =>
    @setState(sectionNum: index)

  handleItemListNext: () =>
    @refs.nextOrSubmit.focus()

  renderBreadcrumbs: ->
    breadcrumbs = []
    index = 0
    while index < @state.sectionNum
      section = @props.contents[index]
      visible = @props.isVisible(section._id)
      breadcrumbs.push H.li {key: index},
        H.b null,
          if visible
            H.a {className: "section-crumb", disabled: not visible, onClick: @handleBreadcrumbClick.bind(this, index)},
              "#{index + 1}."
          else
            "#{index + 1}."
      index++

    currentSectionName = @props.contents[@state.sectionNum].name
    currentSectionName = currentSectionName[currentSectionName._base]
    breadcrumbs.push H.li {key: @state.sectionNum},
      H.b null,
        "#{@state.sectionNum + 1}. #{currentSectionName}"

    return H.ul className: "breadcrumb",
      breadcrumbs

  renderSection: ->
    section = @props.contents[@state.sectionNum]

    H.div key: section._id,
      H.h3 null, formUtils.localizeString(section.name, @context.locale)

      R ItemListComponent, 
        ref: 'itemListComponent'
        contents: section.contents
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
        onNext: @handleItemListNext

  renderButtons: ->
    H.div className: "form-controls",
      # If can go back
      if @hasPreviousSection()
        [
          H.button key: "back", type: "button", className: "btn btn-default", onClick: @handleBackSection,
            H.span className: "glyphicon glyphicon-backward"
            " " + T("Back")
          "\u00A0"
        ]

      # Can go forward or submit
      if @hasNextSection()
        H.button key: "next", type: "button", ref: 'nextOrSubmit', className: "btn btn-primary", onClick: @handleNextSection,
          T("Next") + " " 
          H.span className: "glyphicon glyphicon-forward"
      else  
        H.button key: "submit", type: "button", ref: 'nextOrSubmit', className: "btn btn-primary", onClick: @handleSubmit,
          T("Submit")

      "\u00A0"

      if @props.onSaveLater
        [
          H.button key: "saveLater", type: "button", className: "btn btn-default", onClick: @props.onSaveLater,
            T("Save for Later")
          "\u00A0"
        ]

      H.button key: "discard", type:"button", className: "btn btn-default", onClick: @props.onDiscard,
        H.span className: "glyphicon glyphicon-trash"
        " " + T("Discard")

  render: ->
    H.div null,
      @renderBreadcrumbs()
      H.div className: "sections",
        @renderSection()
      @renderButtons()
