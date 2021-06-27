import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import LocationAnswerComponent from '../../src/answers/LocationAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('LocationAnswerComponent', function() {
  before(function() {
    this.toDestroy = [];

    return this.render = (options = {}) => {
      const elem = R(LocationAnswerComponent, options);
      const comp = new TestComponent(elem);
      this.toDestroy.push(comp);
      return comp;
    };
  });

  return afterEach(function() {
    for (let comp of this.toDestroy) {
      comp.destroy();
    }
    return this.toDestroy = [];});
});

// NOTE: All of this was already commented before we switched from LocationQuestion to LocationAnswerComponent
/*
  it "records location when set is clicked" #, ->
    * @ui.click("Set")
    * assert.deepEqual @model.get("q1234"), { value: { latitude: 1, longitude: 2, accuracy: 0 }}

  it "displays map" #, ->
    * assert not @mapDisplayed
    * @ui.click("Set")
    * @ui.click("Map")
    * assert.deepEqual @mapDisplayed, { latitude: 1, longitude: 2, accuracy: 0 }
*/