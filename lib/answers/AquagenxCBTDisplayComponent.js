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

var AquagenxCBTDisplayComponent,
    AquagenxCBTDisplaySVGString,
    H,
    ImageDisplayComponent,
    PropTypes,
    React,
    getHealthRiskString,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

AquagenxCBTDisplaySVGString = require('./AquagenxCBTDisplaySVG');

getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString;

ImageDisplayComponent = require('../ImageDisplayComponent');

module.exports = AquagenxCBTDisplayComponent = function () {
  var AquagenxCBTDisplayComponent = function (_React$Component) {
    (0, _inherits3.default)(AquagenxCBTDisplayComponent, _React$Component);

    function AquagenxCBTDisplayComponent() {
      (0, _classCallCheck3.default)(this, AquagenxCBTDisplayComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (AquagenxCBTDisplayComponent.__proto__ || (0, _getPrototypeOf2.default)(AquagenxCBTDisplayComponent)).apply(this, arguments));

      _this.handleClick = _this.handleClick.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(AquagenxCBTDisplayComponent, [{
      key: 'handleClick',
      value: function handleClick() {
        boundMethodCheck(this, AquagenxCBTDisplayComponent);
        if (this.props.onEdit) {
          return this.props.onEdit();
        }
      }
    }, {
      key: 'renderStyle',
      value: function renderStyle() {
        var cbtValues, compartmentColors, compartmentValues, mainId;
        mainId = '#cbtDisplay' + this.props.questionId;
        cbtValues = this.props.value.cbt;
        compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
        compartmentColors = _.map(compartmentValues, function (c) {
          if (c) {
            return '#32a89b';
          } else {
            return '#ebe7c2';
          }
        });
        return H.style(null, mainId + ' #compartment1 rect { fill: ' + compartmentColors[0] + '; } ' + mainId + ' #compartment2 rect { fill: ' + compartmentColors[1] + '; } ' + mainId + ' #compartment3 rect { fill: ' + compartmentColors[2] + '; } ' + mainId + ' #compartment4 rect { fill: ' + compartmentColors[3] + '; } ' + mainId + ' #compartment5 rect { fill: ' + compartmentColors[4] + '; }');
      }
    }, {
      key: 'renderInfo',
      value: function renderInfo() {
        var cbtValues, mpn;
        cbtValues = this.props.value.cbt;
        mpn = cbtValues.mpn;
        if (mpn === 100) {
          mpn = '>100';
        }
        return H.div(null, H.div(null, this.context.T('MPN/100ml') + ': ', H.b(null, mpn)), H.div(null, this.context.T('Upper 95% Confidence Interval/100ml') + ': ', H.b(null, cbtValues.confidence)), H.div(null, this.context.T('Health Risk Category Based on MPN and Confidence Interval') + ': ', H.b(null, getHealthRiskString(cbtValues.healthRisk, this.context.T))));
      }
    }, {
      key: 'renderPhoto',
      value: function renderPhoto() {
        // Displays an image
        if (this.props.value.image && this.props.imageManager) {
          return H.div(null, React.createElement(ImageDisplayComponent, {
            image: this.props.value.image,
            imageManager: this.props.imageManager,
            T: this.context.T
          }));
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var ref;
        // Can't display if not set
        if (!((ref = this.props.value) != null ? ref.cbt : void 0)) {
          return null;
        }
        return H.div({
          id: 'cbtDisplay' + this.props.questionId
        }, this.renderStyle(), H.div({
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
}.call(undefined);