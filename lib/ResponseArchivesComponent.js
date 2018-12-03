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

var PropTypes,
    R,
    React,
    ResponseAnswersComponent,
    ResponseArchivesComponent,
    _,
    moment,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

ResponseAnswersComponent = require('./ResponseAnswersComponent');

moment = require('moment');

// Show complete change history of response
module.exports = ResponseArchivesComponent = function () {
  var ResponseArchivesComponent = function (_React$Component) {
    (0, _inherits3.default)(ResponseArchivesComponent, _React$Component);

    function ResponseArchivesComponent() {
      (0, _classCallCheck3.default)(this, ResponseArchivesComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (ResponseArchivesComponent.__proto__ || (0, _getPrototypeOf2.default)(ResponseArchivesComponent)).apply(this, arguments));

      _this.renderRecord = _this.renderRecord.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(ResponseArchivesComponent, [{
      key: 'renderRecord',
      value: function renderRecord(record, previousRecord) {
        var ref;
        boundMethodCheck(this, ResponseArchivesComponent);
        return R('div', {
          key: record._rev,
          style: {
            marginTop: 10
          }
        }, R('p', {
          key: 'summary'
        }, "Changes made by ", R('b', null, record.modified.by ? (ref = this.props.eventsUsernames[record.modified.by]) != null ? ref.username : void 0 : "Anonymous"), " on ", moment(record.modified.on).format('lll')), R('div', {
          key: 'detail'
        }, R(ResponseAnswersComponent, {
          formDesign: this.props.formDesign,
          data: record.data,
          schema: this.props.schema,
          locale: this.props.locale,
          T: this.props.T,
          formCtx: this.props.formCtx,
          prevData: previousRecord,
          showPrevAnswers: true,
          showChangedLink: false,
          highlightChanges: true,
          hideUnchangedAnswers: true
        })));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        if (this.props.history.length === 0) {
          return R('div', null, R('i', null, "No changes made since submission"));
        }
        return R('div', null, _.map(this.props.history, function (record, index) {
          if (index === 0) {
            return _this2.renderRecord(_this2.props.response, record);
          } else {
            return _this2.renderRecord(_this2.props.history[index - 1], record);
          }
        }));
      }
    }]);
    return ResponseArchivesComponent;
  }(React.Component);

  ;

  ResponseArchivesComponent.propTypes = {
    formDesign: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired, // Schema of the 
    locale: PropTypes.string, // Defaults to english
    T: PropTypes.func.isRequired, // Localizer to use
    formCtx: PropTypes.object.isRequired, // Form context to use
    history: PropTypes.array.isRequired, // The archives
    eventsUsernames: PropTypes.object.isRequired // The usernames
  };

  return ResponseArchivesComponent;
}.call(undefined);