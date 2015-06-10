React = require 'react'
H = React.DOM

# Loads an entity, displaying "Loading..." until complete. Then injects entity into child props
# If entityId is null, will pass null entity to children
# If not found error, will pass notFound: true to children
module.exports = class EntityLoadingComponent extends React.Component
  @propTypes:
    entityId: React.PropTypes.string
    entityType: React.PropTypes.string.isRequired
    formCtx: React.PropTypes.object.isRequired
    T: React.PropTypes.func # Localizer

  constructor: ->
    super
    @state = { loading: true, entity: null }

  loadEntity: (props) ->
    if not props.entityId
      @setState(loading: false, entity: null, notFound: false)
    else
      # Get entity
      @setState(loading: true)
      props.formCtx.getEntity props.entityType, props.entityId, (entity) =>
        if entity
          @setState(loading: false, entity: entity, notFound: false)
        else
          @setState(loading: false, entity: null, notFound: true)

  componentDidMount: ->
    @loadEntity(@props)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.entityId != @props.entityId or nextProps.entityType != @props.entityType
      @loadEntity(nextProps)

  render: ->
    if @loading
      return H.div null, H.em(null, @props.T("Loading..."))

    child = React.Children.only(@props.children)
    return React.cloneElement(child, entity: @state.entity, notFound: @state.notFound)
