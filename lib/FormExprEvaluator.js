var ExprEvaluator, FormExprEvaluator, _, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

module.exports = FormExprEvaluator = (function() {
  function FormExprEvaluator(formDesign) {
    if (formDesign) {
      this.itemMap = _.indexBy(formUtils.allItems(formDesign), "_id");
    } else {
      this.itemMap = {};
    }
  }

  FormExprEvaluator.prototype.renderString = function(localizedStr, exprs, data, parentData, locale) {
    var str;
    if (locale == null) {
      locale = "en";
    }
    str = formUtils.localizeString(localizedStr, locale);
    str = str.replace(/\{(\d+)\}/g, (function(_this) {
      return function(match, index) {
        index = parseInt(index);
        if (exprs != null ? exprs[index] : void 0) {
          return _this.evaluateExpr(exprs[index], data, parentData, locale) || "";
        }
        return "";
      };
    })(this));
    return str;
  };

  FormExprEvaluator.prototype.evaluateExpr = function(expr, data, parentData, locale) {
    var row;
    row = this.createRow(data, parentData, locale);
    return new ExprEvaluator().evaluate(expr, row);
  };

  FormExprEvaluator.prototype.createRow = function(data, parentData, locale) {
    return {
      getPrimaryKey: function() {
        throw new Error("Not implemented");
      },
      getField: (function(_this) {
        return function(columnId) {
          var choice, item, match, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, units, value;
          if (columnId === "response") {
            return _this.createRow(parentData, null);
          }
          match = columnId.match(/^data:(.+):value$/);
          if (match) {
            item = _this.itemMap[match[1]];
            if (!item) {
              return null;
            }
            if (item._type === "LocationQuestion" && ((ref = data[match[1]]) != null ? ref.value : void 0)) {
              return {
                type: "Point",
                coordinates: [data[match[1]].value.longitude, data[match[1]].value.latitude]
              };
            }
            if ((ref1 = item._type) === "EntityQuestion" || ref1 === "SiteQuestion") {
              return null;
            }
            value = (ref2 = data[match[1]]) != null ? ref2.value : void 0;
            if (formUtils.getAnswerType(item) === "choice") {
              choice = _.findWhere(item.choices, {
                id: value
              });
              if (choice) {
                return formUtils.localizeString(choice.label, locale);
              } else {
                return "???";
              }
            }
            if (formUtils.getAnswerType(item) === "choices") {
              return _.map(value, function(v) {
                choice = _.findWhere(item.choices, {
                  id: v
                });
                if (choice) {
                  return formUtils.localizeString(choice.label, locale);
                } else {
                  return "???";
                }
              }).join(", ");
            }
            return value;
          }
          match = columnId.match(/^data:(.+):value:accuracy$/);
          if (match) {
            return (ref3 = data[match[1]]) != null ? (ref4 = ref3.value) != null ? ref4.accuracy : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:altitude$/);
          if (match) {
            return (ref5 = data[match[1]]) != null ? (ref6 = ref5.value) != null ? ref6.altitude : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:quantity$/);
          if (match) {
            return (ref7 = data[match[1]]) != null ? (ref8 = ref7.value) != null ? ref8.quantity : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:units$/);
          if (match) {
            units = (ref9 = data[match[1]]) != null ? (ref10 = ref9.value) != null ? ref10.units : void 0 : void 0;
            item = _this.itemMap[match[1]];
            if (units && item) {
              units = _.findWhere(item.units, {
                id: units
              });
              if (units) {
                return formUtils.localizeString(units.label, locale);
              } else {
                return "???";
              }
            }
            return null;
          }
          match = columnId.match(/^data:(.+):timestamp$/);
          if (match) {
            return (ref11 = data[match[1]]) != null ? ref11.timestamp : void 0;
          }
          match = columnId.match(/^data:(.+):location$/);
          if (match) {
            if (data[match[1]].location) {
              return {
                type: "Point",
                coordinates: [data[match[1]].location.longitude, data[match[1]].location.latitude]
              };
            }
            return null;
          }
          match = columnId.match(/^data:(.+):location:accuracy$/);
          if (match) {
            return (ref12 = data[match[1]]) != null ? (ref13 = ref12.location) != null ? ref13.accuracy : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):location:altitude$/);
          if (match) {
            return (ref14 = data[match[1]]) != null ? (ref15 = ref14.location) != null ? ref15.altitude : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):na$/);
          if (match) {
            return ((ref16 = data[match[1]]) != null ? ref16.alternate : void 0) === "na";
          }
          match = columnId.match(/^data:(.+):dontknow$/);
          if (match) {
            return ((ref17 = data[match[1]]) != null ? ref17.alternate : void 0) === "dontknow";
          }
          return null;
        };
      })(this)
    };
  };

  return FormExprEvaluator;

})();
