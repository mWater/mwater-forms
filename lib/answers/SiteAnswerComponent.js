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
    SiteAnswerComponent,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

formUtils = require('../formUtils');

EntityDisplayComponent = require('../EntityDisplayComponent');

module.exports = SiteAnswerComponent = function () {
  var SiteAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(SiteAnswerComponent, _React$Component);

    function SiteAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, SiteAnswerComponent);

      var ref;

      var _this = (0, _possibleConstructorReturn3.default)(this, (SiteAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(SiteAnswerComponent)).call(this, props));

      _this.handleKeyDown = _this.handleKeyDown.bind(_this);
      _this.handleSelectClick = _this.handleSelectClick.bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleBlur = _this.handleBlur.bind(_this);
      _this.state = {
        text: ((ref = props.value) != null ? ref.code : void 0) || ""
      };
      return _this;
    }

    (0, _createClass3.default)(SiteAnswerComponent, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var ref, ref1, ref2, ref3;
        // If different, override text
        if (((ref = nextProps.value) != null ? ref.code : void 0) !== ((ref1 = this.props.value) != null ? ref1.code : void 0)) {
          return this.setState({
            text: ((ref2 = nextProps.value) != null ? ref2.code : void 0) ? (ref3 = nextProps.value) != null ? ref3.code : void 0 : ""
          });
        }
      }
    }, {
      key: 'focus',
      value: function focus() {
        return this.input.focus();
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(ev) {
        boundMethodCheck(this, SiteAnswerComponent);
        if (this.props.onNextOrComments != null) {
          // When pressing ENTER or TAB
          if (ev.keyCode === 13 || ev.keyCode === 9) {
            this.props.onNextOrComments(ev);
            // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
            return ev.preventDefault();
          }
        }
      }
    }, {
      key: 'getEntityType',
      value: function getEntityType() {
        var entityType, siteType;
        // Convert to new entity type
        siteType = (this.props.siteTypes ? this.props.siteTypes[0] : void 0) || "Water point";
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
        return entityType;
      }
    }, {
      key: 'handleSelectClick',
      value: function handleSelectClick() {
        var _this2 = this;

        var entityType;
        boundMethodCheck(this, SiteAnswerComponent);
        entityType = this.getEntityType();
        return this.context.selectEntity({
          entityType: entityType,
          callback: function callback(entityId) {
            // Get entity
            return _this2.context.getEntityById(entityType, entityId, function (entity) {
              if (!entity) {
                throw new Error('Unable to lookup entity ' + entityType + ':' + entityId);
              }
              if (!entity.code) {
                alert(_this2.props.T("Unable to select that site as it does not have an mWater ID. Please synchronize first with the server."));
                return;
              }
              return _this2.props.onValueChange({
                code: entity.code
              });
            });
          }
        });
      }
    }, {
      key: 'handleChange',
      value: function handleChange(ev) {
        boundMethodCheck(this, SiteAnswerComponent);
        return this.setState({
          text: ev.target.value
        });
      }
    }, {
      key: 'handleBlur',
      value: function handleBlur(ev) {
        boundMethodCheck(this, SiteAnswerComponent);
        if (ev.target.value) {
          return this.props.onValueChange({
            code: ev.target.value
          });
        } else {
          return this.props.onValueChange(null);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var ref;
        return R('div', null, R('div', {
          className: "input-group"
        }, R('input', {
          type: "tel",
          className: "form-control",
          onKeyDown: this.handleKeyDown,
          ref: function ref(c) {
            return _this3.input = c;
          },
          placeholder: this.context.T("mWater ID of Site"),
          style: {
            zIndex: "inherit" // Workaround for strange bootstrap z-index
          },
          value: this.state.text,
          onBlur: this.handleBlur,
          onChange: this.handleChange
        }), R('span', {
          className: "input-group-btn"
        }, R('button', {
          className: "btn btn-default",
          disabled: this.context.selectEntity == null,
          type: "button",
          onClick: this.handleSelectClick,
          style: {
            zIndex: "inherit"
          }
        }, this.context.T("Select")))), R('br'), R(EntityDisplayComponent, {
          displayInWell: true,
          entityType: this.getEntityType(),
          entityCode: (ref = this.props.value) != null ? ref.code : void 0,
          getEntityByCode: this.context.getEntityByCode,
          renderEntityView: this.context.renderEntitySummaryView,
          T: this.context.T
        }));
      }
    }]);
    return SiteAnswerComponent;
  }(React.Component);

  ;

  SiteAnswerComponent.contextTypes = {
    selectEntity: PropTypes.func,
    getEntityById: PropTypes.func.isRequired,
    getEntityByCode: PropTypes.func.isRequired,
    renderEntitySummaryView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use
  };

  SiteAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    siteTypes: PropTypes.array
  };

  return SiteAnswerComponent;
}.call(undefined);