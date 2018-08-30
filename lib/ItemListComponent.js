'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(ItemListComponent, _React$Component);

    function ItemListComponent() {
      _classCallCheck(this, ItemListComponent);

      var _this = _possibleConstructorReturn(this, (ItemListComponent.__proto__ || Object.getPrototypeOf(ItemListComponent)).apply(this, arguments));

      _this.renderItem = _this.renderItem.bind(_this);
      return _this;
    }

    _createClass(ItemListComponent, [{
      key: 'validate',
      value: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scrollToFirstInvalid) {
          var foundInvalid, i, item, len, ref, ref1, ref2, result;
          return regeneratorRuntime.wrap(function _callee$(_context) {
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