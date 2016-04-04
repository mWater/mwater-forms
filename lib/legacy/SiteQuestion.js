var EntityDisplayComponent, Question, React, ReactDOM, SiteQuestion, _, siteCodes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

siteCodes = require('../siteCodes');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

EntityDisplayComponent = require('../EntityDisplayComponent');

module.exports = SiteQuestion = (function(superClass) {
  extend(SiteQuestion, superClass);

  function SiteQuestion() {
    return SiteQuestion.__super__.constructor.apply(this, arguments);
  }

  SiteQuestion.prototype.renderAnswer = function(answerEl) {
    answerEl.html('<div class="input-group">\n  <input id="input" type="tel" class="form-control">\n  <span class="input-group-btn"><button class="btn btn-default" id="select" type="button">' + this.T("Select") + '</button></span>\n</div>\n<br/>\n<div id="site_display"></div>');
    if (this.ctx.selectEntity == null) {
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
    var entityType, siteDisplayElem, siteType, val;
    val = this.getAnswerValue();
    if (val) {
      val = val.code;
    }
    answerEl.find("input").val(val);
    siteDisplayElem = this.$("#site_display")[0];
    if (siteDisplayElem) {
      siteType = (this.options.siteTypes ? this.options.siteTypes[0] : void 0) || "Water point";
      entityType = siteType.toLowerCase().replace(/ /g, "_");
      return ReactDOM.render(React.createElement(EntityDisplayComponent, {
        formCtx: this.ctx,
        displayInWell: true,
        entityCode: val,
        entityType: entityType
      }), siteDisplayElem);
    }
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
    var entityType, siteType;
    siteType = (this.options.siteTypes ? this.options.siteTypes[0] : void 0) || "Water point";
    entityType = siteType.toLowerCase().replace(/ /g, "_");
    return this.ctx.selectEntity({
      entityType: entityType,
      callback: (function(_this) {
        return function(entityId) {
          return _this.ctx.getEntityById(entityType, entityId, function(entity) {
            _this.setAnswerValue({
              code: entity.code
            });
            return _this.validate();
          });
        };
      })(this)
    });
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
