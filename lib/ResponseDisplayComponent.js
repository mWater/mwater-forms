'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var $,
    H,
    ModalPopupComponent,
    PropTypes,
    R,
    React,
    ResponseAnswersComponent,
    ResponseArchivesComponent,
    ResponseDisplayComponent,
    _,
    ezlocalize,
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

$ = require('jquery');

moment = require('moment');

ezlocalize = require('ez-localize');

ResponseAnswersComponent = require('./ResponseAnswersComponent');

ResponseArchivesComponent = require('./ResponseArchivesComponent');

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

// Static view of a response
module.exports = ResponseDisplayComponent = function () {
  var ResponseDisplayComponent = function (_React$Component) {
    (0, _inherits3.default)(ResponseDisplayComponent, _React$Component);

    function ResponseDisplayComponent(props) {
      (0, _classCallCheck3.default)(this, ResponseDisplayComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (ResponseDisplayComponent.__proto__ || (0, _getPrototypeOf2.default)(ResponseDisplayComponent)).call(this, props));

      _this.handleHideHistory = _this.handleHideHistory.bind(_this);
      _this.handleShowHistory = _this.handleShowHistory.bind(_this);
      _this.state = {
        eventsUsernames: null,
        loadingUsernames: false,
        showCompleteHistory: _this.props.forceCompleteHistory || false,
        T: _this.createLocalizer(_this.props.form.design, _this.props.formCtx.locale),
        history: null,
        loadingHistory: false,
        showArchive: false,
        showPrevAnswers: false
      };
      return _this;
    }

    (0, _createClass3.default)(ResponseDisplayComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        return this.loadEventUsernames(this.props.response.events);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        return this.loadHistory(this.props);
      }
    }, {
      key: 'loadHistory',
      value: function loadHistory(props) {
        var _this2 = this;

        var ref, url;
        url = props.apiUrl + 'archives/responses/' + props.response._id + '?client=' + (((ref = props.login) != null ? ref.client : void 0) || "");
        this.setState({
          loadingHistory: true
        });
        return $.ajax({
          dataType: "json",
          url: url
        }).done(function (history) {
          var compactHistory, entry, i, index, j, len, prevEntry;
          // Get only ones since first submission
          index = _.findIndex(history, function (rev) {
            var ref1;
            return (ref1 = rev.status) === 'pending' || ref1 === 'final';
          });
          history = history.slice(0, index + 1);
          // Remove history where there was no change to data
          compactHistory = [];
          for (i = j = 0, len = history.length; j < len; i = ++j) {
            entry = history[i];
            prevEntry = i === 0 ? _this2.props.response : history[i - 1];
            if (!_.isEqual(entry.data, prevEntry.data)) {
              compactHistory.push(entry);
            }
          }
          return _this2.setState({
            loadingHistory: false,
            history: compactHistory
          });
        }).fail(function (xhr) {
          return _this2.setState({
            loadingHistory: false,
            history: null
          });
        });
      }

      // Load user names related to events

    }, {
      key: 'loadEventUsernames',
      value: function loadEventUsernames(events) {
        var _this3 = this;

        var byArray, filter, url;
        events = this.props.response.events || [];
        byArray = _.compact(_.pluck(events, "by"));
        if (byArray.length > 0 && this.props.apiUrl != null) {
          filter = {
            _id: {
              $in: byArray
            }
          };
          url = this.props.apiUrl + 'users_public_data?filter=' + (0, _stringify2.default)(filter);
          this.setState({
            loadingUsernames: true
          });
          return $.ajax({
            dataType: "json",
            url: url
          }).done(function (rows) {
            // eventsUsernames is an object with a key for each _id value
            return _this3.setState({
              loadingUsernames: false,
              eventsUsernames: _.indexBy(rows, '_id')
            });
          }).fail(function (xhr) {
            return _this3.setState({
              loadingUsernames: false,
              eventsUsernames: null
            });
          });
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var events;
        if (this.props.form.design !== nextProps.form.design || this.props.locale !== nextProps.locale) {
          this.setState({
            T: this.createLocalizer(nextProps.form.design, nextProps.locale)
          });
        }
        if (!_.isEqual(this.props.response.response, nextProps.response.response)) {
          this.loadHistory(nextProps);
        }
        if (!_.isEqual(this.props.response.events, nextProps.response.events)) {
          this.loadEventUsernames(nextProps.response.events);
        }
        return events = this.props.response.events || [];
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return _.extend({}, this.props.formCtx, {
          T: this.state.T,
          locale: this.props.locale
        });
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
      key: 'handleHideHistory',
      value: function handleHideHistory() {
        boundMethodCheck(this, ResponseDisplayComponent);
        return this.setState({
          showCompleteHistory: false
        });
      }
    }, {
      key: 'handleShowHistory',
      value: function handleShowHistory() {
        boundMethodCheck(this, ResponseDisplayComponent);
        return this.setState({
          showCompleteHistory: true
        });
      }
    }, {
      key: 'renderEvent',
      value: function renderEvent(ev) {
        var eventType, ref;
        if (this.state.eventsUsernames == null) {
          return null;
        }
        eventType = function () {
          switch (ev.type) {
            case "draft":
              return this.state.T("Drafted");
            case "submit":
              return this.state.T("Submitted");
            case "approve":
              return this.state.T("Approved");
            case "reject":
              return this.state.T("Rejected");
            case "edit":
              return this.state.T("Edited");
          }
        }.call(this);
        return H.div(null, eventType, " ", this.state.T("by"), " ", ev.by ? (ref = this.state.eventsUsernames[ev.by]) != null ? ref.username : void 0 : "Anonymous", " ", this.state.T("on"), " ", moment(ev.on).format('lll'), ev.message ? [": ", H.i(null, ev.message)] : void 0, ev.override ? H.span({
          className: "label label-warning"
        }, this.state.T("Admin Override")) : void 0);
      }

      // History of events

    }, {
      key: 'renderHistory',
      value: function renderHistory() {
        var _this4 = this;

        var contents, ev, events, j, lastEvent, len, ref;
        if (this.state.loadingUsernames) {
          return H.div({
            key: "history"
          }, H.label(null, this.state.T("Loading History...")));
        }
        contents = [];
        events = this.props.response.events || [];
        if (this.state.showCompleteHistory) {
          ref = _.initial(events);
          for (j = 0, len = ref.length; j < len; j++) {
            ev = ref[j];
            contents.push(this.renderEvent(ev));
          }
        }
        lastEvent = _.last(events);
        if (lastEvent) {
          contents.push(this.renderEvent(lastEvent));
        }
        if (events.length > 1 && !this.props.forceCompleteHistory) {
          if (this.state.showCompleteHistory) {
            contents.push(H.div(null, H.a({
              style: {
                cursor: "pointer"
              },
              onClick: this.handleHideHistory
            }, this.state.T("Hide History"))));
            contents.push(H.div(null, H.a({
              style: {
                cursor: "pointer"
              },
              onClick: function onClick() {
                return _this4.setState({
                  showArchive: true
                });
              }
            }, this.state.T("Show Complete History of Changes"))));
          } else {
            contents.push(H.div(null, H.a({
              style: {
                cursor: "pointer"
              },
              onClick: this.handleShowHistory
            }, this.state.T("Show History"))));
          }
        }
        return H.div({
          key: "history"
        }, contents);
      }
    }, {
      key: 'renderStatus',
      value: function renderStatus() {
        var status;
        status = function () {
          switch (this.props.response.status) {
            case "draft":
              return this.state.T("Draft");
            case "rejected":
              return this.state.T("Rejected");
            case "pending":
              return this.state.T("Pending");
            case "final":
              return this.state.T("Final");
          }
        }.call(this);
        return H.div({
          key: "status"
        }, this.state.T('Status'), ": ", H.b(null, status));
      }
    }, {
      key: 'renderArchives',
      value: function renderArchives() {
        var _this5 = this;

        if (!this.state.history || !this.state.showArchive) {
          return null;
        }
        return R(ModalPopupComponent, {
          header: "Change history",
          size: "large",
          showCloseX: true,
          onClose: function onClose() {
            return _this5.setState({
              showArchive: false
            });
          }
        }, R(ResponseArchivesComponent, {
          formDesign: this.props.form.design,
          response: this.props.response,
          schema: this.props.schema,
          locale: this.props.locale,
          T: this.state.T,
          formCtx: this.props.formCtx,
          history: this.state.history,
          eventsUsernames: this.state.eventsUsernames
        }));
      }

      // Header which includes basics

    }, {
      key: 'renderHeader',
      value: function renderHeader() {
        return H.div({
          style: {
            paddingBottom: 10
          }
        }, H.div({
          key: "user"
        }, this.state.T('User'), ": ", H.b(null, this.props.response.username || "Anonymous")), H.div({
          key: "code"
        }, this.state.T('Response Id'), ": ", H.b(null, this.props.response.code)), this.props.response && this.props.response.submittedOn ? H.div({
          key: "submittedOn"
        }, this.state.T('Submitted'), ": ", H.b(null, moment(this.props.response.submittedOn).format('lll'))) : void 0, this.props.response.ipAddress ? H.div({
          key: "ipAddress"
        }, this.state.T('IP Address'), ": ", H.b(null, this.props.response.ipAddress)) : void 0, this.renderStatus(), this.renderHistory(), this.renderArchives());
      }
    }, {
      key: 'render',
      value: function render() {
        var _this6 = this;

        return H.div(null, this.renderHeader(), React.createElement(ResponseAnswersComponent, {
          formDesign: this.props.form.design,
          data: this.props.response.data,
          schema: this.props.schema,
          locale: this.props.locale,
          T: this.state.T,
          formCtx: this.props.formCtx,
          prevData: this.state.history ? _.last(this.state.history) : null,
          showPrevAnswers: this.state.history != null && this.state.showPrevAnswers,
          highlightChanges: this.state.showPrevAnswers,
          showChangedLink: this.state.history != null,
          onChangedLinkClick: function onChangedLinkClick() {
            return _this6.setState({
              showPrevAnswers: !_this6.state.showPrevAnswers
            });
          },
          onCompleteHistoryLinkClick: function onCompleteHistoryLinkClick() {
            return _this6.setState({
              showArchive: true
            });
          }
        }));
      }
    }]);
    return ResponseDisplayComponent;
  }(React.Component);

  ;

  ResponseDisplayComponent.propTypes = {
    form: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired, // Schema including the form
    formCtx: PropTypes.object.isRequired,
    apiUrl: PropTypes.string,
    locale: PropTypes.string, // Defaults to english
    login: PropTypes.object, // Current login (contains user, username, groups)
    forceCompleteHistory: PropTypes.bool // True to display complete history always
  };

  ResponseDisplayComponent.childContextTypes = _.extend({}, require('./formContextTypes'), {
    T: PropTypes.func.isRequired,
    locale: PropTypes.string // e.g. "fr"
  });

  return ResponseDisplayComponent;
}.call(undefined);