"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var ItemListComponent,
    PropTypes,
    R,
    React,
    _,
    formRenderUtils,
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
formRenderUtils = require('./formRenderUtils'); // Display a list of items

module.exports = ItemListComponent = function () {
  var ItemListComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(ItemListComponent, _React$Component);

    function ItemListComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, ItemListComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ItemListComponent).call(this, props));
      _this.renderItem = _this.renderItem.bind((0, _assertThisInitialized2["default"])(_this)); // Refs of all items

      _this.itemRefs = {};
      return _this;
    }

    (0, _createClass2["default"])(ItemListComponent, [{
      key: "validate",
      value: function validate(scrollToFirstInvalid) {
        var foundInvalid, i, item, len, ref, ref1, ref2, result;
        return _regenerator["default"].async(function validate$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                foundInvalid = false;
                ref = this.props.contents;
                i = 0, len = ref.length;

              case 3:
                if (!(i < len)) {
                  _context.next = 13;
                  break;
                }

                item = ref[i]; // Only if validation is possible

                if (!((ref1 = this.itemRefs[item._id]) != null ? ref1.validate : void 0)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 8;
                return _regenerator["default"].awrap((ref2 = this.itemRefs[item._id]) != null ? ref2.validate(scrollToFirstInvalid && !foundInvalid) : void 0);

              case 8:
                result = _context.sent;

                // DO NOT BREAK, it's important to call validate on each item
                if (result) {
                  foundInvalid = true;
                }

              case 10:
                i++;
                _context.next = 3;
                break;

              case 13:
                return _context.abrupt("return", foundInvalid);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, null, this);
      }
    }, {
      key: "handleNext",
      value: function handleNext(index) {
        var base, ref;
        index++;

        if (index >= this.props.contents.length) {
          return typeof (base = this.props).onNext === "function" ? base.onNext() : void 0;
        } else {
          return (ref = this.itemRefs[this.props.contents[index]._id]) != null ? typeof ref.focus === "function" ? ref.focus() : void 0 : void 0;
        }
      }
    }, {
      key: "renderItem",
      value: function renderItem(item, index) {
        var _this2 = this;

        boundMethodCheck(this, ItemListComponent);

        if (this.props.isVisible(item._id) && !item.disabled) {
          return formRenderUtils.renderItem(item, this.props.data, this.props.responseRow, this.props.schema, this.props.onDataChange, this.props.isVisible, this.handleNext.bind(this, index), function (c) {
            return _this2.itemRefs[item._id] = c;
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        return R('div', null, _.map(this.props.contents, this.renderItem));
      }
    }]);
    return ItemListComponent;
  }(React.Component);

  ;
  ItemListComponent.propTypes = {
    contents: PropTypes.array.isRequired,
    data: PropTypes.object,
    // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object.isRequired,
    // ResponseRow object (for roster entry if in roster)
    onDataChange: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    isVisible: PropTypes.func.isRequired,
    // (id) tells if an item is visible or not
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  return ItemListComponent;
}.call(void 0);