React = require 'react'
_ = require 'lodash'
FormCompiler = require './FormCompiler'

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @propTypes:
    ctx: React.PropTypes.object.isRequired  # Form context. See docs/Forms Context.md
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
    locale: React.PropTypes.string            # Locale. Defaults to English (en)
    
    responses: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    # Note: Responses are held as local state for now, so updating responses is not required but suggested for future compatibility on changes
    onResponsesChanged: React.PropTypes.func.isRequired # Called when response data changes

    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired     # Called when discard is pressed

    formEntity: React.PropTypes.object            # Form-level entity to load
    formEntityType: React.PropTypes.string        # Type of form-level entity to load

  componentDidMount: ->
    # Load response data to model
    @model = new Backbone.Model()
    @model.set(_.cloneDeep(@props.responses))

    # Create compiler
    compiler = new FormCompiler(model: @model, locale: @props.locale, ctx: @props.ctx)
    @formView = compiler.compileForm(@props.design).render()

    # Set entity if present
    if @props.entityType and @props.entity
      @formView.setEntity(@props.entityType, @props.entity)
    
    # Listen to events
    @formView.on 'change', @handleChange
    @formView.on 'complete', @props.onSubmit
    if @props.onSaveLater
      @formView.on 'close', @props.onSaveLater
    @listenTo @formView, 'discard', @props.onDiscard

    $(React.findDOMNode(@refs.form)).append(@formView.el)

  componentWillReceiveProps: (nextProps) ->
    # Check if different from existing response
    if not _.isEqual(nextProps.responses, @model.toJSON())
      @model.set(nextProps)

  componentWillUnmount: ->
    @formView.remove()

  handleChange: =>
    @props.onResponsesChanged(@modal.toJSON())

  render: ->
    return H.div ref: "form"
