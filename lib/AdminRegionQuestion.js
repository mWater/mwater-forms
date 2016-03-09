var AdminRegionAnswerComponent, AdminRegionQuestion, AdminRegionSelectComponent, H, Question, React, ReactDOM, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

H = React.DOM;

AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

module.exports = AdminRegionQuestion = (function(superClass) {
  extend(AdminRegionQuestion, superClass);

  function AdminRegionQuestion() {
    return AdminRegionQuestion.__super__.constructor.apply(this, arguments);
  }

  AdminRegionQuestion.prototype.updateAnswer = function(answerEl) {
    var elem, value;
    this.answerEl = answerEl;
    if ((this.ctx.getAdminRegionPath == null) || (this.ctx.getSubAdminRegions == null)) {
      elem = H.div({
        className: "text-warning"
      }, this.T("Not supported on this platform"));
    } else {
      value = this.getAnswerValue();
      elem = React.createElement(AdminRegionAnswerComponent, {
        getAdminRegionPath: this.ctx.getAdminRegionPath,
        getSubAdminRegions: this.ctx.getSubAdminRegions,
        value: value,
        onChange: (function(_this) {
          return function(val) {
            return _this.setAnswerValue(val);
          };
        })(this)
      });
    }
    return ReactDOM.render(elem, answerEl.get(0));
  };

  AdminRegionQuestion.prototype.shownFirstTime = function() {
    AdminRegionQuestion.__super__.shownFirstTime.apply(this, arguments);
    if (!this.isAnswered() && this.options.defaultValue) {
      return this.setAnswerValue(this.options.defaultValue);
    }
  };

  AdminRegionQuestion.prototype.remove = function() {
    if (this.answerEl) {
      ReactDOM.unmountComponentAtNode(this.answerEl.get(0));
    }
    return AdminRegionQuestion.__super__.remove.apply(this, arguments);
  };

  return AdminRegionQuestion;

})(Question);

AdminRegionAnswerComponent = (function(superClass) {
  extend(AdminRegionAnswerComponent, superClass);

  function AdminRegionAnswerComponent() {
    return AdminRegionAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  AdminRegionAnswerComponent.propTypes = {
    getAdminRegionPath: React.PropTypes.func.isRequired,
    getSubAdminRegions: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  };

  AdminRegionAnswerComponent.prototype.renderEntityButtons = function() {
    return H.div(null, H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleUseGPS
    }, H.span({
      className: "glyphicon glyphicon-screenshot"
    }), " ", T("Set Using GPS")), H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleUseMap
    }, H.span({
      className: "glyphicon glyphicon-map-marker"
    }), " ", T("Set Using Map")));
  };

  AdminRegionAnswerComponent.prototype.render = function() {
    return H.div(null, this.renderEntityButtons(), React.createElement(AdminRegionSelectComponent, {
      getAdminRegionPath: this.props.getAdminRegionPath,
      getSubAdminRegions: this.props.getSubAdminRegions,
      value: this.props.value,
      onChange: this.props.onChange
    }));
  };

  return AdminRegionAnswerComponent;

})(React.Component);
