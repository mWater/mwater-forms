import _ from 'lodash';
import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import LikertAnswerComponent from '../../src/answers/LikertAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('LikertAnswerComponent', function() {
  before(function() {
    this.toDestroy = [];

    return this.render = (options = {}) => {
      options = _.extend({
        answer: {},
        choices: [
          { id: "choiceA", label: { _base: "en", en: "Choice A" } },
          { id: "choiceB", label: { _base: "en", en: "Choice B" } },
          { id: "choiceC", label: { _base: "en", en: "Choice C" } }
        ],
        items: [
          { id: "itemA", label: { _base: "en", en: "Item A" }, hint: { _base: "en", en: "a-hint" } },
          { id: "itemB", label: { _base: "en", en: "Item B" } },
          { id: "itemC", label: { _base: "en", en: "Item C" } }
        ],
        onAnswerChange() {
          return null;
        }
      }, options);

      const elem = R(LikertAnswerComponent, options);
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

  it("displays items", function() {
    const testComponent = this.render();

    const choiceA = testComponent.findDOMNodeByText(/Item A/);
    assert((choiceA != null), 'Not showing item A');

    const choiceB = testComponent.findDOMNodeByText(/Item B/);
    assert((choiceB != null), 'Not showing item B');

    const choiceC = testComponent.findDOMNodeByText(/Item C/);
    return assert((choiceC != null), 'Not showing item C');
  });

  it("displays choices", function() {
    const testComponent = this.render();

    const choiceA = testComponent.findDOMNodeByText(/Choice A/);
    assert((choiceA != null), 'Not showing choice A');

    const choiceB = testComponent.findDOMNodeByText(/Choice B/);
    assert((choiceB != null), 'Not showing choice B');

    const choiceC = testComponent.findDOMNodeByText(/Choice C/);
    return assert((choiceC != null), 'Not showing choice C');
  });

  it("displays choice hints", function() {
    const testComponent = this.render();

    const hintA = testComponent.findDOMNodeByText(/a-hint/);
    return assert((hintA != null), 'Not showing hint');
  });

  it("records selected choice", function(done) {
    const testComponent = this.render({
      onAnswerChange(answer) {
        assert.deepEqual(answer.value, {'itemB':'choiceB'});
        return done();
      }
    });

    const id = "itemB:choiceB";

    const itemBchoiceB = testComponent.findComponentById(id);

    assert((itemBchoiceB != null), 'could not find item B, choice B, radio btn');
    return TestComponent.click(itemBchoiceB);
  });

  return it("allows unselecting choice by clicking twice", function(done) {
    const testComponent = this.render({
      answer: {value: {'itemB': 'choiceB'}},
      onAnswerChange(answer) {
        assert.deepEqual(answer.value, {});
        return done();
      }
    });

    const id = "itemB:choiceB";

    const itemBchoiceB = testComponent.findComponentById(id);

    assert((itemBchoiceB != null), 'could not find item B, choice B, radio btn');
    return TestComponent.click(itemBchoiceB);
  });
});
