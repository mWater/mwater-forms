import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import StopwatchAnswerComponent from '../../src/answers/StopwatchAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('StopwatchAnswerComponent', function() {
  let clock = null;
  
  before(function() {
    clock = sinon.useFakeTimers();
    
    this.toDestroy = [];

    return this.render = (options = {}) => {
      if (!options.T) {
        options.T = str => str;
      }
      const elem = R(StopwatchAnswerComponent, options);
      const comp = new TestComponent(elem);
      this.toDestroy.push(comp);
      return comp;
    };
  });

  afterEach(function() {
    for (let comp of this.toDestroy) {
      comp.destroy();
    }
    return this.toDestroy = [];});
    
  after(() => clock.restore());

  it("records after [start, ticks, stop]", function(done) {
    let ready = false;
    const comp = this.render({
      onValueChange(value) {
        if (ready) {
          assert.equal(value, 1.23);
          return done();
        }
      }
    });
    const btnStart = comp.findDOMNodeByText("Start");
    const btnStop = comp.findDOMNodeByText("Stop");
    ReactTestUtils.Simulate.click(btnStart);
    ready = true;
    clock.tick(1234);
    return ReactTestUtils.Simulate.click(btnStop);
  });

  return it("resets after [start, ticks, stop, reset]", function(done) {
    let ready = false;
    const comp = this.render({
      onValueChange(value) {
        if (ready) {
          assert.equal(value, null);
          return done();
        }
      }
    });
    const btnStart = comp.findDOMNodeByText("Start");
    const btnStop = comp.findDOMNodeByText("Stop");
    const btnReset = comp.findDOMNodeByText("Reset");
    ReactTestUtils.Simulate.click(btnStart);
    clock.tick(1234);
    ReactTestUtils.Simulate.click(btnStop);
    ready = true;
    return ReactTestUtils.Simulate.click(btnReset);
  });
});
