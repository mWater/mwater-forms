'use strict';

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
    MatrixAnswerComponent,
    MatrixColumnCellComponent,
    PropTypes,
    R,
    React,
    ValidationCompiler,
    _,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

_ = require('lodash');

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

MatrixColumnCellComponent = require('../MatrixColumnCellComponent');

ValidationCompiler = require('./ValidationCompiler');

// Matrix with columns and items
module.exports = MatrixAnswerComponent = function () {
  var MatrixAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(MatrixAnswerComponent, _React$Component);

    function MatrixAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, MatrixAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (MatrixAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(MatrixAnswerComponent)).call(this, props));

      _this.handleCellChange = _this.handleCellChange.bind(_this);
      _this.state = {
        validationErrors: {}
      };
      return _this;
    }

    (0, _createClass3.default)(MatrixAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // TODO
        return null;
      }

      // Validate a matrix answer. Returns true if invalid was found, false otherwise

    }, {
      key: 'validate',
      value: function validate() {
        var column, columnIndex, data, foundInvalid, i, item, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
        // Alternate selected means cannot be invalid
        if (this.props.alternate) {
          return false;
        }
        validationErrors = {};
        // Important to let know the caller if something has been found (so it can scrollToFirst properly)
        foundInvalid = false;
        ref = this.props.items;
        // For each entry
        for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
          item = ref[rowIndex];
          ref1 = this.props.columns;
          // For each column
          for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
            column = ref1[columnIndex];
            key = item.id + '_' + column._id;
            data = (ref2 = this.props.value) != null ? (ref3 = ref2[item.id]) != null ? ref3[column._id] : void 0 : void 0;
            if (column.required && ((data != null ? data.value : void 0) == null || (data != null ? data.value : void 0) === '')) {
              foundInvalid = true;
              validationErrors[key] = true;
              continue;
            }
            if (column.validations && column.validations.length > 0) {
              validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(data);
              if (validationError) {
                foundInvalid = true;
                validationErrors[key] = validationError;
              }
            }
          }
        }
        // Save state
        this.setState({
          validationErrors: validationErrors
        });
        return foundInvalid;
      }
    }, {
      key: 'handleCellChange',
      value: function handleCellChange(item, column, answer) {
        var change, itemData, matrixValue;
        boundMethodCheck(this, MatrixAnswerComponent);
        matrixValue = this.props.value || {};
        // Get data of the item, which is indexed by item id in the answer
        itemData = matrixValue[item.id] || {};
        // Set column in item
        change = {};
        change[column._id] = answer;
        itemData = _.extend({}, itemData, change);
        // Set item data within value
        change = {};
        change[item.id] = itemData;
        matrixValue = _.extend({}, matrixValue, change);
        return this.props.onValueChange(matrixValue);
      }
    }, {
      key: 'renderColumnHeader',
      value: function renderColumnHeader(column, index) {
        return H.th({
          key: 'header:' + column._id
          // Required star
        }, formUtils.localizeString(column.text, this.context.locale), column.required ? H.span({
          className: "required"
        }, "*") : void 0);
      }

      // Render the header row

    }, {
      key: 'renderHeader',
      value: function renderHeader() {
        var _this2 = this;

        // First item
        return H.thead(null, H.tr(null, H.th(null), _.map(this.props.columns, function (column, index) {
          return _this2.renderColumnHeader(column, index);
        })));
      }
    }, {
      key: 'renderCell',
      value: function renderCell(item, itemIndex, column, columnIndex) {
        var cellAnswer, invalid, itemData, key, matrixValue;
        matrixValue = this.props.value || {};
        // Get data of the item, which is indexed by item id in the answer
        itemData = matrixValue[item.id] || {};
        // Get cell answer which is inside the item data, indexed by column id
        cellAnswer = itemData[column._id] || {};
        // Determine if invalid
        key = item.id + '_' + column._id;
        invalid = this.state.validationErrors[key];
        // Render cell
        return R(MatrixColumnCellComponent, {
          key: column._id,
          column: column,
          data: this.props.data,
          responseRow: this.props.responseRow,
          answer: cellAnswer,
          onAnswerChange: this.handleCellChange.bind(null, item, column),
          invalid: invalid != null,
          schema: this.props.schema
        });
      }
    }, {
      key: 'renderItem',
      value: function renderItem(item, index) {
        var _this3 = this;

        return H.tr({
          key: index
        }, H.td({
          key: "_item"
        }, H.label(null, formUtils.localizeString(item.label, this.context.locale)), item.hint ? [H.br(), H.div({
          className: "text-muted"
        }, formUtils.localizeString(item.hint, this.context.locale))] : void 0), _.map(this.props.columns, function (column, columnIndex) {
          return _this3.renderCell(item, index, column, columnIndex);
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        // Create table
        // borderCollapse is set to separate (overriding bootstrap table value), so that we can properly see the validation
        // error borders (or else the top one of the first row is missing since it's being collapsed with the th border)
        return H.table({
          className: "table",
          style: {
            borderCollapse: 'separate'
          }
        }, this.renderHeader(), H.tbody(null, _.map(this.props.items, function (item, index) {
          return _this4.renderItem(item, index);
        })));
      }
    }]);
    return MatrixAnswerComponent;
  }(React.Component);

  ;

  MatrixAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")
  };

  MatrixAnswerComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      // Unique (within the question) id of the item. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired,
      // Label of the choice, localized
      label: PropTypes.object.isRequired,
      // Hint associated with a choice
      hint: PropTypes.object
    })).isRequired,
    // Array of matrix columns
    columns: PropTypes.array.isRequired,
    value: PropTypes.object, // See answer format
    onValueChange: PropTypes.func.isRequired,
    alternate: PropTypes.string, // Alternate value if selected
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return MatrixAnswerComponent;
}.call(undefined);