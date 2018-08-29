'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultValueApplier,
    FormComponent,
    H,
    ItemListComponent,
    PropTypes,
    R,
    RandomAskedCalculator,
    React,
    ResponseCleaner,
    ResponseRow,
    SectionsComponent,
    VisibilityCalculator,
    _,
    ezlocalize,
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

SectionsComponent = require('./SectionsComponent');

ItemListComponent = require('./ItemListComponent');

ezlocalize = require('ez-localize');

ResponseCleaner = require('./ResponseCleaner');

ResponseRow = require('./ResponseRow');

DefaultValueApplier = require('./DefaultValueApplier');

VisibilityCalculator = require('./VisibilityCalculator');

RandomAskedCalculator = require('./RandomAskedCalculator');

// Displays a form that can be filled out
module.exports = FormComponent = function () {
  var FormComponent = function (_React$Component) {
    _inherits(FormComponent, _React$Component);

    function FormComponent(props) {
      _classCallCheck(this, FormComponent);

      var _this = _possibleConstructorReturn(this, (FormComponent.__proto__ || Object.getPrototypeOf(FormComponent)).call(this, props));

      _this.handleSubmit = _this.handleSubmit.bind(_this);
      _this.isVisible = _this.isVisible.bind(_this);
      _this.createResponseRow = _this.createResponseRow.bind(_this);
      _this.handleDataChange = _this.handleDataChange.bind(_this);
      _this.handleNext = _this.handleNext.bind(_this);
      _this.state = {
        visibilityStructure: {},
        T: _this.createLocalizer(_this.props.design, _this.props.locale)
      };
      // Save which data visibility structure applies to
      _this.currentData = null;
      return _this;
    }

    _createClass(FormComponent, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return _.extend({}, this.props.formCtx, {
          T: this.state.T,
          locale: this.props.locale,
          disableConfidentialFields: this.props.disableConfidentialFields
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.design !== nextProps.design || this.props.locale !== nextProps.locale) {
          return this.setState({
            T: this.createLocalizer(nextProps.design, nextProps.locale)
          });
        }
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        // When data change is external, process it to set visibility, etc.
        if (prevProps.data !== this.props.data && !_.isEqual(this.props.data, this.currentData)) {
          return this.handleDataChange(this.props.data);
        }
      }

      // This will clean the data that has been passed at creation
      // It will also initialize the visibilityStructure
      // And set the sticky data

    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        return this.handleDataChange(this.props.data);
      }

      // Creates a localizer for the form design

    }, {
      key: 'createLocalizer',
      value: function createLocalizer(design, locale) {
        var T, localizedStrings, localizerData;
        // Create localizer
        localizedStrings = design.localizedStrings || [];
        localizerData = {
          locales: design.locales,
          strings: localizedStrings
        };
        T = new ezlocalize.Localizer(localizerData, locale).T;
        return T;
      }
    }, {
      key: 'handleSubmit',
      value: function handleSubmit() {
        boundMethodCheck(this, FormComponent);
        // Cannot submit if at least one item is invalid
        if (!this.refs.itemListComponent.validate(true)) {
          return this.props.onSubmit();
        }
      }
    }, {
      key: 'isVisible',
      value: function isVisible(itemId) {
        boundMethodCheck(this, FormComponent);
        return this.state.visibilityStructure[itemId];
      }
    }, {
      key: 'createResponseRow',
      value: function createResponseRow(data) {
        boundMethodCheck(this, FormComponent);
        return new ResponseRow({
          responseData: data,
          formDesign: this.props.design,
          schema: this.props.schema,
          getEntityById: this.props.formCtx.getEntityById,
          getEntityByCode: this.props.formCtx.getEntityByCode,
          deployment: this.props.deployment
        });
      }
    }, {
      key: 'handleDataChange',
      value: function handleDataChange(data) {
        var _this2 = this;

        var defaultValueApplier, randomAskedCalculator, responseCleaner, visibilityCalculator;
        boundMethodCheck(this, FormComponent);
        visibilityCalculator = new VisibilityCalculator(this.props.design);
        defaultValueApplier = new DefaultValueApplier(this.props.design, this.props.formCtx.stickyStorage, this.props.entity, this.props.entityType);
        randomAskedCalculator = new RandomAskedCalculator(this.props.design);
        responseCleaner = new ResponseCleaner();
        // Immediately update data, as another answer might be clicked on (e.g. blur from a number input and clicking on a radio answer)
        this.currentData = data;
        this.props.onDataChange(data);
        // Clean response data, remembering which data object is being cleaned
        this.cleanInProgress = data;
        return responseCleaner.cleanData(this.props.design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, this.createResponseRow, this.state.visibilityStructure, function (error, results) {
          if (error) {
            alert(T("Error saving data") + (': ' + error.message));
            return;
          }
          // Ignore if from a previous clean
          if (data !== _this2.cleanInProgress) {
            console.log("Ignoring stale handleDataChange data");
            return;
          }
          _this2.setState({
            visibilityStructure: results.visibilityStructure
          });
          // Ignore if unchanged
          if (!_.isEqual(data, results.data)) {
            _this2.currentData = results.data;
            return _this2.props.onDataChange(results.data);
          }
        });
      }
    }, {
      key: 'handleNext',
      value: function handleNext() {
        boundMethodCheck(this, FormComponent);
        return this.refs.submit.focus();
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.props.design.contents[0] && this.props.design.contents[0]._type === "Section" && !this.props.singlePageMode) {
          return R(SectionsComponent, {
            contents: this.props.design.contents,
            data: this.props.data,
            onDataChange: this.handleDataChange,
            responseRow: this.createResponseRow(this.props.data),
            schema: this.props.schema,
            onSubmit: this.props.onSubmit,
            onSaveLater: this.props.onSaveLater,
            onDiscard: this.props.onDiscard,
            isVisible: this.isVisible
          });
        } else {
          return H.div(null, R(ItemListComponent, {
            ref: 'itemListComponent',
            contents: this.props.design.contents,
            data: this.props.data,
            onDataChange: this.handleDataChange,
            responseRow: this.createResponseRow(this.props.data),
            schema: this.props.schema,
            isVisible: this.isVisible,
            onNext: this.handleNext
          }), this.props.onSubmit ? H.button({
            type: "button",
            key: 'submitButton',
            className: "btn btn-primary",
            ref: 'submit',
            onClick: this.handleSubmit
          }, this.props.submitLabel ? this.props.submitLabel : this.state.T("Submit")) : void 0, '\xA0', this.props.onSaveLater ? [H.button({
            type: "button",
            key: 'saveLaterButton',
            className: "btn btn-default",
            onClick: this.props.onSaveLater
          }, this.props.saveLaterLabel ? this.props.saveLaterLabel : this.state.T("Save for Later")), '\xA0'] : void 0, this.props.onDiscard ? H.button({
            type: "button",
            key: 'discardButton',
            className: "btn btn-default",
            onClick: this.props.onDiscard
          }, this.props.discardLabel ? this.props.discardLabel : [H.span({
            className: "glyphicon glyphicon-trash"
          }), " " + this.state.T("Discard")]) : void 0);
        }
      }
    }]);

    return FormComponent;
  }(React.Component);

  ;

  FormComponent.propTypes = {
    formCtx: PropTypes.object.isRequired, // Context to use for form. See docs/FormsContext.md
    design: PropTypes.object.isRequired, // Form design. See schema.coffee
    data: PropTypes.object.isRequired, // Form response data. See docs/Answer Formats.md
    onDataChange: PropTypes.func.isRequired, // Called when response data changes
    schema: PropTypes.object.isRequired, // Schema to use, including form
    deployment: PropTypes.string.isRequired, // The current deployment
    locale: PropTypes.string, // e.g. "fr"
    onSubmit: PropTypes.func, // Called when submit is pressed
    onSaveLater: PropTypes.func, // Optional save for later
    onDiscard: PropTypes.func, // Called when discard is pressed
    submitLabel: PropTypes.string, // To override submit label
    saveLaterLabel: PropTypes.string, // To override Save For Later label
    discardLabel: PropTypes.string, // To override Discard label
    entity: PropTypes.object, // Form-level entity to load
    entityType: PropTypes.string, // Type of form-level entity to load
    singlePageMode: PropTypes.bool, // True to render as a single page, not divided into sections
    disableConfidentialFields: PropTypes.bool // True to disable the confidential fields, used during editing responses with confidential data
  };

  FormComponent.childContextTypes = _.extend({}, require('./formContextTypes'), {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string, // e.g. "fr"
    disableConfidentialFields: PropTypes.bool
  });

  return FormComponent;
}.call(undefined);