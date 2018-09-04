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
    SectionsComponent,
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

ItemListComponent = require('./ItemListComponent');

formUtils = require('./formUtils');

TextExprsComponent = require('./TextExprsComponent');

module.exports = SectionsComponent = function () {
  var SectionsComponent = function (_React$Component) {
    (0, _inherits3.default)(SectionsComponent, _React$Component);

    function SectionsComponent(props) {
      (0, _classCallCheck3.default)(this, SectionsComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (SectionsComponent.__proto__ || (0, _getPrototypeOf2.default)(SectionsComponent)).call(this, props));

      _this.handleSubmit = _this.handleSubmit.bind(_this);
      _this.handleBackSection = _this.handleBackSection.bind(_this);
      // This should never happen... simply ignore
      _this.handleNextSection = _this.handleNextSection.bind(_this);

      // This should never happen... simply ignore
      _this.handleBreadcrumbClick = _this.handleBreadcrumbClick.bind(_this);
      _this.handleItemListNext = _this.handleItemListNext.bind(_this);
      _this.state = {
        sectionNum: 0
      };
      return _this;
    }

    (0, _createClass3.default)(SectionsComponent, [{
      key: 'handleSubmit',
      value: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          var result;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  boundMethodCheck(this, SectionsComponent);
                  _context.next = 3;
                  return this.itemListComponent.validate(true);

                case 3:
                  result = _context.sent;

                  if (result) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt('return', this.props.onSubmit());

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function handleSubmit() {
          return _ref.apply(this, arguments);
        }

        return handleSubmit;
      }()
    }, {
      key: 'hasPreviousSection',
      value: function hasPreviousSection() {
        // Returns true if a visible index exist with a higher value
        return this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1) !== -1;
      }
    }, {
      key: 'hasNextSection',
      value: function hasNextSection() {
        // Returns true if a visible index exist with a higher value
        return this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1) !== -1;
      }
    }, {
      key: 'nextVisibleSectionIndex',
      value: function nextVisibleSectionIndex(index, increment) {
        var isVisible, section;
        if (index < 0) {
          return -1;
        }
        if (index >= this.props.contents.length) {
          return -1;
        }
        section = this.props.contents[index];
        isVisible = this.props.isVisible(section._id);
        if (isVisible) {
          return index;
        } else {
          return this.nextVisibleSectionIndex(index + increment, increment);
        }
      }
    }, {
      key: 'handleBackSection',
      value: function handleBackSection() {
        var previousVisibleIndex;
        boundMethodCheck(this, SectionsComponent);
        // Move to previous that is visible
        previousVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1);
        if (previousVisibleIndex !== -1) {
          this.setState({
            sectionNum: previousVisibleIndex
          });
          // Scroll to top of section
          return this.sections.scrollIntoView();
        }
      }
    }, {
      key: 'handleNextSection',
      value: function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
          var nextVisibleIndex, result;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  boundMethodCheck(this, SectionsComponent);
                  _context2.next = 3;
                  return this.itemListComponent.validate(true);

                case 3:
                  result = _context2.sent;

                  if (!result) {
                    _context2.next = 6;
                    break;
                  }

                  return _context2.abrupt('return');

                case 6:
                  // Move to next that is visible
                  nextVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1);

                  if (!(nextVisibleIndex !== -1)) {
                    _context2.next = 10;
                    break;
                  }

                  this.setState({
                    sectionNum: nextVisibleIndex
                  });
                  // Scroll to top of section
                  return _context2.abrupt('return', this.sections.scrollIntoView());

                case 10:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function handleNextSection() {
          return _ref2.apply(this, arguments);
        }

        return handleNextSection;
      }()
    }, {
      key: 'handleBreadcrumbClick',
      value: function handleBreadcrumbClick(index) {
        boundMethodCheck(this, SectionsComponent);
        return this.setState({
          sectionNum: index
        });
      }
    }, {
      key: 'handleItemListNext',
      value: function handleItemListNext() {
        boundMethodCheck(this, SectionsComponent);
        return this.nextOrSubmit.focus();
      }
    }, {
      key: 'renderBreadcrumbs',
      value: function renderBreadcrumbs() {
        var breadcrumbs, currentSectionName, index, section, visible;
        breadcrumbs = [];
        index = 0;
        while (index < this.state.sectionNum) {
          section = this.props.contents[index];
          visible = this.props.isVisible(section._id);
          breadcrumbs.push(H.li({
            key: index
          }, H.b(null, visible ? H.a({
            className: "section-crumb",
            disabled: !visible,
            onClick: this.handleBreadcrumbClick.bind(this, index)
          }, index + 1 + '.') : index + 1 + '.')));
          index++;
        }
        currentSectionName = formUtils.localizeString(this.props.contents[this.state.sectionNum].name, this.context.locale);
        breadcrumbs.push(H.li({
          key: this.state.sectionNum
        }, H.b(null, this.state.sectionNum + 1 + '. ' + currentSectionName)));
        return H.ul({
          className: "breadcrumb"
        }, breadcrumbs);
      }
    }, {
      key: 'renderSection',
      value: function renderSection() {
        var _this2 = this;

        var section;
        section = this.props.contents[this.state.sectionNum];
        return H.div({
          key: section._id
        }, H.h3(null, formUtils.localizeString(section.name, this.context.locale)), R(ItemListComponent, {
          ref: function ref(c) {
            return _this2.itemListComponent = c;
          },
          contents: section.contents,
          data: this.props.data,
          onDataChange: this.props.onDataChange,
          isVisible: this.props.isVisible,
          responseRow: this.props.responseRow,
          onNext: this.handleItemListNext,
          schema: this.props.schema
        }));
      }
    }, {
      key: 'renderButtons',
      value: function renderButtons() {
        var _this3 = this;

        return H.div({
          className: "form-controls"
          // If can go back
        }, this.hasPreviousSection() ? [H.button({
          key: "back",
          type: "button",
          className: "btn btn-default",
          onClick: this.handleBackSection
        }, H.span({
          className: "glyphicon glyphicon-backward"
        }), " " + this.context.T("Back")), '\xA0'
        // Can go forward or submit
        ] : void 0, this.hasNextSection() ? H.button({
          key: "next",
          type: "button",
          ref: function ref(c) {
            return _this3.nextOrSubmit = c;
          },
          className: "btn btn-primary",
          onClick: this.handleNextSection
        }, this.context.T("Next") + " ", H.span({
          className: "glyphicon glyphicon-forward"
        })) : this.props.onSubmit ? H.button({
          key: "submit",
          type: "button",
          ref: function ref(c) {
            return _this3.nextOrSubmit = c;
          },
          className: "btn btn-primary",
          onClick: this.handleSubmit
        }, this.context.T("Submit")) : void 0, '\xA0', this.props.onSaveLater ? [H.button({
          key: "saveLater",
          type: "button",
          className: "btn btn-default",
          onClick: this.props.onSaveLater
        }, this.context.T("Save for Later")), '\xA0'] : void 0, this.props.onDiscard ? H.button({
          key: "discard",
          type: "button",
          className: "btn btn-default",
          onClick: this.props.onDiscard
        }, H.span({
          className: "glyphicon glyphicon-trash"
        }), " " + this.context.T("Discard")) : void 0);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        return H.div({
          ref: function ref(c) {
            return _this4.sections = c;
          }
        }, this.renderBreadcrumbs(), H.div({
          className: "sections"
        }, this.renderSection()), this.renderButtons());
      }
    }]);
    return SectionsComponent;
  }(React.Component);

  ;

  SectionsComponent.contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired // Localizer to use
  };

  SectionsComponent.propTypes = {
    contents: PropTypes.array.isRequired,
    data: PropTypes.object, // Current data of response. 
    onDataChange: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired, // Schema to use, including form
    responseRow: PropTypes.object.isRequired, // ResponseRow object (for roster entry if in roster)
    isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
    onSubmit: PropTypes.func, // Called when submit is pressed
    onSaveLater: PropTypes.func, // Optional save for later
    onDiscard: PropTypes.func // Called when discard is pressed
  };

  return SectionsComponent;
}.call(undefined);