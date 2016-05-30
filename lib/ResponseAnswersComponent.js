var AdminRegionDisplayComponent, EntityDisplayComponent, H, ImageDisplayComponent, R, React, ResponseAnswersComponent, VisibilityCalculator, ezlocalize, formUtils, moment,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

moment = require('moment');

ezlocalize = require('ez-localize');

VisibilityCalculator = require('./VisibilityCalculator');

ImageDisplayComponent = require('./ImageDisplayComponent');

EntityDisplayComponent = require('./EntityDisplayComponent');

AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');

module.exports = ResponseAnswersComponent = (function(superClass) {
  extend(ResponseAnswersComponent, superClass);

  function ResponseAnswersComponent() {
    return ResponseAnswersComponent.__super__.constructor.apply(this, arguments);
  }

  ResponseAnswersComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    hideEmptyAnswers: React.PropTypes.bool,
    locale: React.PropTypes.string,
    T: React.PropTypes.func.isRequired,
    formCtx: React.PropTypes.object.isRequired
  };

  ResponseAnswersComponent.prototype.handleLocationClick = function(location) {
    if (this.props.formCtx.displayMap) {
      return this.props.formCtx.displayMap(location);
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
    var choice, choiceId, code, entityType, i, item, label, len, ref, siteType, specify, units, unitsStr, valueStr;
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
            id: answer.value.id,
            imageManager: this.props.formCtx.imageManager
          });
        }
        break;
      case "images":
        return _.map(answer.value, (function(_this) {
          return function(img) {
            return R(ImageDisplayComponent, {
              id: img.id,
              imageManager: _this.props.formCtx.imageManager
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
          entityType: entityType,
          getEntityByCode: this.props.formCtx.getEntityByCode,
          renderEntitySummaryView: this.props.formCtx.renderEntitySummaryView,
          T: this.props.T
        });
      case "entity":
        return R(EntityDisplayComponent, {
          entityId: answer.value,
          entityType: q.entityType,
          getEntityById: this.props.formCtx.getEntityById,
          renderEntitySummaryView: this.props.formCtx.renderEntitySummaryView,
          T: this.props.T
        });
      case "admin_region":
        return R(AdminRegionDisplayComponent, {
          getAdminRegionPath: this.props.formCtx.getAdminRegionPath,
          value: answer.value,
          T: this.props.T
        });
      case "items_choices":
        ref = q.items;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          choiceId = answer.value[item.id];
          if (choiceId != null) {
            choice = _.findWhere(q.choices, {
              id: choiceId
            });
            if (choice != null) {
              return H.div(null, formUtils.localizeString(choice.label, 'en'));
            } else {
              return H.span({
                className: "label label-danger"
              }, "Invalid Choice");
            }
          }
        }
    }
  };

  ResponseAnswersComponent.prototype.renderMatrixAnswer = function(q, answer) {
    var choice, choiceId, contents, i, item, itemTd, len, ref;
    if (!answer) {
      return null;
    }
    if (answer.alternate) {
      return null;
    }
    if (answer.value == null) {
      return null;
    }
    if (formUtils.getAnswerType(q) === "items_choices") {
      contents = [];
      ref = q.items;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        itemTd = H.td({
          style: {
            textAlign: "center"
          }
        }, formUtils.localizeString(item.label, this.props.locale));
        choiceId = answer.value[item.id];
        if (choiceId != null) {
          choice = _.findWhere(q.choices, {
            id: choiceId
          });
          if (choice != null) {
            contents.push(H.tr(null, itemTd, H.td(null, formUtils.localizeString(choice.label, this.props.locale))));
          } else {
            contents.push(H.tr(null, itemTd, H.td(null, H.span({
              className: "label label-danger"
            }, "Invalid Choice"))));
          }
        }
      }
      return contents;
    } else {
      return null;
    }
  };

  ResponseAnswersComponent.prototype.renderQuestion = function(q, dataId) {
    var answer, dataIds, matrixAnswer, rosterData;
    dataIds = dataId.split('.');
    if (dataIds.length === 1) {
      answer = this.props.data[dataId];
    } else {
      rosterData = this.props.data[dataIds[0]];
      if (rosterData.value != null) {
        rosterData = rosterData.value;
        answer = rosterData[dataIds[1]][dataIds[2]];
      } else {
        answer = rosterData[dataIds[1]].data[dataIds[2]];
      }
    }
    if (this.props.hideEmptyAnswers && ((answer != null ? answer.value : void 0) == null) && !(answer != null ? answer.alternate : void 0)) {
      return null;
    }
    matrixAnswer = this.renderMatrixAnswer(q, answer);
    return [
      H.tr({
        key: dataId
      }, H.td({
        key: "name",
        style: {
          width: "50%"
        }
      }, formUtils.localizeString(q.text, this.props.locale)), H.td({
        key: "value"
      }, matrixAnswer == null ? this.renderAnswer(q, answer) : void 0, answer && answer.timestamp ? H.div(null, this.props.T('Answered'), ": ", moment(answer.timestamp).format('llll')) : void 0, answer && answer.location ? this.renderLocation(answer.location) : void 0)), matrixAnswer
    ];
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
    var answer, column, columnId, columnValue, contents, data, entry, index, itemValue, items, matrixItem, maxtrixItemId, ref, referencedRoster, rows;
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
    if (item._type === "MatrixQuestion") {
      answer = this.props.data[dataId];
      if (answer != null) {
        rows = [];
        rows.push(H.tr({
          key: item._id
        }, H.td({
          colSpan: 2,
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale))));
        ref = answer.value;
        for (maxtrixItemId in ref) {
          itemValue = ref[maxtrixItemId];
          matrixItem = _.findWhere(item.items, {
            id: maxtrixItemId
          });
          rows.push(H.tr(null, H.td({
            colSpan: 2,
            style: {
              fontStyle: 'italic'
            }
          }, formUtils.localizeString(matrixItem.label, this.props.locale))));
          for (columnId in itemValue) {
            columnValue = itemValue[columnId];
            column = _.findWhere(item.columns, {
              _id: columnId
            });
            dataId = item._id + "." + maxtrixItemId + "." + columnId;
            rows.push(this.renderItem(column, visibilityStructure, dataId));
          }
        }
        return rows;
      } else {
        return null;
      }
    }
    if (formUtils.isQuestion(item)) {
      return this.renderQuestion(item, dataId);
    }
  };

  ResponseAnswersComponent.prototype.render = function() {
    var visibilityStructure;
    visibilityStructure = new VisibilityCalculator(this.props.form.design).createVisibilityStructure(this.props.data);
    return H.table({
      className: "table table-bordered table-condensed"
    }, H.tbody(null, _.map(this.props.form.design.contents, (function(_this) {
      return function(item) {
        return _this.renderItem(item, visibilityStructure, item._id);
      };
    })(this))));
  };

  return ResponseAnswersComponent;

})(React.Component);
