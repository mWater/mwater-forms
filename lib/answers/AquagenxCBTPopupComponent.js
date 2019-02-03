'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $,
    AquagenxCBTPopupComponent,
    ModalPopupComponent,
    PropTypes,
    R,
    React,
    _,
    aquagenxCBTSVGString,
    getHealthRiskString,
    possibleCombinations,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

_ = require('lodash');

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

$ = require('jquery');

aquagenxCBTSVGString = require('./AquagenxCBTSVG');

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString;

possibleCombinations = {
  "false,false,false,false,false": {
    mpn: 0.0,
    confidence: 2.87,
    healthRisk: 'safe'
  },
  "false,false,false,true,false": {
    mpn: 1.0,
    confidence: 5.14,
    healthRisk: 'probably_safe'
  },
  "false,false,false,false,true": {
    mpn: 1.0,
    confidence: 4.74,
    healthRisk: 'probably_safe'
  },
  "true,false,false,false,false": {
    mpn: 1.1,
    confidence: 5.16,
    healthRisk: 'probably_safe'
  },
  "false,true,false,false,false": {
    mpn: 1.2,
    confidence: 5.64,
    healthRisk: 'probably_safe'
  },
  "false,false,true,false,false": {
    mpn: 1.5,
    confidence: 7.81,
    healthRisk: 'probably_safe'
  },
  "false,false,false,true,true": {
    mpn: 2.0,
    confidence: 6.32,
    healthRisk: 'probably_safe'
  },
  "true,false,false,true,false": {
    mpn: 2.1,
    confidence: 6.85,
    healthRisk: 'probably_safe'
  },
  "true,false,false,false,true": {
    mpn: 2.1,
    confidence: 6.64,
    healthRisk: 'probably_safe'
  },
  "false,true,false,true,false": {
    mpn: 2.4,
    confidence: 7.81,
    healthRisk: 'probably_safe'
  },
  "false,true,false,false,true": {
    mpn: 2.4,
    confidence: 8.12,
    healthRisk: 'probably_safe'
  },
  "true,true,false,false,false": {
    mpn: 2.6,
    confidence: 8.51,
    healthRisk: 'probably_safe'
  },
  "true,false,false,true,true": {
    mpn: 3.2,
    confidence: 8.38,
    healthRisk: 'probably_safe'
  },
  "false,true,false,true,true": {
    mpn: 3.7,
    confidence: 9.70,
    healthRisk: 'probably_safe'
  },
  "false,false,true,false,true": {
    mpn: 3.1,
    confidence: 11.36,
    healthRisk: 'possibly_safe'
  },
  "false,false,true,true,false": {
    mpn: 3.2,
    confidence: 11.82,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,false,false": {
    mpn: 3.4,
    confidence: 12.53,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,false,true": {
    mpn: 3.9,
    confidence: 10.43,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,true,false": {
    mpn: 4.0,
    confidence: 10.94,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,false,false": {
    mpn: 4.7,
    confidence: 22.75,
    healthRisk: 'possibly_safe'
  },
  "false,false,true,true,true": {
    mpn: 5.2,
    confidence: 14.73,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,true,true": {
    mpn: 5.4,
    confidence: 12.93,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,false,true": {
    mpn: 5.6,
    confidence: 17.14,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,true,false": {
    mpn: 5.8,
    confidence: 16.87,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,true,true": {
    mpn: 8.4,
    confidence: 21.19,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,false,true": {
    mpn: 9.1,
    confidence: 37.04,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,true,false": {
    mpn: 9.6,
    confidence: 37.68,
    healthRisk: 'possibly_safe'
  },
  "true,true,true,false,false": {
    mpn: 13.6,
    confidence: 83.06,
    healthRisk: 'possibly_unsafe'
  },
  "false,true,true,true,true": {
    mpn: 17.1,
    confidence: 56.35,
    healthRisk: 'possibly_unsafe'
  },
  "true,true,true,false,true": {
    mpn: 32.6,
    confidence: 145.55,
    healthRisk: 'probably_unsafe'
  },
  "true,true,true,true,false": {
    mpn: 48.3,
    confidence: 351.91,
    healthRisk: 'probably_unsafe'
  },
  "true,true,true,true,true": {
    mpn: 100,
    confidence: 9435.10,
    healthRisk: 'unsafe'
  }
};

