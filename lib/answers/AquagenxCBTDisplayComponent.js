"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AquagenxCBTDisplayComponent,
    AquagenxCBTDisplaySVGString,
    ImageDisplayComponent,
    PropTypes,
    R,
    React,
    _,
    getHealthRiskString,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

_ = require('lodash');
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
AquagenxCBTDisplaySVGString = require('./AquagenxCBTDisplaySVG');
getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString;
ImageDisplayComponent = require('../ImageDisplayComponent');

module.exports = AquagenxCBTDisplayComponent = function () {
  var AquagenxCBTDisplayComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(AquagenxCBTDisplayComponent, _React$Component);

    function AquagenxCBTDisplayComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, AquagenxCBTDisplayComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AquagenxCBTDisplayComponent).apply(this, arguments));
      _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(AquagenxCBTDisplayComponent, [{
      key: "handleClick",
      value: function handleClick() {
        boundMethodCheck(this, AquagenxCBTDisplayComponent);

        if (this.props.onEdit) {
          return this.props.onEdit();
        }
      }
    }, {
      key: "renderStyle",
      value: function renderStyle() {
        var cbtValues, compartmentColors, compartmentValues, mainId;
        mainId = "#cbtDisplay".concat(this.props.questionId);
        cbtValues = this.props.value.cbt;
        compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
        compartmentColors = _.map(compartmentValues, function (c) {
          if (c) {
            return '#32a89b';
          } else {
            return '#ebe7c2';
          }
        });
        return R('style', null, "".concat(mainId, " #compartment1 rect { fill: ").concat(compartmentColors[0], "; } ").concat(mainId, " #compartment2 rect { fill: ").concat(compartmentColors[1], "; } ").concat(mainId, " #compartment3 rect { fill: ").concat(compartmentColors[2], "; } ").concat(mainId, " #compartment4 rect { fill: ").concat(compartmentColors[3], "; } ").concat(mainId, " #compartment5 rect { fill: ").concat(compartmentColors[4], "; }"));
      }
    }, {
      key: "renderInfo",
      value: function renderInfo() {
        var cbtValues, mpn;
        cbtValues = this.props.value.cbt;
        mpn = cbtValues.mpn;

        if (mpn === 100) {
          mpn = '>100';
        }

        return R('div', null, R('div', null, this.context.T('MPN/100ml') + ': ', R('b', null, mpn)), R('div', null, this.context.T('Upper 95% Confidence Interval/100ml') + ': ', R('b', null, cbtValues.confidence)), R('div', null, this.context.T('Health Risk Category Based on MPN and Confidence Interval') + ': ', R('b', null, getHealthRiskString(cbtValues.healthRisk, this.context.T))));
      }
    }, {
      key: "renderPhoto",
      value: function renderPhoto() {
        // Displays an image
        if (this.props.value.image && this.props.imageManager) {
          return R('div', null, React.createElement(ImageDisplayComponent, {
            image: this.props.value.image,
            imageManager: this.props.imageManager,
            T: this.context.T
          }));
        }
      }
    }, {
      key: "render",
      value: function render() {
        var ref; // Can't display if not set

        if (!((ref = this.props.value) != null ? ref.cbt : void 0)) {
          return null;
        }

        return R('div', {
          id: "cbtDisplay".concat(this.props.questionId)
        }, this.renderStyle(), R('div', {
          dangerouslySetInnerHTML: {
            __html: AquagenxCBTDisplaySVGString
          },
          onClick: this.handleClick
        }), this.renderInfo(), this.renderPhoto());
      }
    }]);
    return AquagenxCBTDisplayComponent;
  }(React.Component);

  ;
  AquagenxCBTDisplayComponent.contextTypes = {
    T: PropTypes.func.isRequired // Localizer to use

  };
  AquagenxCBTDisplayComponent.propTypes = {
    value: PropTypes.object,
    questionId: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    imageManager: PropTypes.object // If not specified, do not display image

  };
  return AquagenxCBTDisplayComponent;
}.call(void 0);