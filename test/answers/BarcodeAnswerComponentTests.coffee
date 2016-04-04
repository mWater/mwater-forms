assert = require('chai').assert

TestComponent = require('react-library/lib/TestComponent')
ReactTestUtils = require('react-addons-test-utils')

BarcodeAnswerComponent = require '../../src/answers/BarcodeAnswerComponent'

React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

class BarcodeContext extends React.Component
  @childContextTypes:
    scanBarcode: React.PropTypes.func

  getChildContext: ->
    scanBarcode: (callback) ->
      f = () ->
        callback.success('0123456789')
      setTimeout f, 30

  render: ->
    return @props.children


describe 'BarcodeAnswerComponent', ->
  describe 'Works without scanBarcode', ->
    beforeEach ->
      @toDestroy = []

      @render = (options = {}) =>
        elem = R(BarcodeAnswerComponent, options)
        comp = new TestComponent(elem)
        @toDestroy.push(comp)
        return comp

    afterEach ->
      for comp in @toDestroy
        comp.destroy()

    it "shows text if not supported", ->
      # If no context is passed, scanBarcode is not defined and so the feature is not supported
      comp = @render({onValueChange: null})
      component = comp.findDOMNodeByText(/not supported/i)
      assert component?, 'Not showing not supported text'


  describe 'Works with scanBarcode', ->
    beforeEach ->
      @toDestroy = []

      @render = (options = {}) =>
        elem = R(BarcodeContext, {},
          R(BarcodeAnswerComponent, options)
        )
        #elem = R(BarcodeAnswerComponent, options)
        comp = new TestComponent(elem)
        @toDestroy.push(comp)
        return comp

    afterEach ->
      for comp in @toDestroy
        comp.destroy()

    it "shows scan button", ->
      comp = @render({onValueChange: () -> null})
      button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn')
      assert button?, 'Not showing scan button'

    it "shows clear button when value is set", ->
      comp = @render({
        onValueChange: () ->
          null
        value: 'sometext'
      })
      # TODO: the method to find the Scan button doesn't seem to work
      component = comp.findDOMNodeByText(/Clear/i)
      assert component?, 'Not showing clear button'

    it "shows scan button", (done) ->
      comp = @render({onValueChange: (value) ->
        assert.equal value, "0123456789"
        done()
      })
      button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn')
      TestComponent.click(button)

    it "clears when clear pressed", (done) ->
      comp = @render({
        value: 'sometext'
        onValueChange: (value) ->
          assert.equal value, null
          done()
      })
      button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn')
      TestComponent.click(button)

    it "enforces required", ->
      assert false
      #@q.required = true
      #@qview = @compiler.compileQuestion(@q).render()
      #assert @qview.validate()
      #
      #@q.required = false
      #@qview = @compiler.compileQuestion(@q).render()
      #assert not @qview.validate()
