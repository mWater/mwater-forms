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

var EntityDisplayComponent,
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

R = React.createElement;

EntityDisplayComponent = require('../EntityDisplayComponent');

formUtils = require('../formUtils');

// Displays a site answer in a cell. No direct code entering, but stores answer as a code.
module.exports = SiteColumnAnswerComponent = function () {
  var SiteColumnAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(SiteColumnAnswerComponent, _React$Component);

    function SiteColumnAnswerComponent() {
      (0, _classCallCheck3.default)(this, SiteColumnAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (SiteColumnAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(SiteColumnAnswerComponent)).apply(this, arguments));

      _this.handleSelectClick = _this.handleSelectClick.bind(_this);
      _this.handleClearClick = _this.handleClearClick.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(SiteColumnAnswerComponent, [{
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
          return R('div', null, R('button', {
            className: "btn btn-link btn-sm pull-right",
            onClick: this.handleClearClick
          }, R('span', {
            className: "glyphicon glyphicon-remove"
          })), R(EntityDisplayComponent, {
            entityType: this.props.siteType,
            entityCode: (ref1 = this.props.value) != null ? ref1.code : void 0,
            getEntityByCode: this.context.getEntityByCode,
            renderEntityView: this.context.renderEntityListItemView,
            T: this.context.T
          }));
        } else {
          return R('button', {
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