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
    (0, _inherits3.default)(FormComponent, _React$Component);

    function FormComponent(props) {
      (0, _classCallCheck3.default)(this, FormComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (FormComponent.__proto__ || (0, _getPrototypeOf2.default)(FormComponent)).call(this, props));

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

    (0, _createClass3.default)(FormComponent, [{
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
      value: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          var result;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  boundMethodCheck(this, FormComponent);
                  // Cannot submit if at least one item is invalid
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
        visibilityCalculator = new VisibilityCalculator(this.props.design, this.props.schema);
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
        return this.submit.focus();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

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
            ref: function ref(c) {
              return _this3.itemListComponent = c;
            },
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
            ref: function ref(c) {
              return _this3.submit = c;
            },
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