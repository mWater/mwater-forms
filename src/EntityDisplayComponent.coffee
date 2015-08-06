React = require 'react'
H = React.DOM
ImageDisplayComponent = require './ImageDisplayComponent'

# Displays an entity with certain display fields
module.exports = class EntityDisplayComponent extends React.Component
  @propTypes:
    entity: React.PropTypes.object # Can be null for no entity
    notFound: React.PropTypes.bool # True to display not found message instead
    formCtx: React.PropTypes.object.isRequired
    propertyIds: React.PropTypes.array.isRequired # Array of property _ids
    locale: React.PropTypes.string # Default to "en"
    T: React.PropTypes.func

  # Format entity properties for display. Return array of name, value
  formatEntityProperties: (entity) ->
    # Localize to locale, or English as fallback
    localize = (str) =>
      return str[@props.locale] or str.en

    # Get properties and format    
    properties = []
    for propId in @props.propertyIds
      # TODO REMOVE THIS JULY 2015
      # Handle old style embedded properties
      if _.isObject(propId)
        propId = propId._id
      if not propId
        continue
      # END REMOVE

      # Get property
      prop = @props.formCtx.getProperty(propId)

      # If property not found, just ignore
      if not prop
        continue

      name = localize(prop.name)
      value = entity[prop.code]
      if not value?
        properties.push({ name: name, value: H.span(className: "text-muted", "-") })
      else
        switch prop.type
          when "text", "integer", "decimal", "date", "entity"
            properties.push({ name: name, value: value })
          when "enum"
            propValue = _.findWhere(prop.values, { code: value })
            if propValue
              properties.push({ name: name, value: localize(propValue.name)})
            else
              properties.push({ name: name, value: "???"})  
          when "boolean"
            properties.push({ name: name, value: if value then "true" else "false" })
          when "geometry"
            if value.type == "Point"
              properties.push({ name: name, value: value.coordinates[1] + ", " + value.coordinates[0] })
          when "measurement"
            propUnit = @props.formCtx.getUnit(value.unit)
            if propUnit
              properties.push({ name: name, value: value.magnitude + " " + propUnit.symbol})
            else
              properties.push({ name: name, value: value.magnitude + " " + "???"})  
          when "image"
            properties.push(name: name, value: React.createElement(ImageDisplayComponent, formCtx: @props.formCtx, id: value.id))
          when "imagelist"
            properties.push(name: name, value: _.map(value, (img) => React.createElement(ImageDisplayComponent, formCtx: @props.formCtx, id: img.id)))
          else
            properties.push({ name: name, value: "???"}) 

    return properties

  render: ->
    if @props.entity
      propElems = _.map @formatEntityProperties(@props.entity), (prop) =>
        H.div key: prop.name,
          H.span className: "text-muted",
            prop.name + ": "
          prop.value

      return H.div null,
        propElems
    else if @props.notFound
      return H.div className: "text-warning", @props.T("Not found")
    else
      # Blank means no entity
      return H.div()

