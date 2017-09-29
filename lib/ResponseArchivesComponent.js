var H, PropTypes, R, React, ResponseAnswersComponent, ResponseArchivesComponent, _, moment,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

ResponseAnswersComponent = require('./ResponseAnswersComponent');

moment = require('moment');

module.exports = ResponseArchivesComponent = (function(superClass) {
  extend(ResponseArchivesComponent, superClass);

  function ResponseArchivesComponent() {
    this.renderRecord = bind(this.renderRecord, this);
    return ResponseArchivesComponent.__super__.constructor.apply(this, arguments);
  }

  ResponseArchivesComponent.propTypes = {
    formDesign: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    locale: PropTypes.string,
    T: PropTypes.func.isRequired,
    formCtx: PropTypes.object.isRequired,
    history: PropTypes.array.isRequired,
    eventsUsernames: PropTypes.object.isRequired
  };

  ResponseArchivesComponent.prototype.renderRecord = function(record, previousRecord) {
    var ref;
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
  };

  ResponseArchivesComponent.prototype.render = function() {
    if (this.props.history.length === 0) {
      return H.div(null, H.i(null, "No changes made since submission"));
    }
    return H.div(null, _.map(this.props.history, (function(_this) {
      return function(record, index) {
        if (index === 0) {
          return _this.renderRecord(_this.props.response, record);
        } else {
          return _this.renderRecord(_this.props.history[index - 1], record);
        }
      };
    })(this)));
  };

  return ResponseArchivesComponent;

})(React.Component);
