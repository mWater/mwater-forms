'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    MatrixColumnCellComponent,
    PropTypes,
    R,
    React,
    ReorderableListComponent,
    RosterMatrixComponent,
    ValidationCompiler,
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

ValidationCompiler = require('./answers/ValidationCompiler');

ReorderableListComponent = require("react-library/lib/reorderable/ReorderableListComponent");

MatrixColumnCellComponent = require('./MatrixColumnCellComponent');

// Rosters are repeated information, such as asking questions about household members N times.
// A roster matrix is a list of column-type questions with one row for each entry in the roster
module.exports = RosterMatrixComponent = function () {
  var RosterMatrixComponent = function (_React$Component) {
    _inherits(RosterMatrixComponent, _React$Component);

    function RosterMatrixComponent(props) {
      _classCallCheck(this, RosterMatrixComponent);

      // Propagate an answer change to the onDataChange
      var _this = _possibleConstructorReturn(this, (RosterMatrixComponent.__proto__ || Object.getPrototypeOf(RosterMatrixComponent)).call(this, props));

      _this.handleAnswerChange = _this.handleAnswerChange.bind(_this);
      // Handles a change in data of a specific entry of the roster
      _this.handleEntryDataChange = _this.handleEntryDataChange.bind(_this);
      _this.handleAdd = _this.handleAdd.bind(_this);
      _this.handleRemove = _this.handleRemove.bind(_this);
      _this.handleCellChange = _this.handleCellChange.bind(_this);
      _this.handleSort = _this.handleSort.bind(_this);
      _this.renderEntry = _this.renderEntry.bind(_this);
      _this.state = {
        validationErrors: {}
      };
      return _this;
    }

    // Gets the id that the answer is stored under


    _createClass(RosterMatrixComponent, [{
      key: 'getAnswerId',
      value: function getAnswerId() {
        // Prefer rosterId if specified, otherwise use id. 
        return this.props.rosterMatrix.rosterId || this.props.rosterMatrix._id;
      }

      // Get the current answer value

    }, {
      key: 'getAnswer',
      value: function getAnswer() {
        return this.props.data[this.getAnswerId()] || [];
      }
    }, {
      key: 'validate',
      value: function validate(scrollToFirstInvalid) {
        var column, columnIndex, entry, foundInvalid, i, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
        validationErrors = {};
        // For each entry
        foundInvalid = false;
        ref = this.getAnswer();
        for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
          entry = ref[rowIndex];
          ref1 = this.props.rosterMatrix.contents;
          // For each column
          for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
            column = ref1[columnIndex];
            key = rowIndex + '_' + column._id;
            if (column.required && (((ref2 = entry.data[column._id]) != null ? ref2.value : void 0) == null || ((ref3 = entry.data[column._id]) != null ? ref3.value : void 0) === '')) {
              foundInvalid = true;
              validationErrors[key] = true;
            }
            if (column.validations && column.validations.length > 0) {
              validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(entry.data[column._id]);
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
        // Scroll into view
        if (foundInvalid && scrollToFirstInvalid) {
          this.refs.prompt.scrollIntoView();
        }
        return foundInvalid;
      }
    }, {
      key: 'handleAnswerChange',
      value: function handleAnswerChange(answer) {
        var change;
        boundMethodCheck(this, RosterMatrixComponent);
        change = {};
        change[this.getAnswerId()] = answer;
        return this.props.onDataChange(_.extend({}, this.props.data, change));
      }
    }, {
      key: 'handleEntryDataChange',
      value: function handleEntryDataChange(index, data) {
        var answer;
        boundMethodCheck(this, RosterMatrixComponent);
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
        boundMethodCheck(this, RosterMatrixComponent);
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
        boundMethodCheck(this, RosterMatrixComponent);
        answer = this.getAnswer().slice();
        answer.splice(index, 1);
        return this.handleAnswerChange(answer);
      }
    }, {
      key: 'handleCellChange',
      value: function handleCellChange(entryIndex, columnId, answer) {
        var change, data;
        boundMethodCheck(this, RosterMatrixComponent);
        data = this.getAnswer()[entryIndex].data;
        change = {};
        change[columnId] = answer;
        data = _.extend({}, data, change);
        return this.handleEntryDataChange(entryIndex, data);
      }
    }, {
      key: 'handleSort',
      value: function handleSort(column, order) {
        var answer;
        boundMethodCheck(this, RosterMatrixComponent);
        answer = this.getAnswer();
        answer = _.sortByOrder(answer, [function (item) {
          var ref;
          return (ref = item.data[column._id]) != null ? ref.value : void 0;
        }], [order]);
        return this.handleAnswerChange(answer);
      }
    }, {
      key: 'renderName',
      value: function renderName() {
        return H.h3({
          key: "prompt",
          ref: "prompt"
        }, formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale));
      }
    }, {
      key: 'renderColumnHeader',
      value: function renderColumnHeader(column, index) {
        var ref;
        return H.th({
          key: column._id
          // Required star
        }, formUtils.localizeString(column.text, this.context.locale), column.required ? H.span({
          className: "required"
          // Allow sorting
        }, "*") : void 0, (ref = column._type) === "TextColumnQuestion" || ref === "NumberColumnQuestion" || ref === "DateColumnQuestion" ? H.div({
          style: {
            float: "right"
          }
        }, H.span({
          className: "table-sort-controls glyphicon glyphicon-triangle-top",
          style: {
            cursor: "pointer"
          },
          onClick: this.handleSort.bind(null, column, "asc")
        }), H.span({
          className: "table-sort-controls glyphicon glyphicon-triangle-bottom",
          style: {
            cursor: "pointer"
          },
          onClick: this.handleSort.bind(null, column, "desc")
        })) : void 0);
      }
    }, {
      key: 'renderHeader',
      value: function renderHeader() {
        var _this2 = this;

        return H.thead(null, H.tr(null, _.map(this.props.rosterMatrix.contents, function (column, index) {
          return _this2.renderColumnHeader(column, index);
          // Extra for remove button
        }), this.props.rosterMatrix.allowRemove ? H.th(null) : void 0));
      }
    }, {
      key: 'renderCell',
      value: function renderCell(entry, entryIndex, column, columnIndex) {
        var entryData, invalid, key;
        // Get data of the entry
        entryData = this.getAnswer()[entryIndex].data;
        // Determine if invalid
        key = entryIndex + '_' + column._id;
        invalid = this.state.validationErrors[key];
        // Render cell
        return R(MatrixColumnCellComponent, {
          key: column._id,
          column: column,
          data: entryData,
          responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), entryIndex),
          answer: (entryData != null ? entryData[column._id] : void 0) || {},
          onAnswerChange: this.handleCellChange.bind(null, entryIndex, column._id),
          invalid: invalid,
          schema: this.props.schema
        });
      }
    }, {
      key: 'renderEntry',
      value: function renderEntry(entry, index, connectDragSource, connectDragPreview, connectDropTarget) {
        var _this3 = this;

        var elem;
        boundMethodCheck(this, RosterMatrixComponent);
        elem = H.tr({
          key: index
        }, _.map(this.props.rosterMatrix.contents, function (column, columnIndex) {
          return _this3.renderCell(entry, index, column, columnIndex);
        }), this.props.rosterMatrix.allowRemove ? H.td({
          key: "_remove"
        }, H.button({
          type: "button",
          className: "btn btn-sm btn-link",
          onClick: this.handleRemove.bind(null, index)
        }, H.span({
          className: "glyphicon glyphicon-remove"
        }))) : void 0);
        return connectDropTarget(connectDragPreview(connectDragSource(elem)));
      }
    }, {
      key: 'renderAdd',
      value: function renderAdd() {
        if (this.props.rosterMatrix.allowAdd) {
          return H.div({
            key: "add",
            style: {
              marginTop: 10
            }
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
      key: 'renderBody',
      value: function renderBody() {
        ({
          items: PropTypes.array.isRequired, // items to be reordered
          onReorder: PropTypes.func.isRequired, // callback function, called when an item is dropped, gets passed the reordered item list
          // function which renders the item, gets passed the current item and react dnd connectors
          // signature: function(item, index, connectDragSource, connectDragPreview, connectDropTarget)
          renderItem: PropTypes.func.isRequired,
          listId: PropTypes.string, // a uniqid for the list
          getItemId: PropTypes.func.isRequired, // function which should return the identifier of the current item, gets passed the current item
          element: PropTypes.object // the element to render this component as
        });
        return R(ReorderableListComponent, {
          items: this.getAnswer(),
          onReorder: this.handleAnswerChange,
          renderItem: this.renderEntry,
          getItemId: function getItemId(entry) {
            return entry._id;
          },
          element: H.tbody(null)
        });
      }
    }, {
      key: 'renderEmptyPrompt',
      value: function renderEmptyPrompt() {
        return H.div({
          style: {
            fontStyle: "italic"
          }
        }, formUtils.localizeString(this.props.rosterMatrix.emptyPrompt, this.context.locale) || this.context.T("Click +Add to add an item"));
      }
    }, {
      key: 'render',
      value: function render() {
        return H.div({
          style: {
            padding: 5,
            marginBottom: 20
          }
        }, this.renderName(), H.table({
          className: "table"
          // Display message if none and can add
        }, this.renderHeader(), this.renderBody()), this.getAnswer().length === 0 && this.props.rosterMatrix.allowAdd ? this.renderEmptyPrompt() : void 0, this.renderAdd());
      }
    }]);

    return RosterMatrixComponent;
  }(React.Component);

  ;

  RosterMatrixComponent.contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired // Localizer to use
  };

  RosterMatrixComponent.propTypes = {
    rosterMatrix: PropTypes.object.isRequired, // Design of roster matrix. See schema
    data: PropTypes.object, // Current data of response. 
    onDataChange: PropTypes.func.isRequired, // Called when data changes
    isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return RosterMatrixComponent;
}.call(undefined);