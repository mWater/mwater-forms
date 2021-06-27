import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import BarcodeAnswerComponent from '../../src/answers/BarcodeAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;
import PropTypes from 'prop-types';

class BarcodeContext extends React.Component {
  static initClass() {
    this.childContextTypes = {
      scanBarcode: PropTypes.func,
      T: PropTypes.func.isRequired
    };
  }

  getChildContext() {
    const ctx = {
      T(str) { return str; }
    };

    if (this.props.enableScanBarcode) {
      ctx.scanBarcode = function(callback) {
        const f = () => callback.success('0123456789');
        return setTimeout(f, 30);
      };
    }
        
    return ctx;
  }

  render() {
    return this.props.children;
  }
}
BarcodeContext.initClass();

describe('BarcodeAnswerComponent', function() {
  describe('Works without scanBarcode', function() {
    beforeEach(function() {
      this.toDestroy = [];

      return this.render = (options = {}) => {
        const elem = R(BarcodeContext, {},
          R(BarcodeAnswerComponent, options)
        );
        const comp = new TestComponent(elem);
        this.toDestroy.push(comp);
        return comp;
      };
    });

    afterEach(function() {
      return this.toDestroy.map((comp) =>
        comp.destroy());
    });

    return it("shows text if not supported", function() {
      // If no context is passed, scanBarcode is not defined and so the feature is not supported
      const comp = this.render({onValueChange() { return null; }});
      const component = comp.findDOMNodeByText(/not supported/i);
      return assert((component != null), 'Not showing not supported text');
    });
  });


  return describe('Works with scanBarcode', function() {
    beforeEach(function() {
      this.toDestroy = [];

      return this.render = (options = {}) => {
        const elem = R(BarcodeContext, { enableScanBarcode: true },
          R(BarcodeAnswerComponent, options)
        );
        //elem = R(BarcodeAnswerComponent, options)
        const comp = new TestComponent(elem);
        this.toDestroy.push(comp);
        return comp;
      };
    });

    afterEach(function() {
      return this.toDestroy.map((comp) =>
        comp.destroy());
    });

    it("shows scan button", function() {
      const comp = this.render({onValueChange() { return null; }});
      const button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn');
      return assert((button != null), 'Not showing scan button');
    });

    it("shows clear button when value is set", function() {
      const comp = this.render({
        onValueChange() {
          return null;
        },
        value: 'sometext'
      });
      // TODO: the method to find the Scan button doesn't seem to work
      const component = comp.findDOMNodeByText(/Clear/i);
      return assert((component != null), 'Not showing clear button');
    });

    it("shows scan button", function(done) {
      const comp = this.render({onValueChange(value) {
        assert.equal(value, "0123456789");
        return done();
      }
      });
      const button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn');
      return TestComponent.click(button);
    });

    return it("clears when clear pressed", function(done) {
      const comp = this.render({
        value: 'sometext',
        onValueChange(value) {
          assert.equal(value, null);
          return done();
        }
      });
      const button = ReactTestUtils.findRenderedDOMComponentWithClass(comp.getComponent(), 'btn');
      return TestComponent.click(button);
    });
  });
});
