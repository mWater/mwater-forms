_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')

# Allows selecting an admin region via cascading dropdowns
module.exports = class AdminRegionSelectComponent extends AsyncLoadComponent 
  @propTypes: 
    getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    value: React.PropTypes.string     # id of admin region
    onChange: React.PropTypes.func.isRequired  # Called with new id

  @contextTypes:
    T: React.PropTypes.func.isRequired  # Localizer to use

  componentWillMount: ->
    super

    # Get countries initially
    @props.getSubAdminRegions(null, 0, (error, level0s) =>
      @setState(level0s: level0s)
    )

  # Override to determine if a load is needed. Not called on mounting
  isLoadNeeded: (newProps, oldProps) ->
    return newProps.value != oldProps.value

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    # Leave current state alone while loading
    callback(busy: true) # loading is reserved

    # Get path
    if props.value
      props.getAdminRegionPath(props.value, (error, path) =>
        if error
          return callback(error: error, busy: false)

        callback(error: null, path: path, busy: false, level1s: null, level2s: null, level3s: null, level4s: null, level5s: null)

        # Get subadmins
        for pathElem in path
          do (pathElem) =>
            props.getSubAdminRegions(pathElem.id, pathElem.level + 1, (error, subRegions) =>
              if error
                return callback(error: error)

              # Set levelNs to be list of values
              val = {}
              val["level#{pathElem.level + 1}s"] = subRegions
              callback(val)
            )
      )
    else
      callback(error: null, path: [], busy: false)

    # props.imageManager.getImageUrl(props.imageId, (url) =>
    #   callback(url: url, error: false)
    # , => callback(error: true))

  handleChange: (level, ev) =>
    if ev.target.value
      @props.onChange(ev.target.value)
    else if level > 0
      # Use level above
      @props.onChange(@state.path[level - 1].id)
    else
      @props.onChange(null)
  
  renderLevel: (level) ->
    if not @state.path[level] and (not @state["level#{level}s"] or @state["level#{level}s"].length == 0)
      return null

    H.tr key: level,
      H.td style: { paddingLeft: 10, paddingRight: 10 }, className: "text-muted",
        if @state.path[level]
          @state.path[level].type
      H.td null,
        H.select key: "level#{level}", className: "form-control", value: (if @state.path[level] then @state.path[level].id else ""), onChange: @handleChange.bind(null, level),
          H.option key: "none", value: "", 
            if @state.path[level] then @context.T("None") else @context.T("Select...")

          if @state["level#{level}s"]
            _.map(@state["level#{level}s"], (subRegion) => H.option(key: subRegion.id, value: subRegion.id, subRegion.name))
          else if @state.path[level] # No options yet, just use value
            H.option(key: @state.path[level].id, value: @state.path[level].id, @state.path[level].name)

  render: ->
    if @state.loading or (not @state.path and @props.value) or (not @props.value and not @state.level0s)
      return H.div null, @context.T("Loading...") 

    H.table style: { opacity: (if @state.busy then 0.5) },
      H.tbody null, 
        _.map(_.range(0, @state.path.length + 1), (level) => @renderLevel(level))

    # if @state.loading
    #   # TODO better as font-awesome or suchlike
    #   url = "img/image-loading.png"
    # else if @state.error
    #   # TODO better as font-awesome or suchlike
    #   url = "img/no-image-icon.jpg"
    # else if @state.url
    #   url = @state.url

    # return H.img(src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)

