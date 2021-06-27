import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import NumberAnswerComponent from '../../src/answers/NumberAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('NumberAnswerComponent', function() {
  before(function() {
    this.toDestroy = [];

    return this.render = (options = {}) => {
      const elem = R(NumberAnswerComponent, options);
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

  it("records decimal number", function(done) {
    const comp = this.render({
      decimal: true,
      onChange(value) {
        assert.equal(value, 123.4);
        return done();
      }
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123.4");
    return ReactTestUtils.Simulate.blur(input);
  });

  it("records whole number", function(done) {
    const comp = this.render({
      decimal: false,
      onChange(value) {
        assert.equal(value, 123);
        return done();
      }
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123");
    return ReactTestUtils.Simulate.blur(input);
  });

  it("enforces decimal number", function(done) {
    const comp = this.render({
      decimal: true,
      onChange(value) {
        assert.equal(value, null);
        return done();
      }
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123.4abc");
    return ReactTestUtils.Simulate.blur(input);
  });

  it("enforces whole number", function(done) {
    const comp = this.render({
      decimal: false,
      onChange(value) {
        return assert.fail();
      }
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123.4");
    ReactTestUtils.Simulate.blur(input);
    return done();
  });

  it("validates decimal number", function() {
    const comp = this.render({
      decimal: true,
      onChange() {}
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123.4");
    ReactTestUtils.Simulate.blur(input);
    return assert(!comp.getComponent().validate());
  });

  return it("fails validation if invalid whole number", function() {
    const comp = this.render({
      decimal: false,
      onChange() {}
    });
    const input = comp.findInput();
    TestComponent.changeValue(input, "123abc");
    ReactTestUtils.Simulate.blur(input);
    return assert(comp.getComponent().validate());
  });
});
