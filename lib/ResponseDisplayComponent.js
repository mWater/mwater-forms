var EntityDisplayComponent, EntityLoadingComponent, H, ImageDisplayComponent, React, ResponseDisplayComponent, formUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

formUtils = require('./formUtils');

ImageDisplayComponent = require('./ImageDisplayComponent');

EntityDisplayComponent = require('./EntityDisplayComponent');

EntityLoadingComponent = require('./EntityLoadingComponent');

module.exports = ResponseDisplayComponent = (function(superClass) {
  extend(ResponseDisplayComponent, superClass);

  function ResponseDisplayComponent() {
    return ResponseDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  ResponseDisplayComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    response: React.PropTypes.object.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string,
    T: React.PropTypes.func
  };

  ResponseDisplayComponent.prototype.handleLocationClick = function(location) {
    if (this.props.formCtx.displayMap) {
      return this.props.formCtx.displayMap(location);
    }
  };

  ResponseDisplayComponent.prototype.renderHeader = function() {
    return H.div(null, H.div({
      key: "user"
    }, this.props.T('User'), ": ", H.b(null, this.props.response.user)), H.div({
      key: "code"
    }, this.props.T('Response Id'), ": ", H.b(null, this.props.response.code)), H.div({
      key: "date"
    }, this.props.T('Date'), ": ", H.b(null, moment(this.props.response.modified.on).format('llll'))));
  };

  ResponseDisplayComponent.prototype.renderLocation = function(location) {
    if (location) {
      return H.div(null, H.a({
        onClick: this.handleLocationClick.bind(this, location),
        style: {
          cursor: "pointer"
        }
      }, location.latitude + "\u00B0 " + location.longitude + "\u00B0", location.accuracy ? "(+/-) " + location.accuracy + " m" : void 0));
    }
  };

  ResponseDisplayComponent.prototype.renderAnswer = function(q, answer) {
    var choice, code, label, specify, units, unitsStr, valueStr;
    if (!answer) {
      return null;
    }
    if (answer.alternate) {
      switch (answer.alternate) {
        case "na":
          return H.em(null, this.props.T("N/A"));
        case "dontknow":
          return H.em(null, this.props.T("Don't Know"));
      }
    }
    if (answer.value == null) {
      return null;
    }
    switch (formUtils.getAnswerType(q)) {
      case "text":
      case "number":
        return "" + answer.value;
      case "choice":
        choice = _.findWhere(q.choices, {
          id: answer.value
        });
        if (choice) {
          label = formUtils.localizeString(choice.label, 'en');
          if (answer.specify != null) {
            specify = answer.specify[answer.value];
          } else {
            specify = null;
          }
          return H.div(null, label, specify ? (": ", H.em(null, specify)) : void 0);
        } else {
          return H.span({
            className: "label label-danger"
          }, "Invalid Choice");
        }
        break;
      case "choices":
        return _.map(answer.value, (function(_this) {
          return function(v) {
            choice = _.findWhere(q.choices, {
              id: v
            });
            if (choice) {
              return H.div(null, formUtils.localizeString(choice.label, 'en'), (answer.specify != null) && answer.specify[v] ? (": ", H.em(null, answer.specify[v])) : void 0);
            } else {
              return H.div({
                className: "label label-danger"
              }, "Invalid Choice");
            }
          };
        })(this));
      case "date":
        if (answer.value.length <= 7) {
          return H.div(null, answer.value);
        } else if (answer.value.length <= 10) {
          return H.div(null, moment(answer.value).format("LL"));
        } else {
          return H.div(null, moment(answer.value).format("LLL"));
        }
        break;
      case "units":
        if (answer.value && (answer.value.quantity != null) && (answer.value.units != null)) {
          units = _.findWhere(q.units, {
            id: answer.value.units
          });
          valueStr = "" + answer.value.quantity;
          unitsStr = units ? formUtils.localizeString(units.label, 'en') : "(Invalid)";
          if (q.unitsPosition === "prefix") {
            return H.div(null, H.em(null, unitsStr), " ", valueStr);
          } else {
            return H.div(null, valueStr, " ", H.em(null, unitsStr));
          }
        }
        break;
      case "boolean":
        if (answer.value) {
          return this.props.T("True");
        } else {
          return this.props.T("False");
        }
      case "location":
        return this.renderLocation(answer.value);
      case "image":
        if (answer.value) {
          return React.createElement(ImageDisplayComponent, {
            formCtx: this.props.formCtx,
            id: answer.value.id
          });
        }
        break;
      case "images":
        return _.map(answer.value, (function(_this) {
          return function(img) {
            return React.createElement(ImageDisplayComponent, {
              formCtx: _this.props.formCtx,
              id: img.id
            });
          };
        })(this));
      case "texts":
        return _.map(answer.value, (function(_this) {
          return function(txt) {
            return H.div(null, txt);
          };
        })(this));
      case "site":
        code = answer.value;
        if (code.code) {
          code = code.code;
        }
        return H.div(null, this.props.T("Site"), ": ", H.b(null, code));
      case "entity":
        return React.createElement(EntityLoadingComponent, {
          formCtx: this.props.formCtx,
          entityId: answer.value,
          entityType: q.entityType,
          T: this.props.T
        }, React.createElement(EntityDisplayComponent, {
          formCtx: this.props.formCtx,
          propertyIds: q.displayProperties,
          locale: this.props.locale,
          T: this.props.T
        }));
    }
  };

  ResponseDisplayComponent.prototype.renderQuestion = function(q) {
    var answer;
    answer = this.props.response.data[q._id];
    return H.tr({
      key: q._id
    }, H.td({
      key: "name",
      style: {
        width: "50%"
      }
    }, formUtils.localizeString(q.text, this.props.locale)), H.td({
      key: "value"
    }, this.renderAnswer(q, answer), answer && answer.timestamp ? H.div(null, this.props.T('Answered'), ": ", moment(answer.timestamp).format('llll')) : void 0, answer && answer.location ? this.renderLocation(answer.location) : void 0));
  };

  ResponseDisplayComponent.prototype.renderItem = function(item) {
    if (item._type === "Section") {
      return [
        H.tr({
          key: item._id
        }, H.td({
          colSpan: 2,
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale))), _.map(item.contents, (function(_this) {
          return function(item) {
            return _this.renderItem(item);
          };
        })(this))
      ];
    }
    if (formUtils.isQuestion(item)) {
      return this.renderQuestion(item);
    }
  };

  ResponseDisplayComponent.prototype.renderContent = function() {
    return H.table({
      className: "table table-bordered"
    }, H.tbody(null, _.map(this.props.form.design.contents, (function(_this) {
      return function(item) {
        return _this.renderItem(item);
      };
    })(this))));
  };

  ResponseDisplayComponent.prototype.render = function() {
    return H.div(null, this.renderHeader(), this.renderContent());
  };

  return ResponseDisplayComponent;

})(React.Component);
