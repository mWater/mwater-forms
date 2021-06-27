import _ from 'lodash';
import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import MulticheckAnswerComponent from '../../src/answers/MulticheckAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('MulticheckAnswerComponent', function() {
  before(function() {
    this.toDestroy = [];

    return this.render = (options = {}) => {
      options = _.extend({
        choices: [
          { id: "a", label: { _base: "en", en: "AA" }, hint: { _base: "en", en: "a-hint" } },
          { id: "b", label: { _base: "en", en: "BB" } },
          { id: "c", label: { _base: "en", en: "CC" }, specify: true }
        ],
        answer: {value: []},
        onAnswerChange() {
          return null;
        }
      }, options);
      const elem = R(MulticheckAnswerComponent, options);
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

  it("displays choices", function() {
    const testComponent = this.render();

    const choiceA = testComponent.findDOMNodeByText(/AA/);
    assert((choiceA != null), 'Not showing choice AA');

    const choiceB = testComponent.findDOMNodeByText(/BB/);
    assert((choiceB != null), 'Not showing choice BB');

    const choiceC = testComponent.findDOMNodeByText(/CC/);
    return assert((choiceC != null), 'Not showing choice CC');
  });

  it("displays choice hints", function() {
    const testComponent = this.render();

    const hintA = testComponent.findDOMNodeByText(/a-hint/);
    return assert((hintA != null), 'Not showing hint');
  });

  it("records selected choice", function(done) {
    const testComponent = this.render({
      onAnswerChange(answer) {
        assert.deepEqual(answer.value, ['a']);
        return done();
      }
    });

    const choiceA = testComponent.findComponentById('a');

    assert((choiceA != null), 'could not find choice A');
    return TestComponent.click(choiceA);
  });

  it("records multiple selected choice", function(done) {
    const testComponent = this.render({
      answer: {value: ['a']},
      onAnswerChange(answer) {
        assert.deepEqual(answer.value, ['a', 'b']);
        return done();
      }
    });

    const choiceB = testComponent.findComponentById('b');

    assert((choiceB != null), 'could not find choice B');
    return TestComponent.click(choiceB);
  });

  it("can unselected choice", function(done) {
    const testComponent = this.render({
      answer: {value: ['a', 'b']},
      onAnswerChange(answer) {
        assert.deepEqual(answer.value, ['a']);
        return done();
      }
    });

    const choiceB = testComponent.findComponentById('b');

    assert((choiceB != null), 'could not find choice B');
    return TestComponent.click(choiceB);
  });

  it("displays specify box", function() {
    const testComponent = this.render({value: ['c']});

    const specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass.bind(this, testComponent.getComponent(), 'specify-input');

    return assert((specifyInput != null), 'could not find specify input');
  });

  it("it doesn't displays specify box when a choice without specify is selected", function() {
    const testComponent = this.render({value: ['a']});

    return assert.throws(ReactTestUtils.findRenderedDOMComponentWithClass.bind(this, testComponent.getComponent(), 'specify-input'), 'Did not find exactly one match (found: 0) for class:specify-input');
  });


  it("records specify value", function(done) {
    const testComponent = this.render({
      onAnswerChange(answer) {
        assert.deepEqual(answer.specify, {'c': 'specify'});
        return done();
      },
      answer: {value: ['c']}
    });

    const specifyInput = ReactTestUtils.findRenderedDOMComponentWithClass(testComponent.getComponent(), 'specify-input');
    return TestComponent.changeValue(specifyInput, 'specify');
  });

  it("does remove specify value on unselection", function(done) {
    const testComponent = this.render({
      onAnswerChange(answer) {
        assert.deepEqual(answer.specify, {});
        return done();
      },
      answer: {value: ['c'], specify: {c: 'specify'}}
    });

    const choiceC = testComponent.findComponentById('c');
    return TestComponent.click(choiceC);
  });

  return it("does not remove specify value on other selection", function(done) {
    const testComponent = this.render({
      onAnswerChange(answer) {
        assert.deepEqual(answer.specify, {c: 'specify'});
        return done();
      },
      answer: {value: ['c'], specify: {c: 'specify'}}
    });

    const choiceB = testComponent.findComponentById('b');
    return TestComponent.click(choiceB);
  });
});
