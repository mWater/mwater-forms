var H, React, ResponseAnswersComponent, ResponseDisplayComponent, _, ezlocalize, moment,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

moment = require('moment');

ezlocalize = require('ez-localize');

ResponseAnswersComponent = require('./ResponseAnswersComponent');

module.exports = ResponseDisplayComponent = (function(superClass) {
  extend(ResponseDisplayComponent, superClass);

  ResponseDisplayComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    response: React.PropTypes.object.isRequired,
    schema: React.PropTypes.object.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    apiUrl: React.PropTypes.string,
    locale: React.PropTypes.string
  };

  ResponseDisplayComponent.childContextTypes = _.extend({}, require('./formContextTypes'), {
    T: React.PropTypes.func.isRequired,
    locale: React.PropTypes.string
  });

  function ResponseDisplayComponent(props) {
    this.handleShowHistory = bind(this.handleShowHistory, this);
    this.handleHideHistory = bind(this.handleHideHistory, this);
    ResponseDisplayComponent.__super__.constructor.call(this, props);
    this.state = {
      eventsUsernames: null,
      loadingUsernames: false,
      showCompleteHistory: false,
      T: this.createLocalizer(this.props.form.design, this.props.formCtx.locale)
    };
  }

  ResponseDisplayComponent.prototype.componentWillMount = function() {
    var byArray, events, filter, url;
    events = this.props.response.events || [];
    byArray = _.compact(_.pluck(events, "by"));
    if (byArray.length > 0 && (this.props.apiUrl != null)) {
      filter = {
        _id: {
          $in: byArray
        }
      };
      url = this.props.apiUrl + 'users_public_data?filter=' + JSON.stringify(filter);
      this.setState({
        loadingUsernames: true
      });
      return $.ajax({
        dataType: "json",
        url: url
      }).done((function(_this) {
        return function(rows) {
          return _this.setState({
            loadingUsernames: false,
            eventsUsernames: _.indexBy(rows, '_id')
          });
        };
      })(this)).fail((function(_this) {
        return function(xhr) {
          return _this.setState({
            loadingUsernames: false,
            eventsUsernames: null
          });
        };
      })(this));
    }
  };

  ResponseDisplayComponent.prototype.componentWillReceiveProps = function(nextProps) {
    var events;
    if (this.props.form.design !== nextProps.form.design || this.props.locale !== nextProps.locale) {
      this.setState({
        T: this.createLocalizer(nextProps.form.design, nextProps.locale)
      });
    }
    return events = this.props.response.events || [];
  };

  ResponseDisplayComponent.prototype.getChildContext = function() {
    return _.extend({}, this.props.formCtx, {
      T: this.state.T,
      locale: this.props.locale
    });
  };

  ResponseDisplayComponent.prototype.createLocalizer = function(design, locale) {
    var T, localizedStrings, localizerData;
    localizedStrings = design.localizedStrings || [];
    localizerData = {
      locales: design.locales,
      strings: localizedStrings
    };
    T = new ezlocalize.Localizer(localizerData, locale).T;
    return T;
  };

  ResponseDisplayComponent.prototype.handleHideHistory = function() {
    return this.setState({
      showCompleteHistory: false
    });
  };

  ResponseDisplayComponent.prototype.handleShowHistory = function() {
    return this.setState({
      showCompleteHistory: true
    });
  };

  ResponseDisplayComponent.prototype.renderEvent = function(ev) {
    var eventType, ref;
    if (this.state.eventsUsernames == null) {
      return null;
    }
    eventType = (function() {
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
    }).call(this);
    return H.div(null, eventType, " ", this.state.T("by"), " ", ev.by ? (ref = this.state.eventsUsernames[ev.by]) != null ? ref.username : void 0 : "Anonymous", " ", this.state.T("on"), " ", moment(ev.on).format('lll'), ev.message ? [": ", H.i(null, ev.message)] : void 0, ev.override ? H.span({
      className: "label label-warning"
    }, this.state.T("Admin Override")) : void 0);
  };

  ResponseDisplayComponent.prototype.renderHistory = function() {
    var contents, ev, events, i, lastEvent, len, ref;
    if (this.state.loadingUsernames) {
      return H.div({
        key: "history"
      }, H.label(null, this.props.T("Loading History...")));
    }
    contents = [];
    events = this.props.response.events || [];
    if (this.state.showCompleteHistory) {
      ref = _.initial(events);
      for (i = 0, len = ref.length; i < len; i++) {
        ev = ref[i];
        contents.push(this.renderEvent(ev));
      }
    }
    lastEvent = _.last(events);
    if (lastEvent) {
      contents.push(this.renderEvent(lastEvent));
    }
    if (events.length > 1) {
      if (this.state.showCompleteHistory) {
        contents.push(H.a({
          style: {
            cursor: "pointer"
          },
          onClick: this.handleHideHistory
        }, this.state.T("Hide History")));
      } else {
        contents.push(H.a({
          style: {
            cursor: "pointer"
          },
          onClick: this.handleShowHistory
        }, this.state.T("Show History")));
      }
    }
    return H.div({
      key: "history"
    }, contents);
  };

  ResponseDisplayComponent.prototype.renderStatus = function() {
    var status;
    status = (function() {
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
    }).call(this);
    return H.div({
      key: "status"
    }, this.state.T('Status'), ": ", H.b(null, status));
  };

  ResponseDisplayComponent.prototype.renderHeader = function() {
    return H.div({
      style: {
        paddingBottom: 10
      }
    }, H.div({
      key: "user"
    }, this.state.T('User'), ": ", H.b(null, this.props.response.username || "Anonymous")), H.div({
      key: "code"
    }, this.state.T('Response Id'), ": ", H.b(null, this.props.response.code)), this.props.response && this.props.response.modified ? H.div({
      key: "date"
    }, this.state.T('Date'), ": ", H.b(null, moment(this.props.response.modified.on).format('lll'))) : void 0, this.props.response.ipAddress ? H.div({
      key: "ipAddress"
    }, this.state.T('IP Address'), ": ", H.b(null, this.props.response.ipAddress)) : void 0, this.renderStatus(), this.renderHistory());
  };

  ResponseDisplayComponent.prototype.render = function() {
    return H.div(null, this.renderHeader(), React.createElement(ResponseAnswersComponent, {
      formDesign: this.props.form.design,
      data: this.props.response.data,
      schema: this.props.schema,
      locale: this.props.locale,
      T: this.props.T,
      formCtx: this.props.formCtx
    }));
  };

  return ResponseDisplayComponent;

})(React.Component);
