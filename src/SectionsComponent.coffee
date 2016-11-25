_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemListComponent = require './ItemListComponent'
formUtils = require './formUtils'
TextExprsComponent = require './TextExprsComponent'

module.exports = class SectionsComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired

    schema: React.PropTypes.object.isRequired  # Schema to use, including form
    responseRow: React.PropTypes.object    # ResponseRow object (for roster entry if in roster)

    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not

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

      # Scroll to top of section
      @refs.sections.scrollIntoView()

    # This should never happen... simply ignore

  handleNextSection: =>
    if @refs.itemListComponent.validate(true)
      return

    # Move to next that is visible
    nextVisibleIndex = @nextVisibleSectionIndex(@state.sectionNum + 1, 1)
    if nextVisibleIndex != -1
      @setState(sectionNum: nextVisibleIndex)

      # Scroll to top of section
      @refs.sections.scrollIntoView()
      
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

    currentSectionName = formUtils.localizeString(@props.contents[@state.sectionNum].name, @context.locale)
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
        responseRow: @props.responseRow
        onNext: @handleItemListNext
        schema: @props.schema

  renderButtons: ->
    H.div className: "form-controls",
      # If can go back
      if @hasPreviousSection()
        [
          H.button key: "back", type: "button", className: "btn btn-default", onClick: @handleBackSection,
            H.span className: "glyphicon glyphicon-backward"
            " " + @context.T("Back")
          "\u00A0"
        ]

      # Can go forward or submit
      if @hasNextSection()
        H.button key: "next", type: "button", ref: 'nextOrSubmit', className: "btn btn-primary", onClick: @handleNextSection,
          @context.T("Next") + " " 
          H.span className: "glyphicon glyphicon-forward"
      else  
        H.button key: "submit", type: "button", ref: 'nextOrSubmit', className: "btn btn-primary", onClick: @handleSubmit,
          @context.T("Submit")

      "\u00A0"

      if @props.onSaveLater
        [
          H.button key: "saveLater", type: "button", className: "btn btn-default", onClick: @props.onSaveLater,
            @context.T("Save for Later")
          "\u00A0"
        ]

      H.button key: "discard", type:"button", className: "btn btn-default", onClick: @props.onDiscard,
        H.span className: "glyphicon glyphicon-trash"
        " " + @context.T("Discard")

  render: ->
    H.div ref: "sections",
      @renderBreadcrumbs()
      H.div className: "sections",
        @renderSection()
      @renderButtons()
