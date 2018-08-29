'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    PropTypes,
    R,
    React,
    RosterGroupComponent,
    TextExprsComponent,
    _,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

TextExprsComponent = require('./TextExprsComponent');

// TODO Add focus()

// Rosters are repeated information, such as asking questions about household members N times.
// A roster group is a group of questions that is asked once for each roster entry
module.exports = RosterGroupComponent = function () {
  var RosterGroupComponent = function (_React$Component) {
    _inherits(RosterGroupComponent, _React$Component);

    function RosterGroupComponent() {
      _classCallCheck(this, RosterGroupComponent);

      // Propagate an answer change to the onDataChange
      var _this = _possibleConstructorReturn(this, (RosterGroupComponent.__proto__ || Object.getPrototypeOf(RosterGroupComponent)).apply(this, arguments));

      _this.handleAnswerChange = _this.handleAnswerChange.bind(_this);
      // Handles a change in data of a specific entry of the roster
      _this.handleEntryDataChange = _this.handleEntryDataChange.bind(_this);
      _this.handleAdd = _this.handleAdd.bind(_this);
      _this.handleRemove = _this.handleRemove.bind(_this);
      _this.isChildVisible = _this.isChildVisible.bind(_this);
      return _this;
    }

    // Gets the id that the answer is stored under


    _createClass(RosterGroupComponent, [{
      key: 'getAnswerId',
      value: function getAnswerId() {
        // Prefer rosterId if specified, otherwise use id.
        return this.props.rosterGroup.rosterId || this.props.rosterGroup._id;
      }

      // Get the current answer value

    }, {
      key: 'getAnswer',
      value: function getAnswer() {
        return this.props.data[this.getAnswerId()] || [];
      }
    }, {
      key: 'handleAnswerChange',
      value: function handleAnswerChange(answer) {
        var change;
        boundMethodCheck(this, RosterGroupComponent);
        change = {};
        change[this.getAnswerId()] = answer;
        return this.props.onDataChange(_.extend({}, this.props.data, change));
      }
    }, {
      key: 'handleEntryDataChange',
      value: function handleEntryDataChange(index, data) {
        var answer;
        boundMethodCheck(this, RosterGroupComponent);
        answer = this.getAnswer().slice();
        answer[index] = _.extend({}, answer[index], {
          data: data
        });
        return this.handleAnswerChange(answer);
      }
    }, {
      key: 'handleAdd',
      value: function handleAdd() {
        var answer;
        boundMethodCheck(this, RosterGroupComponent);
        answer = this.getAnswer().slice();
        answer.push({
          _id: formUtils.createUid(),
          data: {}
        });
        return this.handleAnswerChange(answer);
      }
    }, {
      key: 'handleRemove',
      value: function handleRemove(index) {
        var answer;
        boundMethodCheck(this, RosterGroupComponent);
        answer = this.getAnswer().slice();
        answer.splice(index, 1);
        return this.handleAnswerChange(answer);
      }
    }, {
      key: 'validate',
      value: function validate(scrollToFirstInvalid) {
        var entry, foundInvalid, i, index, len, ref;
        // For each entry
        foundInvalid = false;
        ref = this.getAnswer();
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          entry = ref[index];
          foundInvalid = foundInvalid || this.refs['itemlist_' + index].validate(scrollToFirstInvalid);
        }
        return foundInvalid;
      }
    }, {
      key: 'isChildVisible',
      value: function isChildVisible(index, id) {
        boundMethodCheck(this, RosterGroupComponent);
        return this.props.isVisible(this.getAnswerId() + '.' + index + '.' + id);
      }
    }, {
      key: 'renderName',
      value: function renderName() {
        return H.h4({
          key: "prompt"
        }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
      }
    }, {
      key: 'renderEntryTitle',
      value: function renderEntryTitle(entry, index) {
        return R(TextExprsComponent, {
          localizedStr: this.props.rosterGroup.entryTitle,
          exprs: this.props.rosterGroup.entryTitleExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
          locale: this.context.locale
        });
      }
    }, {
      key: 'renderEntry',
      value: function renderEntry(entry, index) {
        var ItemListComponent;
        // To avoid circularity
        ItemListComponent = require('./ItemListComponent');
        return H.div({
          key: index,
          className: "panel panel-default"
        }, H.div({
          key: "header",
          className: "panel-heading",
          style: {
            fontWeight: "bold"
          }
        }, index + 1 + '. ', this.renderEntryTitle(entry, index)), H.div({
          key: "body",
          className: "panel-body"
        }, this.props.rosterGroup.allowRemove ? H.button({
          type: "button",
          style: {
            float: "right"
          },
          className: "btn btn-sm btn-link",
          onClick: this.handleRemove.bind(null, index)
        }, H.span({
          className: "glyphicon glyphicon-remove"
        })) : void 0, R(ItemListComponent, {
          ref: 'itemlist_' + index,
          contents: this.props.rosterGroup.contents,
          data: this.getAnswer()[index].data,
          responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
          onDataChange: this.handleEntryDataChange.bind(null, index),
          isVisible: this.isChildVisible.bind(null, index),
          schema: this.props.schema
        })));
      }
    }, {
      key: 'renderAdd',
      value: function renderAdd() {
        if (this.props.rosterGroup.allowAdd) {
          return H.div({
            key: "add"
          }, H.button({
            type: "button",
            className: "btn btn-default btn-sm",
            onClick: this.handleAdd
          }, H.span({
            className: "glyphicon glyphicon-plus"
          }), " " + this.context.T("Add")));
        }
      }
    }, {
      key: 'renderEmptyPrompt',
      value: function renderEmptyPrompt() {
        return H.div({
          style: {
            fontStyle: "italic"
          }
        }, formUtils.localizeString(this.props.rosterGroup.emptyPrompt, this.context.locale) || this.context.T("Click +Add to add an item"));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return H.div({
          style: {
            padding: 5,
            marginBottom: 20
          }
        }, this.renderName(), _.map(this.getAnswer(), function (entry, index) {
          return _this2.renderEntry(entry, index);
          // Display message if none and can add
        }), this.getAnswer().length === 0 && this.props.rosterGroup.allowAdd ? this.renderEmptyPrompt() : void 0, this.renderAdd());
      }
    }]);

    return RosterGroupComponent;
  }(React.Component);

  ;

  RosterGroupComponent.contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired // Localizer to use
  };

  RosterGroupComponent.propTypes = {
    rosterGroup: PropTypes.object.isRequired, // Design of roster group. See schema
    data: PropTypes.object, // Current data of response. 
    onDataChange: PropTypes.func.isRequired, // Called when data changes
    isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return RosterGroupComponent;
}.call(undefined);