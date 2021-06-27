PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

ItemListComponent = require './ItemListComponent'
formUtils = require './formUtils'
TextExprsComponent = require './TextExprsComponent'

module.exports = class SectionsComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    contents: PropTypes.array.isRequired 
    data: PropTypes.object      # Current data of response. 
    onDataChange: PropTypes.func.isRequired

    schema: PropTypes.object.isRequired  # Schema to use, including form
    responseRow: PropTypes.object.isRequired    # ResponseRow object (for roster entry if in roster)

    isVisible: PropTypes.func.isRequired # (id) tells if an item is visible or not

    onSubmit: PropTypes.func                # Called when submit is pressed
    onSaveLater: PropTypes.func             # Optional save for later
    onDiscard: PropTypes.func               # Called when discard is pressed

  constructor: (props) ->
    super(props)

    @state = {
      sectionNum: 0
    }

  handleSubmit: =>
    result = await @itemListComponent.validate(true)
    if not result
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

      # Scroll to top of section
      @sections.scrollIntoView()

    # This should never happen... simply ignore

  handleNextSection: =>
    result = await @itemListComponent.validate(true)
    if result
      return

    # Move to next that is visible
    nextVisibleIndex = @nextVisibleSectionIndex(@state.sectionNum + 1, 1)
    if nextVisibleIndex != -1
      @setState(sectionNum: nextVisibleIndex)

      # Scroll to top of section
      @sections.scrollIntoView()
      
    # This should never happen... simply ignore

  handleBreadcrumbClick: (index) =>
    @setState(sectionNum: index)

  handleItemListNext: () =>
    @nextOrSubmit.focus()

  renderBreadcrumbs: ->
    breadcrumbs = []
    index = 0
    while index < @state.sectionNum
      section = @props.contents[index]
      visible = @props.isVisible(section._id)
      breadcrumbs.push R 'li', {key: index},
        R 'b', null,
          if visible
            R 'a', {className: "section-crumb", disabled: not visible, onClick: @handleBreadcrumbClick.bind(this, index)},
              "#{index + 1}."
          else
            "#{index + 1}."
      index++

    currentSectionName = formUtils.localizeString(@props.contents[@state.sectionNum].name, @context.locale)
    breadcrumbs.push R 'li', {key: @state.sectionNum},
      R 'b', null,
        "#{@state.sectionNum + 1}. #{currentSectionName}"

    return R 'ul', className: "breadcrumb",
      breadcrumbs

  renderSection: ->
    section = @props.contents[@state.sectionNum]

    R 'div', key: section._id,
      R 'h3', null, formUtils.localizeString(section.name, @context.locale)

      R ItemListComponent, 
        ref: ((c) => @itemListComponent = c)
        contents: section.contents
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        responseRow: @props.responseRow
        onNext: @handleItemListNext
        schema: @props.schema

  renderButtons: ->
    R 'div', className: "form-controls",
      # If can go back
      if @hasPreviousSection()
        [
          R 'button', key: "back", type: "button", className: "btn btn-default", onClick: @handleBackSection,
            R 'span', className: "glyphicon glyphicon-backward"
            " " + @context.T("Back")
          "\u00A0"
        ]

      # Can go forward or submit
      if @hasNextSection()
        R 'button', key: "next", type: "button", ref: ((c) => @nextOrSubmit = c), className: "btn btn-primary", onClick: @handleNextSection,
          @context.T("Next") + " " 
          R 'span', className: "glyphicon glyphicon-forward"
      else if @props.onSubmit
        R 'button', key: "submit", type: "button", ref: ((c) => @nextOrSubmit = c), className: "btn btn-primary", onClick: @handleSubmit,
          @context.T("Submit")

      "\u00A0"

      if @props.onSaveLater
        [
          R 'button', key: "saveLater", type: "button", className: "btn btn-default", onClick: @props.onSaveLater,
            @context.T("Save for Later")
          "\u00A0"
        ]

      if @props.onDiscard
        R 'button', key: "discard", type:"button", className: "btn btn-default", onClick: @props.onDiscard,
          R 'span', className: "glyphicon glyphicon-trash"
          " " + @context.T("Discard")

  render: ->
    R 'div', ref: ((c) => @sections = c),
      @renderBreadcrumbs()
      R 'div', className: "sections",
        @renderSection()
      @renderButtons()
