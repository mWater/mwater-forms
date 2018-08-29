'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    PropTypes,
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

H = React.DOM;

R = React.createElement;

ResponseAnswersComponent = require('./ResponseAnswersComponent');

moment = require('moment');

// Show complete change history of response
module.exports = ResponseArchivesComponent = function () {
  var ResponseArchivesComponent = function (_React$Component) {
    _inherits(ResponseArchivesComponent, _React$Component);

    function ResponseArchivesComponent() {
      _classCallCheck(this, ResponseArchivesComponent);

      var _this = _possibleConstructorReturn(this, (ResponseArchivesComponent.__proto__ || Object.getPrototypeOf(ResponseArchivesComponent)).apply(this, arguments));

      _this.renderRecord = _this.renderRecord.bind(_this);
      return _this;
    }

    _createClass(ResponseArchivesComponent, [{
      key: 'renderRecord',
      value: function renderRecord(record, previousRecord) {
        var ref;
        boundMethodCheck(this, ResponseArchivesComponent);
        return H.div({
          key: record._rev,
          style: {
            marginTop: 10
          }
        }, H.p({
          key: 'summary'
        }, "Changes made by ", H.b(null, record.modified.by ? (ref = this.props.eventsUsernames[record.modified.by]) != null ? ref.username : void 0 : "Anonymous"), " on ", moment(record.modified.on).format('lll')), H.div({
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
          return H.div(null, H.i(null, "No changes made since submission"));
        }
        return H.div(null, _.map(this.props.history, function (record, index) {
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