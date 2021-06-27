// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from 'lodash';
import compare from './compare';
import { assert } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import RosterGroupComponent from '../src/RosterGroupComponent';
import MockTContextWrapper from './MockTContextWrapper';
import { default as ResponseRow } from '../src/ResponseRow';

describe("RosterGroupComponent", function() {
  beforeEach(function() {
    this.toDestroy = [];

    // Options should include data
    this.render = options => {
      const elem = R(RosterGroupComponent, _.defaults(options, { 
        isVisible() { return true; },
        onDataChange() {},
        responseRow: new ResponseRow({
          responseData: options.data,
          formDesign: { contents: [this.rosterGroup] }
          })
      }));
      const comp = new TestComponent(R(MockTContextWrapper, null, elem));
      this.toDestroy.push(comp);
      return comp;
    };

    // Create sample rosterGroup with single text question
    return this.rosterGroup = {
      _id: "a",
      name: { en: "Name" },
      contents: [
        // Text question
        { _id: "text", _type: "TextQuestion", text: { en: "Text" }, format: "singleline" }
      ]
    };});

  afterEach(function() {
    return this.toDestroy.map((comp) =>
      comp.destroy());
  });

  it("adds entry when add is clicked", function(done) {
    const onDataChange = val => {
      assert.equal(val.a.length, 1);
      assert(val.a[0]._id);
      assert.deepEqual(val.a[0].data, {});
      return done();
    };

    this.rosterGroup.allowAdd = true;
    const comp = this.render({rosterGroup: this.rosterGroup, data: {}, onDataChange});
    const buttons = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "button");
    return TestComponent.click(buttons[0]);
  });

  it("does not show add if add is disabled", function() {
    const comp = this.render({rosterGroup: this.rosterGroup, data: {}});
    return assert(!comp.findDOMNodeByText(/add/i));
  });

  it("removes entry when remove is clicked", function(done) {
    const onDataChange = val => {
      // Removes first one
      compare(val, { a: [{ _id: "2", data: { x: { value: 2 } } }] });
      return done();
    };

    this.rosterGroup.allowRemove = true;
    const comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: { x: { value: 1 } } }, { _id: "2", data: { x: { value: 2 } } }] }, onDataChange});
    return TestComponent.click(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove")[0]);
  });

  it("does not show remove if remove is disabled", function() {
    const comp = this.render({rosterGroup: this.rosterGroup, data: {}});
    return assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithClass(comp.getComponent(), "glyphicon-remove").length, 0);
  });

  it("puts answers from inner components in correct position in array", function(done) {
    const onDataChange = val => {
      compare(val, { a: [{ _id: "1", data: {}}, { _id: "2", data: { text: { value: "x", alternate: null}}}] });
      return done();
    };

    const comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: {}}, { _id: "2", data: {}}] }, onDataChange});

    // Set last input
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input");
    inputs[1].value = "x";
    ReactTestUtils.Simulate.change(inputs[1]);
    return ReactTestUtils.Simulate.blur(inputs[1]);
  });

  it("uses alternate rosterId if specified", function(done) {
    const onDataChange = val => {
      assert.equal(val.b.length, 1);
      assert(val.b[0]._id);
      assert.deepEqual(val.b[0].data, {});
      return done();
    };

    this.rosterGroup.allowAdd = true;
    this.rosterGroup.rosterId = "b";
    const comp = this.render({rosterGroup: this.rosterGroup, data: {}, onDataChange});
    return TestComponent.click(ReactTestUtils.findRenderedDOMComponentWithTag(comp.getComponent(), "button"));
  });

  it("displays prompt", function() {
    const comp = this.render({rosterGroup: this.rosterGroup, data: {}});
    return assert(comp.findDOMNodeByText(/Name/));
  });

  it("displays default entry header of n.", function() {
    this.rosterGroup.allowRemove = true;
    const comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }});
    assert(comp.findDOMNodeByText(/1\./));
    return assert(comp.findDOMNodeByText(/2\./));
  });

  return it("hides sub-items if isVisible for <id/rosterId>.<n>.<questionId> is false", function() {
    // Hide first
    let isVisible = id => !["a.0.text"].includes(id);
    let comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible});
    assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 1);

    // Hide both
    isVisible = id => !["a.0.text", "a.1.text"].includes(id);
    comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible});
    assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 0);

    // Uses rosterId
    isVisible = id => !["b.0.text", "b.1.text"].includes(id);
    this.rosterGroup.rosterId = "b";
    comp = this.render({rosterGroup: this.rosterGroup, data: { a: [{ _id: "1", data: {} }, { _id: "2", data: {} }] }, isVisible});
    return assert.equal(ReactTestUtils.scryRenderedDOMComponentsWithTag(comp.getComponent(), "input").length, 0);
  });
});

