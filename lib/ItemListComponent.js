'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var H,
    ItemListComponent,
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

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

formRenderUtils = require('./formRenderUtils');

// Display a list of items
module.exports = ItemListComponent = function () {
  var ItemListComponent = function (_React$Component) {
    (0, _inherits3.default)(ItemListComponent, _React$Component);

    function ItemListComponent() {
      (0, _classCallCheck3.default)(this, ItemListComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (ItemListComponent.__proto__ || (0, _getPrototypeOf2.default)(ItemListComponent)).apply(this, arguments));

      _this.renderItem = _this.renderItem.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(ItemListComponent, [{
      key: 'validate',
      value: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(scrollToFirstInvalid) {
          var foundInvalid, i, item, len, ref, ref1, ref2, result;
          return _regenerator2.default.wrap(function _callee$(_context) {
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

                  item = ref[i];
                  // Only if validation is possible

                  if (!((ref1 = this.refs[item._id]) != null ? ref1.validate : void 0)) {
                    _context.next = 10;
                    break;
                  }

                  _context.next = 8;
                  return (ref2 = this.refs[item._id]) != null ? ref2.validate(scrollToFirstInvalid && !foundInvalid) : void 0;

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
                  return _context.abrupt('return', foundInvalid);

                case 14:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function validate(_x) {
          return _ref.apply(this, arguments);
        }

        return validate;
      }()
    }, {
      key: 'handleNext',
      value: function handleNext(index) {
        var base, ref;
        index++;
        if (index >= this.props.contents.length) {
          return typeof (base = this.props).onNext === "function" ? base.onNext() : void 0;
        } else {
          return (ref = this.refs[this.props.contents[index]._id]) != null ? typeof ref.focus === "function" ? ref.focus() : void 0 : void 0;
        }
      }
    }, {
      key: 'renderItem',
      value: function renderItem(item, index) {
        boundMethodCheck(this, ItemListComponent);
        if (this.props.isVisible(item._id) && !item.disabled) {
          return formRenderUtils.renderItem(item, this.props.data, this.props.responseRow, this.props.schema, this.props.onDataChange, this.props.isVisible, this.handleNext.bind(this, index));
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return H.div(null, _.map(this.props.contents, this.renderItem));
      }
    }]);
    return ItemListComponent;
  }(React.Component);

  ;

  ItemListComponent.propTypes = {
    contents: PropTypes.array.isRequired,
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object.isRequired, // ResponseRow object (for roster entry if in roster)
    onDataChange: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return ItemListComponent;
}.call(undefined);