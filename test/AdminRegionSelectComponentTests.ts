// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// No longer used!
// _ = require 'lodash'
// assert = require('chai').assert
// React = require('react')
// ReactTestUtils = require('react-dom/test-utils')

// TestComponent = require('react-library/lib/TestComponent')
// AdminRegionSelectComponent = require '../src/AdminRegionSelectComponent'

// describe 'AdminRegionSelectComponent', ->
//   beforeEach ->
//     @render = (options = {}) =>
//       canada = { id: "canada", level: 0, name: "Canada", type: "Country" }
//       manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" }
//       ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" }

//       props = {
//         getAdminRegionPath: (id, callback) =>
//           if id == 'manitoba'
//             callback(null, [canada, manitoba])
//           else if id == "canada"
//             callback(null, [canada])
//           else
//             callback(null, [])
//         getSubAdminRegions: (id, level, callback) =>
//           if not id?
//             assert.equal level, 0
//             callback(null, [canada])
//           else if id == "canada"
//             assert.equal level, 1
//             callback(null, [manitoba, ontario])
//           else
//             callback(null, [])
//         onChange: (id) =>
//           @onChangeValue = id
//         T: (str) -> str
//       }

//       elem = React.createElement(AdminRegionSelectComponent, _.extend(props, options))
//       @testComp = new TestComponent(elem)
//       @comp = @testComp.comp

//     @value = "NOT SET"
//     @onChange = (value) => @value = value

//   afterEach ->
//     if @testComp
//       @testComp.destroy()
//     @testComp = null

//   it "has one dropdown with countries for no value", (done) ->
//     @render(value: null)
//     _.defer () =>
//       selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")

//       assert.equal selects.length, 1, "One select"

//       options = selects[0].children
//       assert.equal options.length, 2, "select + 1 country"
//       done()

//   it "displays no select when getSubAdminRegions not called back with no value", (done) ->
//     @render(value: null, getSubAdminRegions: (->))
//     _.defer () =>
//       divs = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "div")
//       assert.match divs[0].textContent, /loading/i
//       done()

//   it "displays country when getSubAdminRegions not called back with value", (done) ->
//     @render(value: "canada", getSubAdminRegions: (->))
//     _.defer () =>
//       options = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "option")
//       assert.equal options[1].value, "canada", "Should have option canada after Select..."

//       selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")
//       assert.equal selects[0].value, "canada", "Should have value canada"
//       done()

//   it "displays loading when getAdminRegionPath not called back with value", (done) ->
//     @render(value: "canada", getAdminRegionPath: (->))
//     _.defer () =>
//       divs = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "div")
//       assert.match divs[0].textContent, /loading/i
//       done()

//   it "shows second dropdown with second level when country selected", (done) ->
//     @render(value: "canada")
//     _.defer () =>
//       selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")
//       options = selects[1].children

//       assert.equal options[1].value, "manitoba"
//       assert.equal options[2].value, "ontario"
//       done()

//   # These tests don't work as for some reason react is not responding to select onChange events in test mode, even with jQuery .val()
//   # it "calls onChange with country when selected", (done) ->
//   #   @render(value: null)
//   #   _.defer () =>
//   #     select = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")[0]
//   #     TestComponent.changeValue(select, "canada")
//   #     _.defer () =>
//   #       assert.equal @value, "canada"
//   #       done()

//   # it "allows resetting first level", (done) ->
//   #   @render(value: "manitoba")
//   #   _.defer () =>
//   #     TestComponent.changeValue(ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")[0], "")
//   #     assert.equal @value, null
//   #     done()

//   # it "allows resetting second level", (done) ->
//   #   @render(value: "manitoba")
//   #   _.defer () =>
//   #     TestComponent.changeValue(ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")[1], "")
//   #     assert.equal @value, "canada"
//   #     done()

//   it "has None as an option with value", (done) ->
//     @render(value: "canada")
//     _.defer () =>
//       options = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "option")
//       assert.match options[0].text, /none/i
//       done()

//   it "has Select as option with no value", (done) ->
//     @render(value: null)
//     _.defer () =>
//       options = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "option")
//       assert.match options[0].text, /select/i
//       done()

//   it "doesn't show another dropdown if no available values", (done) ->
//     @render(value: "manitoba")
//     _.defer () =>
//       selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(@comp, "select")

//       assert.equal selects.length, 2
//       done()
