var AdminRegionAnswerComponent, AdminRegionQuestion, H, Question, React, ReactDOM, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

H = React.DOM;

AdminRegionAnswerComponent = require('../answers/AdminRegionAnswerComponent');

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
        locationFinder: this.ctx.locationFinder,
        displayMap: this.ctx.displayMap,
        getAdminRegionPath: this.ctx.getAdminRegionPath,
        getSubAdminRegions: this.ctx.getSubAdminRegions,
        findAdminRegionByLatLng: this.ctx.findAdminRegionByLatLng,
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
