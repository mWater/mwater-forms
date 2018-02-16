var AdminRegionDisplayComponent, AquagenxCBTDisplayComponent, AsyncLoadComponent, EntityDisplayComponent, H, ImageDisplayComponent, PropTypes, R, React, ResponseAnswersComponent, ResponseRow, VisibilityCalculator, _, ezlocalize, formUtils, moment, ui,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

moment = require('moment');

ezlocalize = require('ez-localize');

ui = require('react-library/lib/bootstrap');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

VisibilityCalculator = require('./VisibilityCalculator');

ResponseRow = require('./ResponseRow');

ImageDisplayComponent = require('./ImageDisplayComponent');

EntityDisplayComponent = require('./EntityDisplayComponent');

AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');

AquagenxCBTDisplayComponent = require('./answers/AquagenxCBTDisplayComponent');

module.exports = ResponseAnswersComponent = (function(superClass) {
  extend(ResponseAnswersComponent, superClass);

  function ResponseAnswersComponent() {
    return ResponseAnswersComponent.__super__.constructor.apply(this, arguments);
  }

  ResponseAnswersComponent.propTypes = {
    formDesign: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    hideEmptyAnswers: PropTypes.bool,
    locale: PropTypes.string,
    T: PropTypes.func.isRequired,
    formCtx: PropTypes.object.isRequired,
    prevData: PropTypes.object,
    showPrevAnswers: PropTypes.bool,
    highlightChanges: PropTypes.bool,
    hideUnchangedAnswers: PropTypes.bool,
    showChangedLink: PropTypes.bool,
    onChangedLinkClick: PropTypes.func,
    onCompleteHistoryLinkClick: PropTypes.func
  };

  ResponseAnswersComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return !_.isEqual(newProps.formDesign, oldProps.formDesign) || !_.isEqual(newProps.data, oldProps.data);
  };

  ResponseAnswersComponent.prototype.load = function(props, prevProps, callback) {
    var responseRow;
    responseRow = new ResponseRow({
      responseData: props.data,
      formDesign: props.formDesign,
      getEntityById: props.formCtx.getEntityById,
      getEntityByCode: props.formCtx.getEntityByCode
    });
    return new VisibilityCalculator(props.formDesign).createVisibilityStructure(props.data, responseRow, (function(_this) {
      return function(error, visibilityStructure) {
        return callback({
          error: error,
          visibilityStructure: visibilityStructure
        });
      };
    })(this));
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
    var choice, choiceId, code, entityType, i, item, label, len, ref, siteType, specify, target, units, unitsStr, valueStr;
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
        if (answer.value && answer.value.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
          target = window.cordova != null ? "_system" : "_blank";
          return H.a({
            href: answer.value,
            target: target
          }, answer.value);
        }
        return answer.value;
      case "number":
        return "" + answer.value;
      case "choice":
        choice = _.findWhere(q.choices, {
          id: answer.value
        });
        if (choice) {
          label = formUtils.localizeString(choice.label, this.props.locale);
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
              return H.div(null, formUtils.localizeString(choice.label, _this.props.locale), (answer.specify != null) && answer.specify[v] ? (": ", H.em(null, answer.specify[v])) : void 0);
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
          unitsStr = units ? formUtils.localizeString(units.label, this.props.locale) : "(Invalid)";
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
            image: answer.value,
            imageManager: this.props.formCtx.imageManager,
            T: this.props.T
          });
        }
        break;
      case "images":
        return _.map(answer.value, (function(_this) {
          return function(img) {
            return R(ImageDisplayComponent, {
              image: img,
              imageManager: _this.props.formCtx.imageManager,
              T: _this.props.T
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
          renderEntityView: this.props.formCtx.renderEntitySummaryView,
          T: this.props.T
        });
      case "entity":
        return R(EntityDisplayComponent, {
          entityId: answer.value,
          entityType: q.entityType,
          getEntityById: this.props.formCtx.getEntityById,
          renderEntityView: this.props.formCtx.renderEntitySummaryView,
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
              return H.div(null, formUtils.localizeString(choice.label, this.props.locale));
            } else {
              return H.span({
                className: "label label-danger"
              }, "Invalid Choice");
            }
          }
        }
        break;
      case "aquagenx_cbt":
        return R(AquagenxCBTDisplayComponent, {
          value: answer.value,
          questionId: q._id,
          imageManager: this.props.formCtx.imageManager
        });
    }
  };

  ResponseAnswersComponent.prototype.renderMatrixAnswer = function(q, answer, prevAnswer) {
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
          if (this.props.showPrevAnswers && prevAnswer) {
            choiceId = prevAnswer.value[item.id];
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
        }
      }
      return contents;
    } else {
      return null;
    }
  };

  ResponseAnswersComponent.prototype.renderQuestion = function(q, dataId) {
    var answer, dataIds, matrixAnswer, prevAnswer, prevRosterData, ref, ref1, rosterData, trProps;
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
    prevAnswer = null;
    trProps = {
      key: dataId
    };
    if (this.props.prevData) {
      if (dataIds.length === 1) {
        prevAnswer = this.props.prevData.data[dataId];
      } else {
        prevRosterData = this.props.prevData.data[dataIds[0]];
        if (prevRosterData != null) {
          if (prevRosterData.value != null) {
            prevRosterData = prevRosterData.value;
            prevAnswer = (ref = prevRosterData[dataIds[1]]) != null ? ref[dataIds[2]] : void 0;
          } else {
            prevAnswer = (ref1 = prevRosterData[dataIds[1]]) != null ? ref1.data[dataIds[2]] : void 0;
          }
        }
      }
    }
    matrixAnswer = this.renderMatrixAnswer(q, answer, prevAnswer);
    if (!prevAnswer && ((answer != null ? answer.value : void 0) == null) && this.props.hideUnchangedAnswers) {
      return null;
    }
    if (!_.isEqual(prevAnswer != null ? prevAnswer.value : void 0, answer != null ? answer.value : void 0) || !_.isEqual(prevAnswer != null ? prevAnswer.specify : void 0, answer != null ? answer.specify : void 0)) {
      if (this.props.highlightChanges) {
        trProps['style'] = {
          background: '#ffd'
        };
      }
    } else {
      if (this.props.hideUnchangedAnswers) {
        return null;
      }
    }
    return [
      H.tr(trProps, H.td({
        key: "name",
        style: {
          width: "50%"
        }
      }, formUtils.localizeString(q.text, this.props.locale)), H.td({
        key: "value"
      }, H.div(null, matrixAnswer == null ? this.renderAnswer(q, answer) : void 0, answer && answer.timestamp ? (this.props.T('Answered'), ": ", moment(answer.timestamp).format('llll')) : void 0, answer && answer.location ? this.renderLocation(answer.location) : void 0, (prevAnswer != null) && !_.isEqual(prevAnswer.value, answer != null ? answer.value : void 0) && this.props.showChangedLink ? H.a({
        style: {
          float: 'right',
          display: 'inline-block',
          cursor: 'pointer',
          fontSize: 9
        },
        onClick: this.props.onChangedLinkClick,
        key: 'view_change'
      }, R(ui.Icon, {
        id: "glyphicon-pencil"
      }), " ", T("Edited")) : void 0)), this.props.showPrevAnswers && this.props.prevData ? H.td({
        key: "prevValue"
      }, (prevAnswer != null) && !_.isEqual(prevAnswer.value, answer != null ? answer.value : void 0) && this.props.onCompleteHistoryLinkClick ? H.a({
        style: {
          float: 'right',
          display: 'inline-block',
          cursor: 'pointer',
          fontSize: 9
        },
        onClick: this.props.onCompleteHistoryLinkClick,
        key: 'view_history'
      }, T("Show Changes")) : void 0, typeof prevMatrixAnswer === "undefined" || prevMatrixAnswer === null ? this.renderAnswer(q, prevAnswer) : void 0, prevAnswer && prevAnswer.timestamp ? H.div(null, this.props.T('Answered'), ": ", moment(prevAnswer.timestamp).format('llll')) : void 0, prevAnswer && prevAnswer.location ? this.renderLocation(prevAnswer.location) : void 0) : void 0), matrixAnswer
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
    var answer, colspan, column, contents, data, entry, i, index, itemValue, items, j, len, len1, ref, ref1, referencedRoster, rowItem, rows;
    if (!visibilityStructure[dataId]) {
      return;
    }
    colspan = (this.props.showPrevAnswers && this.props.prevData) ? 3 : 2;
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
          colSpan: colspan,
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
        referencedRoster = formUtils.findItem(this.props.formDesign, item.rosterId);
        return H.tr(null, H.td({
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale)), H.td({
          colSpan: colspan - 1
        }, H.span({
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
      this.collectItemsReferencingRoster(items, this.props.formDesign.contents, item._id);
      return [
        H.tr({
          key: item._id
        }, H.td({
          colSpan: colspan,
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
                    colSpan: colspan,
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
      if ((answer != null ? answer.value : void 0) != null) {
        rows = [];
        rows.push(H.tr({
          key: item._id
        }, H.td({
          colSpan: colspan,
          style: {
            fontWeight: "bold"
          }
        }, formUtils.localizeString(item.name, this.props.locale))));
        ref = item.items;
        for (i = 0, len = ref.length; i < len; i++) {
          rowItem = ref[i];
          itemValue = answer.value[rowItem.id];
          if (itemValue) {
            rows.push(H.tr(null, H.td({
              colSpan: colspan,
              style: {
                fontStyle: 'italic'
              }
            }, formUtils.localizeString(rowItem.label, this.props.locale))));
            ref1 = item.columns;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              column = ref1[j];
              if (itemValue[column._id]) {
                dataId = item._id + "." + rowItem.id + "." + column._id;
                rows.push(this.renderItem(column, visibilityStructure, dataId));
              }
            }
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
    if (this.state.error) {
      return H.div({
        className: "alert alert-danger"
      }, this.state.error.message);
    }
    if (!this.state.visibilityStructure) {
      return H.div(null, "Loading...");
    }
    return H.table({
      className: "table table-bordered table-condensed",
      style: {
        marginBottom: 0
      }
    }, H.thead(null, H.tr(null, H.th(null, "Question"), H.th(null, "Answer"), this.props.showPrevAnswers ? H.th(null, "Original Answer") : void 0)), H.tbody(null, _.map(this.props.formDesign.contents, (function(_this) {
      return function(item) {
        return _this.renderItem(item, _this.state.visibilityStructure, item._id);
      };
    })(this))));
  };

  return ResponseAnswersComponent;

})(AsyncLoadComponent);
