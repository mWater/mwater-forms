var Question, React, ReactDOM, SiteDisplayComponent, SiteQuestion, _, siteCodes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

siteCodes = require('./siteCodes');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

SiteDisplayComponent = require('./SiteDisplayComponent');

module.exports = SiteQuestion = (function(superClass) {
  extend(SiteQuestion, superClass);

  function SiteQuestion() {
    return SiteQuestion.__super__.constructor.apply(this, arguments);
  }

  SiteQuestion.prototype.renderAnswer = function(answerEl) {
    answerEl.html('<div class="input-group">\n  <input id="input" type="tel" class="form-control">\n  <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">' + this.T("Select") + '</button></span>\n</div>\n<div id="site_display"></div>');
    if (this.ctx.selectSite == null) {
      return this.$("#select").attr("disabled", "disabled");
    }
  };

  SiteQuestion.prototype.remove = function() {
    var siteDisplayElem;
    siteDisplayElem = this.$("#site_display")[0];
    if (siteDisplayElem) {
      ReactDOM.unmountComponentAtNode(siteDisplayElem);
    }
    return SiteQuestion.__super__.remove.apply(this, arguments);
  };

  SiteQuestion.prototype.updateAnswer = function(answerEl) {
    var siteDisplayElem, val;
    val = this.getAnswerValue();
    if (val) {
      val = val.code;
    }
    answerEl.find("input").val(val);
    siteDisplayElem = this.$("#site_display")[0];
    return ReactDOM.render(React.createElement(SiteDisplayComponent, {
      formCtx: this.ctx,
      siteCode: val,
      hideCode: true
    }), siteDisplayElem);
  };

  SiteQuestion.prototype.events = {
    'change': 'changed',
    'click #select': 'selectSite',
    "keydown #input": "inputKeydown"
  };

  SiteQuestion.prototype.changed = function() {
    return this.setAnswerValue({
      code: this.$("input").val()
    });
  };

  SiteQuestion.prototype.selectSite = function() {
    return this.ctx.selectSite(this.options.siteTypes, (function(_this) {
      return function(siteCode) {
        return _this.setAnswerValue({
          code: siteCode
        });
      };
    })(this));
  };

  SiteQuestion.prototype.validateInternal = function() {
    if (!this.$("input").val()) {
      return false;
    }
    if (siteCodes.isValid(this.$("input").val())) {
      return false;
    }
    return "Invalid Site";
  };

  return SiteQuestion;

})(Question);
