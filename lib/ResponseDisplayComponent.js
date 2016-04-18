var AdminRegionDisplayComponent, EntityDisplayComponent, H, ImageDisplayComponent, React, ResponseDisplayComponent, VisibilityCalculator, formUtils, moment,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

formUtils = require('./formUtils');

ImageDisplayComponent = require('./ImageDisplayComponent');

EntityDisplayComponent = require('./EntityDisplayComponent');

AdminRegionDisplayComponent = require('./AdminRegionDisplayComponent');

moment = require('moment');

VisibilityCalculator = require('./VisibilityCalculator');

module.exports = ResponseDisplayComponent = (function(superClass) {
  extend(ResponseDisplayComponent, superClass);

  ResponseDisplayComponent.propTypes = {
    form: React.PropTypes.object.isRequired,
    response: React.PropTypes.object.isRequired,
    formCtx: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string,
    T: React.PropTypes.func
  };

  ResponseDisplayComponent.childContextTypes = require('./formContextTypes');

  function ResponseDisplayComponent(props) {
    this.handleShowHistory = bind(this.handleShowHistory, this);
    this.handleHideHistory = bind(this.handleHideHistory, this);
    ResponseDisplayComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      showCompleteHistory: false
    };
  }

  ResponseDisplayComponent.prototype.getChildContext = function() {
    return this.props.formCtx;
  };

  ResponseDisplayComponent.prototype.handleLocationClick = function(location) {
    if (this.props.formCtx.displayMap) {
      return this.props.formCtx.displayMap(location);
    }
  };

  ResponseDisplayComponent.prototype.handleHideHistory = function() {
    return this.setState({
      showCompleteHistory: false
    });
  };

  ResponseDisplayComponent.prototype.handleShowHistory = function() {
    return this.setState({
      showCompleteHistory: true
    });
  };

  ResponseDisplayComponent.prototype.renderEvent = function(ev) {
    var eventType;
    eventType = (function() {
      switch (ev.type) {
        case "draft":
          return this.props.T("Drafted");
        case "submit":
          return this.props.T("Submitted");
        case "approve":
          return this.props.T("Approved");
        case "reject":
          return this.props.T("Rejected");
        case "edit":
          return this.props.T("Edited");
      }
    }).call(this);
    return H.div(null, eventType, " ", this.props.T("by"), " ", ev.by, " ", this.props.T("on"), " ", moment(ev.on).format('lll'), ev.message ? [": ", H.i(null, ev.message)] : void 0, ev.override ? H.span({
      className: "label label-warning"
    }, this.props.T("Admin Override")) : void 0);
  };

  ResponseDisplayComponent.prototype.renderHistory = function() {
    var contents, ev, events, i, lastEvent, len, ref;
    contents = [];
    events = this.props.response.events || [];
    if (this.state.showCompleteHistory) {
      ref = _.initial(events);
      for (i = 0, len = ref.length; i < len; i++) {
        ev = ref[i];
        contents.push(this.renderEvent(ev));
      }
    }
    lastEvent = _.last(events);
    if (lastEvent) {
      contents.push(this.renderEvent(lastEvent));
    }
    if (events.length > 1) {
      if (this.state.showCompleteHistory) {
        contents.push(H.a({
          style: {
            cursor: "pointer"
          },
          onClick: this.handleHideHistory
        }, this.props.T("Hide History")));
      } else {
        contents.push(H.a({
          style: {
            cursor: "pointer"
          },
          onClick: this.handleShowHistory
        }, this.props.T("Show History")));
      }
    }
    return H.div({
      key: "history"
    }, contents);
  };

  ResponseDisplayComponent.prototype.renderStatus = function() {
    var status;
    status = (function() {
      switch (this.props.response.status) {
        case "draft":
          return this.props.T("Draft");
        case "rejected":
          return this.props.T("Rejected");
        case "pending":
          return this.props.T("Pending");
        case "final":
          return this.props.T("Final");
      }
    }).call(this);
    return H.div({
      key: "status"
    }, this.props.T('Status'), ": ", H.b(null, status));
  };

  ResponseDisplayComponent.prototype.renderHeader = function() {
    return H.div({
      style: {
        paddingBottom: 10
      }
    }, H.div({
      key: "user"
    }, this.props.T('User'), ": ", H.b(null, this.props.response.user)), H.div({
      key: "code"
    }, this.props.T('Response Id'), ": ", H.b(null, this.props.response.code)), this.props.response && this.props.response.modified ? H.div({
      key: "date"
    }, this.props.T('Date'), ": ", H.b(null, moment(this.props.response.modified.on).format('lll'))) : void 0, this.renderStatus(), this.renderHistory());
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
        if (_.isObject(code)) {
          code = code.code;
        }
        siteType = (q.siteTypes ? q.siteTypes[0] : void 0) || "Water point";
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
        return React.createElement(EntityDisplayComponent, {
          formCtx: this.props.formCtx,
          entityCode: code,
          entityType: entityType
        });
      case "entity":
        return React.createElement(EntityDisplayComponent, {
          formCtx: this.props.formCtx,
          entityId: answer.value,
          entityType: q.entityType
        });
      case "admin_region":
        return React.createElement(AdminRegionDisplayComponent, {
          getAdminRegionPath: this.props.formCtx.getAdminRegionPath,
          value: answer.value
        });
    }
  };

  ResponseDisplayComponent.prototype.renderQuestion = function(q, dataId) {
    var answer, dataIds, rosterData;
    dataIds = dataId.split('.');
    if (dataIds.length === 1) {
      answer = this.props.response.data[dataId];
    } else {
      rosterData = this.props.response.data[dataIds[0]];
      answer = rosterData[dataIds[1]].data[dataIds[2]];
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

  ResponseDisplayComponent.prototype.collectItemsReferencingRoster = function(items, contents, rosterId) {
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

  ResponseDisplayComponent.prototype.renderItem = function(item, visibilityStructure, dataId) {
    var data, enty, index, items, referencedRoster;
    if (!visibilityStructure[dataId]) {
      return;
    }
    if (item._type === "Section" || item._type === "Group") {
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
            return _this.renderItem(item, visibilityStructure, item._id);
          };
        })(this))
      ];
    }
    if (item._type === "RosterMatrix" || item._type === "RosterGroup") {
      items = [];
      if (item.rosterId == null) {
        items = _.clone(item.contents);
        this.collectItemsReferencingRoster(items, this.props.form.design.contents, item._id);
      }
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
          if (item.rosterId != null) {
            referencedRoster = formUtils.findItem(this.props.form.design, item.rosterId);
            return H.tr(null, H.td({
              colSpan: 2
            }, H.span({
              style: {
                fontStyle: 'italic'
              }
            }, T("Data is stored in ") + referencedRoster.name[this.props.formCtx.locale])));
          } else {
            data = this.props.response.data[item._id];
            if (data != null) {
              results = [];
              for (index = i = 0, len = data.length; i < len; index = ++i) {
                enty = data[index];
                results.push([
                  H.tr(null, H.td({
                    colSpan: 2,
                    style: {
                      fontWeight: "bold"
                    }
                  }, (index + 1) + ".")), _.map(items, (function(_this) {
                    return function(childItem) {
                      dataId = item._id + "." + index + "." + childItem._id;
                      return _this.renderItem(childItem, visibilityStructure, dataId);
                    };
                  })(this))
                ]);
              }
              return results;
            }
          }
        }).call(this)
      ];
    }
    if (formUtils.isQuestion(item)) {
      return this.renderQuestion(item, dataId);
    }
  };

  ResponseDisplayComponent.prototype.renderContent = function(visibilityStructure) {
    return H.table({
      className: "table table-bordered"
    }, H.tbody(null, _.map(this.props.form.design.contents, (function(_this) {
      return function(item) {
        return _this.renderItem(item, visibilityStructure, item._id);
      };
    })(this))));
  };

  ResponseDisplayComponent.prototype.render = function() {
    var visibilityStructure;
    visibilityStructure = new VisibilityCalculator(this.props.form.design).createVisibilityStructure(this.props.response.data);
    return H.div(null, this.renderHeader(), this.renderContent(visibilityStructure));
  };

  return ResponseDisplayComponent;

})(React.Component);
