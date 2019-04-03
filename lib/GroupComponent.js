"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var GroupComponent, PropTypes, R, React, _, formUtils;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
formUtils = require('./formUtils'); // A group is a list of questions/other items that can have a common condition and a header

module.exports = GroupComponent = function () {
  var GroupComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(GroupComponent, _React$Component);

    function GroupComponent() {
      (0, _classCallCheck2["default"])(this, GroupComponent);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GroupComponent).apply(this, arguments));
    }

    (0, _createClass2["default"])(GroupComponent, [{
      key: "validate",
      value: function validate(scrollToFirstInvalid) {
        return this.itemlist.validate(scrollToFirstInvalid);
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        var ItemListComponent; // To avoid circularity

        ItemListComponent = require('./ItemListComponent');
        return R('div', {
          className: "panel panel-default"
        }, R('div', {
          key: "header",
          className: "panel-heading"
        }, formUtils.localizeString(this.props.group.name, this.context.locale)), R('div', {
          key: "body",
          className: "panel-body"
        }, R(ItemListComponent, {
          ref: function ref(c) {
            return _this.itemlist = c;
          },
          contents: this.props.group.contents,
          data: this.props.data,
          responseRow: this.props.responseRow,
          onDataChange: this.props.onDataChange,
          isVisible: this.props.isVisible,
          onNext: this.props.onNext,
          schema: this.props.schema
        })));
      }
    }]);
    return GroupComponent;
  }(React.Component);

  ;
  GroupComponent.contextTypes = {
    locale: PropTypes.string
  };
  GroupComponent.propTypes = {
    group: PropTypes.object.isRequired,
    // Design of group. See schema
    data: PropTypes.object,
    // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object,
    // ResponseRow object (for roster entry if in roster)
    onDataChange: PropTypes.func.isRequired,
    // Called when data changes
    isVisible: PropTypes.func.isRequired,
    // (id) tells if an item is visible or not
    onNext: PropTypes.func.isRequired,
    // Called when moving out of the GroupComponent questions
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  return GroupComponent;
}.call(void 0);