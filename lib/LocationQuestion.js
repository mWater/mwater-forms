var LocationQuestion, LocationView, Question,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

LocationView = require('./LocationView');

module.exports = LocationQuestion = (function(superClass) {
  extend(LocationQuestion, superClass);

  function LocationQuestion() {
    return LocationQuestion.__super__.constructor.apply(this, arguments);
  }

  LocationQuestion.prototype.updateAnswer = function(answerEl) {
    var loc;
    if (this.locationView != null) {
      this.locationView.remove();
    }
    loc = this.getAnswerValue();
    this.locationView = new LocationView({
      loc: loc,
      readonly: this.options.readonly,
      disableMap: this.ctx.displayMap == null,
      locationFinder: this.ctx.locationFinder,
      currentPositionFinder: this.ctx.currentPositionFinder,
      T: this.T
    });
    this.locationView.on('map', (function(_this) {
      return function(loc) {
        if (_this.ctx.displayMap != null) {
          return _this.ctx.displayMap(loc, function(newLoc) {
            return _this.setAnswerValue(newLoc);
          });
        }
      };
    })(this));
    this.locationView.on("locationset", (function(_this) {
      return function(loc) {
        if (loc != null) {
          return _this.setAnswerValue(loc);
        } else {
          return _this.setAnswerValue(null);
        }
      };
    })(this));
    return answerEl.append(this.locationView.el);
  };

  LocationQuestion.prototype.remove = function() {
    this.locationView.remove();
    return LocationQuestion.__super__.remove.call(this);
  };

  return LocationQuestion;

})(Question);
