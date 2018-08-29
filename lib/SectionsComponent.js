'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(SectionsComponent, _React$Component);

    function SectionsComponent() {
      _classCallCheck(this, SectionsComponent);

      var _this = _possibleConstructorReturn(this, (SectionsComponent.__proto__ || Object.getPrototypeOf(SectionsComponent)).call(this, props));

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

    _createClass(SectionsComponent, [{
      key: 'handleSubmit',
      value: function handleSubmit() {
        boundMethodCheck(this, SectionsComponent);
        if (!this.refs.itemListComponent.validate(true)) {
          return this.props.onSubmit();
        }
      }
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
          return this.refs.sections.scrollIntoView();
        }
      }
    }, {
      key: 'handleNextSection',
      value: function handleNextSection() {
        var nextVisibleIndex;
        boundMethodCheck(this, SectionsComponent);
        if (this.refs.itemListComponent.validate(true)) {
          return;
        }
        // Move to next that is visible
        nextVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1);
        if (nextVisibleIndex !== -1) {
          this.setState({
            sectionNum: nextVisibleIndex
          });
          // Scroll to top of section
          return this.refs.sections.scrollIntoView();
        }
      }
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
        return this.refs.nextOrSubmit.focus();
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
        var section;
        section = this.props.contents[this.state.sectionNum];
        return H.div({
          key: section._id
        }, H.h3(null, formUtils.localizeString(section.name, this.context.locale)), R(ItemListComponent, {
          ref: 'itemListComponent',
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
          ref: 'nextOrSubmit',
          className: "btn btn-primary",
          onClick: this.handleNextSection
        }, this.context.T("Next") + " ", H.span({
          className: "glyphicon glyphicon-forward"
        })) : this.props.onSubmit ? H.button({
          key: "submit",
          type: "button",
          ref: 'nextOrSubmit',
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
        return H.div({
          ref: "sections"
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