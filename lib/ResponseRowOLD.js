"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EntityRow, ResponseRow, VisibilityCalculator, _, formUtils, nullify;

_ = require('lodash');
formUtils = require('./formUtils');
VisibilityCalculator = require('./VisibilityCalculator');
EntityRow = require('./EntityRow');
/*

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on responses

*/

module.exports = ResponseRow =
/*#__PURE__*/
function () {
  // Create a response row from a response data object.
  // Options:
  //  responseData: data of entire response
  //  formDesign: design of the form
  //  schema: schema to use
  //  rosterId: id of roster if it is a roster row
  //  rosterEntryIndex: index of roster row
  //  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  //  getEntityByCode(entityType, entityCode, callback): looks up an entity. Any callbacks after first one will be ignored.
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  function ResponseRow(options) {
    (0, _classCallCheck2["default"])(this, ResponseRow);
    this.options = options;
    this.formDesign = options.formDesign;
    this.schema = options.schema;
    this.responseData = options.responseData;
    this.rosterId = options.rosterId;
    this.rosterEntryIndex = options.rosterEntryIndex;
    this.getEntityById = options.getEntityById;
    this.getEntityByCode = options.getEntityByCode;
    this.deployment = options.deployment;
  } // Gets the response row for a roster entry


  (0, _createClass2["default"])(ResponseRow, [{
    key: "getRosterResponseRow",
    value: function getRosterResponseRow(rosterId, rosterEntryIndex) {
      return new ResponseRow(_.extend({}, this.options, {
        rosterId: rosterId,
        rosterEntryIndex: rosterEntryIndex
      }));
    } // Gets primary key of row. callback is called with (error, value)

  }, {
    key: "getPrimaryKey",
    value: function getPrimaryKey(callback) {
      // Not available if not roster
      if (!this.rosterId) {
        return callback(null, null);
      } // Get roster id


      return callback(null, this.responseData[this.rosterId][this.rosterEntryIndex]._id);
    } // Gets the value of a column. callback is called with (error, value)    
    // For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins

  }, {
    key: "getField",
    value: function getField(columnId, callback) {
      var _this = this;

      var answerType, code, data, entityType, i, len, part, parts, question, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, siteType, value, visibilityCalculator;
      data = this.responseData; // Go into roster

      if (this.rosterId) {
        data = this.responseData[this.rosterId][this.rosterEntryIndex].data;
      }

      if (columnId === "deployment") {
        return callback(null, this.deployment);
      } // Handle "response" of roster


      if (columnId === "response" && this.rosterId) {
        return callback(null, new ResponseRow(_.omit(this.options, "rosterId", "rosterEntryIndex")));
      } // Handle "index" of roster


      if (columnId === "index" && this.rosterId) {
        return callback(null, this.rosterEntryIndex);
      } // Handle data


      if (columnId.match(/^data:/)) {
        parts = columnId.split(":"); // Roster

        if (parts.length === 2) {
          if (_.isArray(this.responseData[parts[1]])) {
            return callback(null, _.map(this.responseData[parts[1]], function (entry, index) {
              return _this.getRosterResponseRow(parts[1], index);
            }));
          }
        } // Visible


        if (parts.length === 3 && parts[2] === "visible") {
          visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema);
          visibilityCalculator.createVisibilityStructure(this.responseData, this, function (error, visibilityStructure) {
            if (error) {
              return callback(error);
            }

            return callback(null, visibilityStructure[parts[1]]);
          });
          return;
        } // Simple values


        if (parts.length === 3 && parts[2] === "value") {
          value = (ref = data[parts[1]]) != null ? ref.value : void 0; // Null "" and []

          if (value === "" || _.isArray(value) && value.length === 0) {
            value = null;
          }

          if (value == null) {
            return callback(null, null);
          } // Get type of answer


          question = formUtils.findItem(this.formDesign, parts[1]);

          if (!question) {
            return callback(null, null);
          }

          answerType = formUtils.getAnswerType(question); // Pad to YYYY-MM-DD

          if (answerType === "date") {
            if (value.length === 4) {
              value = value + "-01-01";
            }

            if (value.length === 7) {
              value = value + "-01";
            } // If date only, truncate


            if (!question.format.match(/ss|LLL|lll|m|h|H/)) {
              value = value.substr(0, 10);
            }
          }

          if (answerType === "site") {
            // Create site entity row
            siteType = (question.siteTypes ? question.siteTypes[0] : void 0) || "water_point";
            entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_");
            code = value.code;

            if (code) {
              this.getEntityByCode(entityType, code, _.once(function (entity) {
                if (entity) {
                  return callback(null, new EntityRow({
                    entityType: entityType,
                    entity: entity,
                    schema: _this.schema,
                    getEntityById: _this.getEntityById
                  }));
                } else {
                  console.log("Warning: Site ".concat(code, " not found in ResponseRow"));
                  return callback(null, null);
                }
              }));
            } else {
              // Note: Error was making some responses impossible to edit or view
              // callback(new Error("Site #{code} not found"))
              callback(null, null);
            }

            return;
          }

          if (answerType === "entity") {
            // Create site entity row
            if (value) {
              this.getEntityById(question.entityType, value, _.once(function (entity) {
                if (entity) {
                  return callback(null, new EntityRow({
                    entityType: entityType,
                    entity: entity,
                    schema: _this.schema,
                    getEntityById: _this.getEntityById
                  }));
                } else {
                  console.log("Warning: Entity ".concat(value, " not found in ResponseRow"));
                  return callback(null, null);
                }
              }));
            } else {
              // Note: Error was making some responses impossible to edit or view
              // callback(new Error("Entity #{value} not found"))
              callback(null, null);
            }

            return;
          } // Location


          if (value && value.latitude != null) {
            return callback(null, {
              type: "Point",
              coordinates: [value.longitude, value.latitude]
            });
          }

          return callback(null, nullify(value));
        } // Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT


        if (parts[2] === "value") {
          value = (ref1 = data[parts[1]]) != null ? ref1.value : void 0;
          ref2 = _.drop(parts, 3);

          for (i = 0, len = ref2.length; i < len; i++) {
            part = ref2[i];
            value = value != null ? value[part] : void 0;
          }

          return callback(null, nullify(value));
        } // Specify


        if (parts[2] === "specify") {
          return callback(null, nullify((ref3 = data[parts[1]]) != null ? (ref4 = ref3.specify) != null ? ref4[parts[3]] : void 0 : void 0));
        } // Comments


        if (parts[2] === "comments") {
          return callback(null, nullify((ref5 = data[parts[1]]) != null ? ref5.comments : void 0));
        } // # Altitude and accuracy
        // if parts[2] == "value" and parts[3] in ["altitude", "accuracy"]
        //   return callback(null, data[parts[1]]?.value?[parts[3]])
        // # Units
        // if parts[2] == "value" and parts[3] in ["quantity", "units"]
        //   return callback(null, data[parts[1]]?.value?[parts[3]])
        // # Aquagenx cbt
        // if parts[2] == "value" and parts[3] == "cbt" and parts[4] in ["c1","c2","c3","c4","c5","healthRisk","mpn","confidence","accuracy"]
        //   return callback(null, data[parts[1]]?.value?[parts[3]]?[parts[4]])
        // if parts[2] == "value" and parts[3] == "image"
        //   return callback(null, data[parts[1]]?.value?[parts[3]])
        // Alternates


        if (parts.length === 3 && ((ref6 = parts[2]) === 'na' || ref6 === 'dontknow')) {
          return callback(null, ((ref7 = data[parts[1]]) != null ? ref7.alternate : void 0) === parts[2] || null);
        } // Timestamp


        if (parts.length === 3 && parts[2] === "timestamp") {
          return callback(null, nullify((ref8 = data[parts[1]]) != null ? ref8.timestamp : void 0));
        } // Location


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
    }
  }]);
  return ResponseRow;
}(); // Converts undefined to null


nullify = function nullify(value) {
  if (value != null) {
    return value;
  }

  return null;
};