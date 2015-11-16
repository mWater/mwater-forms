React = require 'react'
ImageDisplayComponent = require './ImageDisplayComponent'
H = React.DOM

# Loads and displays a site by code
module.exports = class SiteDisplayComponent extends React.Component
  @propTypes:
    siteCode: React.PropTypes.string
    formCtx: React.PropTypes.object.isRequired
    hideCode: React.PropTypes.bool  # True to hide code display

  constructor: (props) ->
    super
    @state = { site: null }

  componentWillReceiveProps: (newProps) -> @update(newProps)
  componentDidMount: -> @update(@props)

  update: (props) ->
    if not props.siteCode
      return @setState(site: null)

    # Load site
    if props.formCtx.getSite
      props.formCtx.getSite(props.siteCode, (site) =>
        @setState(site: site)
      )

  renderNameValue: (name, value) ->
    H.div key: name,
      H.span className: "text-muted",
        name + ": "
      value

  render: ->
    if not @props.siteCode
      return null

    if not @state.site
      if not @props.hideCode
        return @renderNameValue("Code", @props.siteCode)
      else
        return null

    H.div null, 
      if not @props.hideCode
        @renderNameValue("Code", @state.site.code)
      @renderNameValue("Name", @state.site.name)
      if @state.site.desc
        @renderNameValue("Description", @state.site.desc)
      if @state.site.type
        @renderNameValue("Type", @state.site.type.join(": "))
      if @state.site.photos and @state.site.photos.length > 0
        @renderNameValue("Photos", 
          _.map(@state.site.photos, (img) =>
            React.createElement(ImageDisplayComponent, formCtx: @props.formCtx, id: img.id))
        )


