// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionSelectComponent
import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent"

// Allows selecting an admin region via cascading dropdowns
export default AdminRegionSelectComponent = (function () {
  AdminRegionSelectComponent = class AdminRegionSelectComponent extends AsyncLoadComponent {
    static initClass() {
      this.propTypes = {
        getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
        getSubAdminRegions: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
        value: PropTypes.string, // id of admin region
        onChange: PropTypes.func.isRequired, // Called with new id
        T: PropTypes.func.isRequired
      }
      // Localizer to use
    }

    componentWillMount(props: any) {
      super.componentWillMount(props)

      // Get countries initially
      return this.props.getSubAdminRegions(null, 0, (error: any, level0s: any) => {
        return this.setState({ level0s })
      })
    }

    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps: any, oldProps: any) {
      return newProps.value !== oldProps.value
    }

    // Call callback with state changes
    load(props: any, prevProps: any, callback: any) {
      // Leave current state alone while loading
      callback({ busy: true }) // loading is reserved

      // Get path
      if (props.value) {
        return props.getAdminRegionPath(props.value, (error: any, path: any) => {
          if (error) {
            return callback({ error, busy: false })
          }

          callback({
            error: null,
            path,
            busy: false,
            level1s: null,
            level2s: null,
            level3s: null,
            level4s: null,
            level5s: null
          })

          // Get subadmins
          return path.map((pathElem: any) =>
            ((pathElem) => {
              return props.getSubAdminRegions(pathElem.id, pathElem.level + 1, (error: any, subRegions: any) => {
                if (error) {
                  return callback({ error })
                }

                // Set levelNs to be list of values
                const val = {}
                val[`level${pathElem.level + 1}s`] = subRegions
                return callback(val)
              })
            })(pathElem)
          )
        })
      } else {
        return callback({ error: null, path: [], busy: false })
      }
    }

    // props.imageManager.getImageUrl(props.imageId, (url) =>
    //   callback(url: url, error: false)
    // , => callback(error: true))

    handleChange = (level: any, ev: any) => {
      if (ev.target.value) {
        return this.props.onChange(ev.target.value)
      } else if (level > 0) {
        // Use level above
        return this.props.onChange(this.state.path[level - 1].id)
      } else {
        return this.props.onChange(null)
      }
    }

    renderLevel(level: any) {
      if (!this.state.path[level] && (!this.state[`level${level}s`] || this.state[`level${level}s`].length === 0)) {
        return null
      }

      return R(
        "tr",
        { key: level },
        R(
          "td",
          { style: { paddingLeft: 10, paddingRight: 10 }, className: "text-muted" },
          this.state.path[level] ? this.state.path[level].type : undefined
        ),
        R(
          "td",
          null,
          R(
            "select",
            {
              key: `level${level}`,
              className: "form-control",
              value: this.state.path[level] ? this.state.path[level].id : "",
              onChange: this.handleChange.bind(null, level)
            },
            R(
              "option",
              { key: "none", value: "" },
              this.state.path[level] ? this.props.T("None") : this.props.T("Select...")
            ),

            (() => {
              if (this.state[`level${level}s`]) {
                return _.map(this.state[`level${level}s`], (subRegion) =>
                  R("option", { key: subRegion.id, value: subRegion.id }, subRegion.name)
                )
              } else if (this.state.path[level]) {
                // No options yet, just use value
                return R(
                  "option",
                  { key: this.state.path[level].id, value: this.state.path[level].id },
                  this.state.path[level].name
                )
              }
            })()
          )
        )
      )
    }

    render() {
      if (this.state.loading || (!this.state.path && this.props.value) || (!this.props.value && !this.state.level0s)) {
        return R("div", null, this.props.T("Loading..."))
      }

      return R(
        "table",
        { style: { opacity: this.state.busy ? 0.5 : undefined } },
        R(
          "tbody",
          null,
          _.map(_.range(0, this.state.path.length + 1), (level) => this.renderLevel(level))
        )
      )
    }
  }
  AdminRegionSelectComponent.initClass()
  return AdminRegionSelectComponent
})()

// if @state.loading
//   # TODO better as font-awesome or suchlike
//   url = "img/image-loading.png"
// else if @state.error
//   # TODO better as font-awesome or suchlike
//   url = "img/no-image-icon.jpg"
// else if @state.url
//   url = @state.url

// return R('img', src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)
