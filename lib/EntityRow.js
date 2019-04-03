"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EntityRow, _;

_ = require('lodash');
/*

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on an entity

*/

module.exports = EntityRow =
/*#__PURE__*/
function () {
  // Options:
  //  entityType: e.g. "water_point"
  //  entity: object of entity
  //  schema: schema that includes entity type
  //  getEntityById(entityType, entityId, callback): looks up entity
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  function EntityRow(options) {
    (0, _classCallCheck2["default"])(this, EntityRow);
    this.options = options;
    this.entityType = options.entityType;
    this.entity = options.entity;
    this.schema = options.schema;
    this.getEntityById = options.getEntityById;
  } // Gets primary key of row. callback is called with (error, value)


  (0, _createClass2["default"])(EntityRow, [{
    key: "getPrimaryKey",
    value: function getPrimaryKey(callback) {
      return callback(null, this.entity._id);
    } // Gets the value of a column. callback is called with (error, value)    
    // For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins

  }, {
    key: "getField",
    value: function getField(columnId, callback) {
      var _this = this;

      var column, entityType, ref, value; // Get column (gracefully handle if no schema)

      if (this.schema) {
        column = this.schema.getColumn("entities.".concat(this.entityType), columnId);
      } // Get value


      value = this.entity[columnId]; // Handle case of column not found by just returning value

      if (!column) {
        return callback(null, value);
      }

      if (value == null) {
        return callback(null, null);
      }

      if (column.type === "join") {
        // Do not support n-n, 1-n joins
        if ((ref = column.join.type) === '1-n' || ref === 'n-n') {
          return callback(null, null);
        } // Can handle joins to another entity


        if (column.join.toTable.match(/^entities\./)) {
          // Get the entity
          entityType = column.join.toTable.substr(9);
          this.getEntityById(entityType, value, function (entity) {
            return callback(null, new EntityRow({
              entityType: entityType,
              entity: entity,
              schema: _this.schema,
              getEntityById: _this.getEntityById
            }));
          });
          return;
        }
      } // Simple value


      return callback(null, value);
    }
  }]);
  return EntityRow;
}();