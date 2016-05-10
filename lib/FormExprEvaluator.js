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
          return _this.evaluateExpr(exprs[index], data, parentData) || "";
        }
        return "";
      };
    })(this));
    return str;
  };

  FormExprEvaluator.prototype.evaluateExpr = function(expr, data, parentData) {
    var row;
    row = this.createRow(data, parentData);
    return new ExprEvaluator().evaluate(expr, row);
  };

  FormExprEvaluator.prototype.createRow = function(data, parentData) {
    return {
      getPrimaryKey: function() {
        throw new Error("Not implemented");
      },
      getField: (function(_this) {
        return function(columnId) {
          var match, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
          if (columnId === "response") {
            return _this.createRow(parentData, null);
          }
          match = columnId.match(/^data:(.+):value$/);
          if (match) {
            if (((ref = _this.itemMap[match[1]]) != null ? ref._type : void 0) === "LocationQuestion" && ((ref1 = data[match[1]]) != null ? ref1.value : void 0)) {
              return {
                type: "Point",
                coordinates: [data[match[1]].value.longitude, data[match[1]].value.latitude]
              };
            }
            if ((ref2 = (ref3 = _this.itemMap[match[1]]) != null ? ref3._type : void 0) === "EntityQuestion" || ref2 === "SiteQuestion") {
              return null;
            }
            return (ref4 = data[match[1]]) != null ? ref4.value : void 0;
          }
          match = columnId.match(/^data:(.+):value:accuracy$/);
          if (match) {
            return (ref5 = data[match[1]]) != null ? (ref6 = ref5.value) != null ? ref6.accuracy : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:altitude$/);
          if (match) {
            return (ref7 = data[match[1]]) != null ? (ref8 = ref7.value) != null ? ref8.altitude : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:quantity$/);
          if (match) {
            return (ref9 = data[match[1]]) != null ? (ref10 = ref9.value) != null ? ref10.quantity : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):value:units$/);
          if (match) {
            return (ref11 = data[match[1]]) != null ? (ref12 = ref11.value) != null ? ref12.units : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):timestamp$/);
          if (match) {
            return (ref13 = data[match[1]]) != null ? ref13.timestamp : void 0;
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
            return (ref14 = data[match[1]]) != null ? (ref15 = ref14.location) != null ? ref15.accuracy : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):location:altitude$/);
          if (match) {
            return (ref16 = data[match[1]]) != null ? (ref17 = ref16.location) != null ? ref17.altitude : void 0 : void 0;
          }
          match = columnId.match(/^data:(.+):na$/);
          if (match) {
            return ((ref18 = data[match[1]]) != null ? ref18.alternate : void 0) === "na";
          }
          match = columnId.match(/^data:(.+):dontknow$/);
          if (match) {
            return ((ref19 = data[match[1]]) != null ? ref19.alternate : void 0) === "dontknow";
          }
          return null;
        };
      })(this)
    };
  };

  return FormExprEvaluator;

})();
