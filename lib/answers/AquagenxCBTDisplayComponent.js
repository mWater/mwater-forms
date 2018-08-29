'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(AquagenxCBTDisplayComponent, _React$Component);

    function AquagenxCBTDisplayComponent() {
      _classCallCheck(this, AquagenxCBTDisplayComponent);

      var _this = _possibleConstructorReturn(this, (AquagenxCBTDisplayComponent.__proto__ || Object.getPrototypeOf(AquagenxCBTDisplayComponent)).apply(this, arguments));

      _this.handleClick = _this.handleClick.bind(_this);
      return _this;
    }

    _createClass(AquagenxCBTDisplayComponent, [{
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