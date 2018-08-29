'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GroupComponent, H, PropTypes, R, React, _, formUtils;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

// A group is a list of questions/other items that can have a common condition and a header
module.exports = GroupComponent = function () {
  var GroupComponent = function (_React$Component) {
    _inherits(GroupComponent, _React$Component);

    function GroupComponent() {
      _classCallCheck(this, GroupComponent);

      return _possibleConstructorReturn(this, (GroupComponent.__proto__ || Object.getPrototypeOf(GroupComponent)).apply(this, arguments));
    }

    _createClass(GroupComponent, [{
      key: 'validate',
      value: function validate(scrollToFirstInvalid) {
        return this.refs.itemlist.validate(scrollToFirstInvalid);
      }
    }, {
      key: 'render',
      value: function render() {
        var ItemListComponent;
        // To avoid circularity
        ItemListComponent = require('./ItemListComponent');
        return H.div({
          className: "panel panel-default"
        }, H.div({
          key: "header",
          className: "panel-heading"
        }, formUtils.localizeString(this.props.group.name, this.context.locale)), H.div({
          key: "body",
          className: "panel-body"
        }, R(ItemListComponent, {
          ref: "itemlist",
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
    group: PropTypes.object.isRequired, // Design of group. See schema
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    onDataChange: PropTypes.func.isRequired, // Called when data changes
    isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
    onNext: PropTypes.func.isRequired, // Called when moving out of the GroupComponent questions
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return GroupComponent;
}.call(undefined);