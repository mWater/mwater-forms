var EntityRow, ResponseRow, VisibilityCalculator, _, formUtils, nullify;

_ = require('lodash');

formUtils = require('./formUtils');

VisibilityCalculator = require('./VisibilityCalculator');

EntityRow = require('./EntityRow');


/*

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on responses
 */

module.exports = ResponseRow = (function() {
  function ResponseRow(options) {
    this.options = options;
    this.formDesign = options.formDesign;
    this.schema = options.schema;
    this.responseData = options.responseData;
    this.rosterId = options.rosterId;
    this.rosterEntryIndex = options.rosterEntryIndex;
    this.getEntityById = options.getEntityById;
    this.getEntityByCode = options.getEntityByCode;
  }

  ResponseRow.prototype.getRosterResponseRow = function(rosterId, rosterEntryIndex) {
    return new ResponseRow(_.extend({}, this.options, {
      rosterId: rosterId,
      rosterEntryIndex: rosterEntryIndex
    }));
  };

  ResponseRow.prototype.getPrimaryKey = function(callback) {
    if (!this.rosterId) {
      return callback(null, null);
    }
    return callback(null, this.responseData[this.rosterId][this.rosterEntryIndex]._id);
  };

  ResponseRow.prototype.getField = function(columnId, callback) {
    var answerType, code, data, entityType, i, len, part, parts, question, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, siteType, value, visibilityCalculator;
    data = this.responseData;
    if (this.rosterId) {
      data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
    }
    if (columnId === "response" && this.rosterId) {
      return callback(null, new ResponseRow(_.omit(this.options, "rosterId", "rosterEntryIndex")));
    }
    if (columnId === "index" && this.rosterId) {
      return callback(null, this.rosterEntryIndex);
    }
    if (columnId.match(/^data:/)) {
      parts = columnId.split(":");
      if (parts.length === 2) {
        if (_.isArray(this.responseData[parts[1]])) {
          return callback(null, _.map(this.responseData[parts[1]], (function(_this) {
            return function(entry, index) {
              return _this.getRosterResponseRow(parts[1], index);
            };
          })(this)));
        }
      }
      if (parts.length === 3 && parts[2] === "visible") {
        visibilityCalculator = new VisibilityCalculator(this.formDesign);
        visibilityCalculator.createVisibilityStructure(this.responseData, this, (function(_this) {
          return function(error, visibilityStructure) {
            if (error) {
              return callback(error);
            }
            return callback(null, visibilityStructure[parts[1]]);
          };
        })(this));
        return;
      }
      if (parts.length === 3 && parts[2] === "value") {
        value = (ref = data[parts[1]]) != null ? ref.value : void 0;
        if (value === "" || (_.isArray(value) && value.length === 0)) {
          value = null;
        }
        if (value == null) {
          return callback(null, null);
        }
        question = formUtils.findItem(this.formDesign, parts[1]);
        if (!question) {
          return callback(null, null);
        }
        answerType = formUtils.getAnswerType(question);
        if (answerType === "date") {
          if (value.length === 4) {
            value = value + "-01-01";
          }
          if (value.length === 7) {
            value = value + "-01";
          }
          if (!question.format.match(/ss|LLL|lll|m|h|H/)) {
            value = value.substr(0, 10);
          }
        }
        if (answerType === "site") {
          siteType = (question.siteTypes ? question.siteTypes[0] : void 0) || "Water point";
          entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
          code = value.code;
          if (code) {
            this.getEntityByCode(entityType, code, (function(_this) {
              return function(entity) {
                return callback(null, new EntityRow({
                  entityType: entityType,
                  entity: entity,
                  schema: _this.schema,
                  getEntityById: _this.getEntityById
                }));
              };
            })(this));
          } else {
            callback(null, null);
          }
          return;
        }
        if (answerType === "entity") {
          this.getEntityById(question.entityType, value, (function(_this) {
            return function(entity) {
              return callback(null, new EntityRow({
                entityType: entityType,
                entity: entity,
                schema: _this.schema,
                getEntityById: _this.getEntityById
              }));
            };
          })(this));
          return;
        }
        if (value && (value.latitude != null)) {
          return callback(null, {
            type: "Point",
            coordinates: [value.longitude, value.latitude]
          });
        }
        return callback(null, nullify(value));
      }
      if (parts[2] === "value") {
        value = (ref1 = data[parts[1]]) != null ? ref1.value : void 0;
        ref2 = _.drop(parts, 3);
        for (i = 0, len = ref2.length; i < len; i++) {
          part = ref2[i];
          value = value != null ? value[part] : void 0;
        }
        return callback(null, nullify(value));
      }
      if (parts[2] === "specify") {
        return callback(null, nullify((ref3 = data[parts[1]]) != null ? (ref4 = ref3.specify) != null ? ref4[parts[3]] : void 0 : void 0));
      }
      if (parts[2] === "comments") {
        return callback(null, nullify((ref5 = data[parts[1]]) != null ? ref5.comments : void 0));
      }
      if (parts.length === 3 && ((ref6 = parts[2]) === 'na' || ref6 === 'dontknow')) {
        return callback(null, ((ref7 = data[parts[1]]) != null ? ref7.alternate : void 0) === parts[2] || null);
      }
      if (parts.length === 3 && parts[2] === "timestamp") {
        return callback(null, nullify((ref8 = data[parts[1]]) != null ? ref8.timestamp : void 0));
      }
      if (parts.length === 3 && parts[2] === "location") {
        if ((ref9 = data[parts[1]]) != null ? ref9.location : void 0) {
          return callback(null, {
            type: "Point",
            coordinates: [(ref10 = data[parts[1]]) != null ? ref10.location.longitude : void 0, data[parts[1]].location.latitude]
          });
        } else {
          return callback(null, null);
        }
      }
      if (parts.length === 4 && parts[2] === "location" && parts[3] === "accuracy") {
        return callback(null, nullify((ref11 = data[parts[1]]) != null ? (ref12 = ref11.location) != null ? ref12.accuracy : void 0 : void 0));
      }
      if (parts.length === 4 && parts[2] === "location" && parts[3] === "altitude") {
        return callback(null, nullify((ref13 = data[parts[1]]) != null ? (ref14 = ref13.location) != null ? ref14.altitude : void 0 : void 0));
      }
    }
    return callback(null, null);
  };

  ResponseRow.prototype.getOrdering = function(callback) {
    return callback(null, null);
  };

  return ResponseRow;

})();

nullify = function(value) {
  if (value != null) {
    return value;
  }
  return null;
};