module.exports = AquagenxCBTPopupComponent = function () {
  var AquagenxCBTPopupComponent = function (_React$Component) {
    (0, _inherits3.default)(AquagenxCBTPopupComponent, _React$Component);

    function AquagenxCBTPopupComponent(props) {
      (0, _classCallCheck3.default)(this, AquagenxCBTPopupComponent);

      var cbt, value;

      var _this = (0, _possibleConstructorReturn3.default)(this, (AquagenxCBTPopupComponent.__proto__ || (0, _getPrototypeOf2.default)(AquagenxCBTPopupComponent)).call(this, props));

      _this.handleSaveClick = _this.handleSaveClick.bind(_this);
      value = _.clone(props.value) || {};
      if (value.cbt == null) {
        cbt = _.clone(possibleCombinations["false,false,false,false,false"]);
        cbt.c1 = cbt.c2 = cbt.c3 = cbt.c4 = cbt.c5 = false;
        value.cbt = cbt;
      }
      _this.state = {
        value: value
      };
      return _this;
    }

    (0, _createClass3.default)(AquagenxCBTPopupComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var main;
        main = this.main;
        $(main).find("#compartment1").click(function (ev) {
          return _this2.handleCompartmentClick('c1');
        });
        $(main).find("#compartment2").click(function (ev) {
          return _this2.handleCompartmentClick('c2');
        });
        $(main).find("#compartment3").click(function (ev) {
          return _this2.handleCompartmentClick('c3');
        });
        $(main).find("#compartment4").click(function (ev) {
          return _this2.handleCompartmentClick('c4');
        });
        return $(main).find("#compartment5").click(function (ev) {
          return _this2.handleCompartmentClick('c5');
        });
      }
    }, {
      key: 'handleCompartmentClick',
      value: function handleCompartmentClick(compartmentField) {
        var cbtValues, compartmentValues, computedValues, value;
        value = _.clone(this.state.value);
        value.cbt = _.clone(value.cbt);
        cbtValues = value.cbt;
        cbtValues[compartmentField] = !cbtValues[compartmentField];
        compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
        computedValues = _.clone(possibleCombinations['' + compartmentValues]);
        cbtValues.mpn = computedValues.mpn;
        cbtValues.confidence = computedValues.confidence;
        cbtValues.healthRisk = computedValues.healthRisk;
        return this.setState({
          value: value
        });
      }
    }, {
      key: 'handleSaveClick',
      value: function handleSaveClick() {
        boundMethodCheck(this, AquagenxCBTPopupComponent);
        return this.props.onSave(this.state.value);
      }
    }, {
      key: 'renderStyle',
      value: function renderStyle() {
        var cbtValues, compartmentColors, compartmentValues, hoverColors, mainId;
        mainId = '#cbtPopup' + this.props.questionId;
        cbtValues = this.state.value.cbt;
        compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
        compartmentColors = _.map(compartmentValues, function (c) {
          if (c) {
            return '#32a89b';
          } else {
            return '#ebe7c2';
          }
        });
        hoverColors = _.map(compartmentValues, function (c) {
          if (c) {
            return '#62c5bb';
          } else {
            return '#fcf8d6';
          }
        });
        return R('style', null, mainId + ' #compartment1 rect { fill: ' + compartmentColors[0] + '; } ' + mainId + ' #compartment2 rect { fill: ' + compartmentColors[1] + '; } ' + mainId + ' #compartment3 rect { fill: ' + compartmentColors[2] + '; } ' + mainId + ' #compartment4 rect { fill: ' + compartmentColors[3] + '; } ' + mainId + ' #compartment5 rect { fill: ' + compartmentColors[4] + '; } ' + mainId + ' #compartment1:hover > rect { fill: ' + hoverColors[0] + '; } ' + mainId + ' #compartment2:hover > rect{ fill: ' + hoverColors[1] + '; } ' + mainId + ' #compartment3:hover > rect{ fill: ' + hoverColors[2] + '; } ' + mainId + ' #compartment4:hover > rect { fill: ' + hoverColors[3] + '; } ' + mainId + ' #compartment5:hover > rect { fill: ' + hoverColors[4] + '; }');
      }
    }, {
      key: 'renderInfo',
      value: function renderInfo() {
        var cbtValues, mpn;
        cbtValues = this.state.value.cbt;
        mpn = cbtValues.mpn;
        if (mpn === 100) {
          mpn = '>100';
        }
        return R('div', null, R('div', null, this.context.T('MPN/100ml') + ': ', R('b', null, mpn)), R('div', null, this.context.T('Upper 95% Confidence Interval/100ml') + ': ', R('b', null, cbtValues.confidence)), R('div', null, this.context.T('Health Risk Category Based on MPN and Confidence Interval') + ': ', R('b', null, getHealthRiskString(cbtValues.healthRisk, this.context.T))));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return React.createElement(ModalPopupComponent, {
          footer: R('div', {
            id: 'footer'
          }, R('button', {
            className: 'btn btn-primary',
            id: 'save',
            onClick: this.handleSaveClick
          }, this.context.T('Save')), R('button', {
            type: "button",
            className: "btn btn-default",
            id: 'close',
            onClick: this.props.onClose
          }, this.context.T('Cancel'))),
          header: this.context.T('Click on the compartments to change color')
        }, R('div', {
          ref: function ref(c) {
            return _this3.main = c;
          },
          id: 'cbtPopup' + this.props.questionId
        }, this.renderStyle(), R('div', {
          dangerouslySetInnerHTML: {
            __html: aquagenxCBTSVGString
          }
        }), this.renderInfo()));
      }
    }]);
    return AquagenxCBTPopupComponent;
  }(React.Component);

  ;

  AquagenxCBTPopupComponent.contextTypes = {
    T: PropTypes.func.isRequired // Localizer to use
  };

  AquagenxCBTPopupComponent.propTypes = {
    value: PropTypes.object,
    questionId: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  return AquagenxCBTPopupComponent;
}.call(undefined);