React = require 'react'
H = React.DOM
_ = require 'lodash'
FormCompiler = require './FormCompiler'

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @propTypes:
    formCtx: React.PropTypes.object.isRequired  # Form context. See docs/Forms Context.md
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
    locale: React.PropTypes.string            # Locale. Defaults to English (en)

    data: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    # Note: Data is held as local state for now, so updating responses is not required but suggested for future compatibility on changes
    onDataChange: React.PropTypes.func.isRequired # Called when response data changes

    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

    submitLabel: React.PropTypes.string           # Label for submit button

    entity: React.PropTypes.object            # Form-level entity to load
    entityType: React.PropTypes.string        # Type of form-level entity to load

  componentDidMount: ->
    @reload(@props)

  componentWillReceiveProps: (nextProps) ->
    # Can't change design
    if nextProps.design != @props.design
      throw new Error("Can't change design after mounted")

    # Can't change entity
    if nextProps.entity != @props.entity
      throw new Error("Can't change entity after mounted")

    # Check if different from existing response
    if not _.isEqual(nextProps.data, @model.toJSON())
      @model.set(nextProps)

    # Allow changes to locale
    if @props.locale != nextProps.locale
      @reload(nextProps)

  reload: (props) ->
    if @formView
      @formView.remove()
      @formView = null

    # Load response data to model
    @model = new Backbone.Model()
    @model.set(_.cloneDeep(props.data))

    # Create compiler
    compiler = new FormCompiler(model: @model, locale: props.locale, ctx: props.formCtx)
    @formView = compiler.compileForm(props.design, { 
      entityType: props.entityType
      entity: props.entity
      allowSaveForLater: props.onSaveLater?
      submitLabel: props.submitLabel
      })

    @formView.render()

    # Listen to events
    @formView.on 'change', @handleChange
    @formView.on 'complete', props.onSubmit
    if props.onSaveLater
      @formView.on 'close', props.onSaveLater
    @formView.on 'discard', props.onDiscard

    $(@refs.form).append(@formView.el)

  componentWillUnmount: ->
    @formView.remove()

  handleChange: =>
    @props.onDataChange(@model.toJSON())

  render: ->
    return H.div ref: "form"
