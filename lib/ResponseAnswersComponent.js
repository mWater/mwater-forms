var AdminRegionDisplayComponent, EntityDisplayComponent, H, ImageDisplayComponent, R, React, ResponseAnswersComponent, VisibilityCalculator, ezlocalize, formUtils, moment,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

ImageDisplayComponent = require('./ImageDisplayComponent');

EntityDisplayComponent = require('./EntityDisplayComponent');

AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');

moment = require('moment');

ezlocalize = require('ez-localize');

VisibilityCalculator = require('./VisibilityCalculator');

module.exports = ResponseAnswersComponent = (function(superClass) {
  extend(ResponseAnswersComponent, superClass);

  function ResponseAnswersComponent() {
    return ResponseAnswersComponent.__super__.constructor.apply(this, arguments);
  }

  ResponseAnswersComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string,
    hideEmptyAnswers: React.PropTypes.bool,
    getAdminRegionPath: React.PropTypes.func.isRequired,
    T: React.PropTypes.func.isRequired,
    displayMap: React.PropTypes.func
  };

  ResponseAnswersComponent.prototype.handleLocationClick = function(location) {
    if (this.props.displayMap) {
      return this.props.displayMap(location);
    }
  };

  ResponseAnswersComponent.prototype.renderLocation = function(location) {
    if (location) {
      return H.div(null, H.a({
        onClick: this.handleLocationClick.bind(this, location),
        style: {
          cursor: "pointer"
        }
      }, location.latitude + "\u00B0 " + location.longitude + "\u00B0", location.accuracy ? "(+/-) " + location.accuracy + " m" : void 0));
    }
  };

  ResponseAnswersComponent.prototype.renderAnswer = function(q, answer) {
    var choice, code, entityType, label, siteType, specify, units, unitsStr, valueStr;
    if (!answer) {
      return null;
    }
    if (answer.alternate) {
      switch (answer.alternate) {
        case "na":
          return H.em(null, this.props.T("Not Applicable"));
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
          return R(ImageDisplayComponent, {
            id: answer.value.id
          });
        }
        break;
      case "images":
        return _.map(answer.value, (function(_this) {
          return function(img) {
            return R(ImageDisplayComponent, {
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
        if (_.isObject(code)) {
          code = code.code;
        }
        siteType = (q.siteTypes ? q.siteTypes[0] : void 0) || "Water point";
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
        return R(EntityDisplayComponent, {
          entityCode: code,
          entityType: entityType
        });
      case "entity":
        return R(EntityDisplayComponent, {
          entityId: answer.value,
          entityType: q.entityType
        });
      case "admin_region":
        return R(AdminRegionDisplayComponent, {
          getAdminRegionPath: this.props.getAdminRegionPath,
          value: answer.value
        });
    }
  };

  ResponseAnswersComponent.prototype.renderQuestion = function(q, dataId) {
    var answer, dataIds, rosterData;
    dataIds = dataId.split('.');
    if (dataIds.length === 1) {
      answer = this.props.data[dataId];
    } else {
      rosterData = this.props.data[dataIds[0]];
      answer = rosterData[dataIds[1]].data[dataIds[2]];
    }
    if (this.props.hideEmptyAnswers && ((answer != null ? answer.value : void 0) == null) && !(answer != null ? answer.alternate : void 0)) {
      return null;
    }
    return H.tr({
      key: dataId
    }, H.td({
      key: "name",
      style: {
        width: "50%"
      }
    }, formUtils.localizeString(q.text, this.props.locale)), H.td({
      key: "value"
    }, this.renderAnswer(q, answer), answer && answer.timestamp ? H.div(null, this.props.T('Answered'), ": ", moment(answer.timestamp).format('llll')) : void 0, answer && answer.location ? this.renderLocation(answer.location) : void 0));
  };

  ResponseAnswersComponent.prototype.collectItemsReferencingRoster = function(items, contents, rosterId) {
    var i, len, otherItem, results;
    results = [];
    for (i = 0, len = contents.length; i < len; i++) {
      otherItem = contents[i];
      if (otherItem._type === 'Group' || otherItem._type === 'Section') {
        this.collectItemsReferencingRoster(items, otherItem.contents, rosterId);
      }
      if (otherItem.rosterId === rosterId) {
        results.push(items.push.apply(items, otherItem.contents));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  ResponseAnswersComponent.prototype.renderItem = function(item, visibilityStructure, dataId) {
    var contents, data, entry, index, items, referencedRoster;
    if (!visibilityStructure[dataId]) {
      return;
    }
    if (item._type === "Section" || item._type === "Group") {
      contents = _.map(item.contents, (function(_this) {
        return function(item) {
          return _this.renderItem(item, visibilityStructure, item._id);
        };
      })(this));
      contents = _.compact(contents);
      if (contents.length === 0) {
        return null;
      }
      return [
        H.tr({
          key: item._id
        }, H.td({
          colSpan: 2,
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale))), contents
      ];
    }
    if (item._type === "RosterMatrix" || item._type === "RosterGroup") {
      items = [];
      if (item.rosterId != null) {
        if (this.props.hideEmptyAnswers) {
          return null;
        }
        referencedRoster = formUtils.findItem(this.props.form.design, item.rosterId);
        return H.tr(null, H.td({
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale)), H.td(null, H.span({
          style: {
            fontStyle: 'italic'
          }
        }, this.props.T("Data is stored in {0}", formUtils.localizeString(referencedRoster.name, this.props.locale)))));
      }
      data = this.props.data[item._id];
      if ((!data || data.length === 0) && this.props.hideEmptyAnswers) {
        return null;
      }
      items = _.clone(item.contents);
      this.collectItemsReferencingRoster(items, this.props.form.design.contents, item._id);
      return [
        H.tr({
          key: item._id
        }, H.td({
          colSpan: 2,
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale))), (function() {
          var i, len, results;
          if (data != null) {
            results = [];
            for (index = i = 0, len = data.length; i < len; index = ++i) {
              entry = data[index];
              contents = _.map(items, (function(_this) {
                return function(childItem) {
                  dataId = item._id + "." + index + "." + childItem._id;
                  return _this.renderItem(childItem, visibilityStructure, dataId);
                };
              })(this));
              contents = _.compact(contents);
              if (contents.length === 0) {
                results.push(null);
              } else {
                results.push([
                  H.tr(null, H.td({
                    colSpan: 2,
                    style: {
                      fontWeight: "bold"
                    }
                  }, (index + 1) + ".")), contents
                ]);
              }
            }
            return results;
          }
        }).call(this)
      ];
    }
    if (formUtils.isQuestion(item)) {
      return this.renderQuestion(item, dataId);
    }
  };

  ResponseAnswersComponent.prototype.render = function() {
    var visibilityStructure;
    visibilityStructure = new VisibilityCalculator(this.props.form.design).createVisibilityStructure(this.props.data);
    return H.table({
      className: "table table-bordered"
    }, H.tbody(null, _.map(this.props.form.design.contents, (function(_this) {
      return function(item) {
        return _this.renderItem(item, visibilityStructure, item._id);
      };
    })(this))));
  };

  return ResponseAnswersComponent;

})(React.Component);
