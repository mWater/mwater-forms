_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

FormCompiler = require './FormCompiler'
SectionsComponent = require './SectionsComponent'
ItemListComponent = require './ItemListComponent'

# Displays a form that can be filled out
# TODO default answers based on sticky values
# TODO remove answers for invisible questions
# TODO use context instead of explicit formCtx property?
module.exports = class FormComponent extends React.Component
  @propTypes:
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
  
    data: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    onDataChange: React.PropTypes.func.isRequired # Called when response data changes

    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

    entity: React.PropTypes.object            # Form-level entity to load TODO
    entityType: React.PropTypes.string        # Type of form-level entity to load TODO

   render: ->
    if @props.design.contents[0] and @props.design.contents[0]._type == "Section"
      R SectionsComponent,
        contents: @props.design.contents
        data: @props.data
        onDataChange: @props.onDataChange
        onSubmit: @props.onSubmit
        onSaveLater: @props.onSaveLater
        onDiscard: @props.onDiscard
    else
      R ItemListComponent,
        contents: @props.design.contents
        data: @props.data
        onDataChange: @props.onDataChange

      # TODO submit, etc. for non-sectioned
