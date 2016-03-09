React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

AdminRegionSelectComponent = require './AdminRegionSelectComponent'

# Setup mock localizer
global.T = (str) -> str

$ ->

  canada = { id: "canada", level: 0, name: "Canada", type: "Country" }
  manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" }
  ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" }

  getAdminRegionPath = (id, callback) ->
    if id == 'manitoba'
      callback(null, [canada, manitoba])
    else if id == 'ontario'
      callback(null, [canada, ontario])
    else if id == "canada"
      callback(null, [canada])
    else
      callback(null, [])

  getSubAdminRegions = (id, callback) ->
    if not id?
      callback(null, [canada])
    else if id == "canada"
      callback(null, [manitoba, ontario])
    else
      callback(null, [])

  value = "manitoba"

  render = ->
    onChange = (id) ->
      console.log id
      value = id
      render()

    elem = React.createElement(AdminRegionSelectComponent, {
      getAdminRegionPath: getAdminRegionPath
      getSubAdminRegions: getSubAdminRegions
      onChange: onChange
      value: value
    })

    ReactDOM.render(elem, document.getElementById("main"))

  render()