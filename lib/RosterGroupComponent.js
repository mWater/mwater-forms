"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PropTypes,
    R,
    React,
    RosterGroupComponent,
    TextExprsComponent,
    _,
    cx,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
formUtils = require('./formUtils');
TextExprsComponent = require('./TextExprsComponent');
cx = require('classnames'); // TODO Add focus()
// Rosters are repeated information, such as asking questions about household members N times.
// A roster group is a group of questions that is asked once for each roster entry

module.exports = RosterGroupComponent = function () {
  var RosterGroupComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(RosterGroupComponent, _React$Component);

    var _super = _createSuper(RosterGroupComponent);

    function RosterGroupComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, RosterGroupComponent);
      _this = _super.call(this, props); // Propagate an answer change to the onDataChange

      _this.handleAnswerChange = _this.handleAnswerChange.bind((0, _assertThisInitialized2["default"])(_this)); // Handles a change in data of a specific entry of the roster

      _this.handleEntryDataChange = _this.handleEntryDataChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleAdd = _this.handleAdd.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleRemove = _this.handleRemove.bind((0, _assertThisInitialized2["default"])(_this));
      _this.isChildVisible = _this.isChildVisible.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleToggle = _this.handleToggle.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        collapsedEntries: [] // the indices that are collapsed

      };
      return _this;
    } // Gets the id that the answer is stored under


    (0, _createClass2["default"])(RosterGroupComponent, [{
      key: "getAnswerId",
      value: function getAnswerId() {
        // Prefer rosterId if specified, otherwise use id.
        return this.props.rosterGroup.rosterId || this.props.rosterGroup._id;
      } // Get the current answer value

    }, {
      key: "getAnswer",
      value: function getAnswer() {
        return this.props.data[this.getAnswerId()] || [];
      }
    }, {
      key: "handleAnswerChange",
      value: function handleAnswerChange(answer) {
        var change;
        boundMethodCheck(this, RosterGroupComponent);
        change = {};
        change[this.getAnswerId()] = answer;
        return this.props.onDataChange(_.extend({}, this.props.data, change));
      }
    }, {
      key: "handleEntryDataChange",
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
      key: "handleAdd",
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
      key: "handleRemove",
      value: function handleRemove(index) {
        var answer;
        boundMethodCheck(this, RosterGroupComponent);
        answer = this.getAnswer().slice();
        answer.splice(index, 1);
        return this.handleAnswerChange(answer);
      }
    }, {
      key: "validate",
      value: function () {
        var _validate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(scrollToFirstInvalid) {
          var entry, foundInvalid, i, index, len, ref, result;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // For each entry
                  foundInvalid = false;
                  ref = this.getAnswer();
                  index = i = 0, len = ref.length;

                case 3:
                  if (!(i < len)) {
                    _context.next = 12;
                    break;
                  }

                  entry = ref[index];
                  _context.next = 7;
                  return this["itemlist_".concat(index)].validate(scrollToFirstInvalid && !foundInvalid);

                case 7:
                  result = _context.sent;

                  if (result) {
                    foundInvalid = true;
                  }

                case 9:
                  index = ++i;
                  _context.next = 3;
                  break;

                case 12:
                  return _context.abrupt("return", foundInvalid);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function validate(_x) {
          return _validate.apply(this, arguments);
        }

        return validate;
      }()
    }, {
      key: "isChildVisible",
      value: function isChildVisible(index, id) {
        boundMethodCheck(this, RosterGroupComponent);
        return this.props.isVisible("".concat(this.getAnswerId(), ".").concat(index, ".").concat(id));
      }
    }, {
      key: "handleToggle",
      value: function handleToggle(index) {
        boundMethodCheck(this, RosterGroupComponent);
        return this.setState({
          collapsedEntries: _.xor(this.state.collapsedEntries, [index])
        });
      }
    }, {
      key: "renderName",
      value: function renderName() {
        return R('h4', {
          key: "prompt"
        }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
      }
    }, {
      key: "renderEntryTitle",
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
      key: "renderEntry",
      value: function renderEntry(entry, index) {
        var _this2 = this;

        var ItemListComponent, bodyStyle, isCollapsed; // To avoid circularity

        ItemListComponent = require('./ItemListComponent');
        isCollapsed = this.state.collapsedEntries.includes(index);
        bodyStyle = {
          height: isCollapsed ? 0 : 'auto',
          transition: 'height 0.25s ease-in',
          padding: isCollapsed ? 0 : 15,
          overflow: 'hidden'
        };
        return R('div', {
          key: index,
          className: "panel panel-default"
        }, R('div', {
          key: "header",
          className: "panel-heading",
          style: {
            fontWeight: "bold",
            position: "relative"
          }
        }, "".concat(index + 1, ". "), this.renderEntryTitle(entry, index), R('button', {
          className: 'btn btn-link',
          style: {
            position: 'absolute',
            right: 0,
            top: 5
          },
          onClick: this.handleToggle.bind(null, index)
        }, R('span', {
          className: cx('glyphicon', {
            'glyphicon-chevron-up': !isCollapsed,
            'glyphicon-chevron-down': isCollapsed
          })
        }))), R('div', {
          key: "body",
          className: "panel-body",
          style: bodyStyle
        }, this.props.rosterGroup.allowRemove ? R('button', {
          type: "button",
          style: {
            "float": "right"
          },
          className: "btn btn-sm btn-link",
          onClick: this.handleRemove.bind(null, index)
        }, R('span', {
          className: "glyphicon glyphicon-remove"
        })) : void 0, R(ItemListComponent, {
          ref: function ref(c) {
            return _this2["itemlist_".concat(index)] = c;
          },
          contents: this.props.rosterGroup.contents,
          data: this.getAnswer()[index].data,
          responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
          onDataChange: this.handleEntryDataChange.bind(null, index),
          isVisible: this.isChildVisible.bind(null, index),
          schema: this.props.schema
        })));
      }
    }, {
      key: "renderAdd",
      value: function renderAdd() {
        if (this.props.rosterGroup.allowAdd) {
          return R('div', {
            key: "add"
          }, R('button', {
            type: "button",
            className: "btn btn-default btn-sm",
            onClick: this.handleAdd
          }, R('span', {
            className: "glyphicon glyphicon-plus"
          }), " " + this.context.T("Add")));
        }
      }
    }, {
      key: "renderEmptyPrompt",
      value: function renderEmptyPrompt() {
        return R('div', {
          style: {
            fontStyle: "italic"
          }
        }, formUtils.localizeString(this.props.rosterGroup.emptyPrompt, this.context.locale) || this.context.T("Click +Add to add an item"));
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        return R('div', {
          style: {
            padding: 5,
            marginBottom: 20
          }
        }, this.renderName(), _.map(this.getAnswer(), function (entry, index) {
          return _this3.renderEntry(entry, index); // Display message if none and can add
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
    rosterGroup: PropTypes.object.isRequired,
    // Design of roster group. See schema
    data: PropTypes.object,
    // Current data of response. 
    onDataChange: PropTypes.func.isRequired,
    // Called when data changes
    isVisible: PropTypes.func.isRequired,
    // (id) tells if an item is visible or not
    responseRow: PropTypes.object,
    // ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  return RosterGroupComponent;
}.call(void 0);