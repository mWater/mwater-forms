assert = require('chai').assert
AquagenxCBTAnswerComponent = require '../../src/answers/AquagenxCBTAnswerComponent'

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

class AquagenxCBTContext extends React.Component
  @childContextTypes:
    T: React.PropTypes.func.isRequired
    imageManager: React.PropTypes.object.isRequired

  getChildContext: ->
    ctx = {
      T: (str) -> str
      imageManager: {
        getImageUrl: (id, success, error) -> error("Not implemented")
        getThumbnailImageUrl: (id, success, error) -> error("Not implemented")
      }
    }

    return ctx

  render: ->
    return @props.children

# TODO: Rework the whole thing, many things have changed since version 0.1
describe.skip 'AquagenxCBTAnswerComponent', ->
  beforeEach ->
    @toDestroy = []

    @render = (options = {}) =>
      elem = R AquagenxCBTContext, {},
        R(AquagenxCBTAnswerComponent, options)
      comp = new TestComponent(elem)
      @toDestroy.push(comp)
      return comp

  afterEach ->
    for comp in @toDestroy
      comp.destroy()

  it "clicking updates the values", (callback) ->
    onValueChange = (value) ->
      assert.deepEqual value, {cbt: {c1: true, c2: false, c3: false, c4: false, c5: false, mpn: 1.1, confidence: 5.16, healthRisk: 'probably_safe'}}
      callback()

    @comp = @render({
      value: {}
      questionId: 'questionId'
      onValueChange: onValueChange
      label: {en: 'test label', _base: 'en'}
    })

    component = @comp.getComponent()
    compartment1 = $( component.refs.main ).find( "#compartment12" )
    assert compartment1, 'Could not find the compartment'
    compartment1.click()


