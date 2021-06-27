// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let BarcodeAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import * as formUtils from '../formUtils';

// Functional? I haven't tried this one yet
// Not tested

export default BarcodeAnswerComponent = (function() {
  BarcodeAnswerComponent = class BarcodeAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        scanBarcode: PropTypes.func,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        value: PropTypes.string,
        onValueChange: PropTypes.func.isRequired
      };
    }

    focus() {
      // Nothing to focus
      return null;
    }

    handleValueChange = () => {
      return this.props.onValueChange(!this.props.value);
    };

    handleScanClick = () => {
      return this.context.scanBarcode({ success: text => {
        return this.props.onValueChange(text);
      }
      });
    };

    handleClearClick = () => {
      return this.props.onValueChange(null);
    };

    render() {
      const supported = (this.context.scanBarcode != null);

      if (this.props.value) {
        return R('div', null,
          R('pre', null,
            R('p', null,
              this.props.value)
          ),
          R('div', null,
            R('button', {className: "btn btn-default", onClick: this.handleClearClick, type: "button"},
              R('span', {className: "glyphicon glyphicon-remove"},
              this.context.T("Clear"))
            )
          )
        );
      } else {
        if (supported) {
          return R('div', null,
            R('button', {className: "btn btn-default", onClick: this.handleScanClick, type: "button"},
              R('span', {className: "glyphicon glyphicon-qrcode"}),
              this.context.T("Scan")
            )
          );
        } else {
          return R('div', {className: "text-warning"},
            this.context.T("Barcode scanning not supported on this platform"));
        }
      }
    }
  };
  BarcodeAnswerComponent.initClass();
  return BarcodeAnswerComponent;
})();
