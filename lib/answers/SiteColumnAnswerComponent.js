'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityDisplayComponent,
    H,
    PropTypes,
    R,
    React,
    SiteColumnAnswerComponent,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

EntityDisplayComponent = require('../EntityDisplayComponent');

formUtils = require('../formUtils');

// Displays a site answer in a cell. No direct code entering, but stores answer as a code.
module.exports = SiteColumnAnswerComponent = function () {
  var SiteColumnAnswerComponent = function (_React$Component) {
    _inherits(SiteColumnAnswerComponent, _React$Component);

    function SiteColumnAnswerComponent() {
      _classCallCheck(this, SiteColumnAnswerComponent);

      var _this = _possibleConstructorReturn(this, (SiteColumnAnswerComponent.__proto__ || Object.getPrototypeOf(SiteColumnAnswerComponent)).apply(this, arguments));

      _this.handleSelectClick = _this.handleSelectClick.bind(_this);
      _this.handleClearClick = _this.handleClearClick.bind(_this);
      return _this;
    }

    _createClass(SiteColumnAnswerComponent, [{
      key: 'handleSelectClick',
      value: function handleSelectClick() {
        var _this2 = this;

        boundMethodCheck(this, SiteColumnAnswerComponent);
        return this.context.selectEntity({
          entityType: this.props.siteType,
          callback: function callback(entityId) {
            // Get entity
            return _this2.context.getEntityById(_this2.props.siteType, entityId, function (entity) {
              return _this2.props.onValueChange({
                code: entity.code
              });
            });
          }
        });
      }
    }, {
      key: 'handleClearClick',
      value: function handleClearClick() {
        boundMethodCheck(this, SiteColumnAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: 'render',
      value: function render() {
        var ref, ref1;
        if ((ref = this.props.value) != null ? ref.code : void 0) {
          return H.div(null, H.button({
            className: "btn btn-link btn-sm pull-right",
            onClick: this.handleClearClick
          }, H.span({
            className: "glyphicon glyphicon-remove"
          })), R(EntityDisplayComponent, {
            entityType: this.props.siteType,
            entityCode: (ref1 = this.props.value) != null ? ref1.code : void 0,
            getEntityByCode: this.context.getEntityByCode,
            renderEntityView: this.context.renderEntityListItemView,
            T: this.context.T
          }));
        } else {
          return H.button({
            className: "btn btn-link",
            onClick: this.handleSelectClick
          }, this.context.T("Select..."));
        }
      }
    }]);

    return SiteColumnAnswerComponent;
  }(React.Component);

  ;

  SiteColumnAnswerComponent.contextTypes = {
    selectEntity: PropTypes.func,
    getEntityById: PropTypes.func.isRequired,
    getEntityByCode: PropTypes.func.isRequired,
    renderEntityListItemView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use
  };

  SiteColumnAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    siteType: PropTypes.string.isRequired
  };

  return SiteColumnAnswerComponent;
}.call(undefined);