"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EntityRow, _;

_ = require('lodash');
/*

Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
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
    value: function getPrimaryKey() {
      return Promise.resolve(this.entity._id);
    } // Gets the value of a column, returning a promise
    // For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins

  }, {
    key: "getField",
    value: function getField(columnId) {
      var _this = this;

      var column, entity, entityType, ref, value;
      return _regenerator["default"].async(function getField$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Get column (gracefully handle if no schema)
              if (this.schema) {
                column = this.schema.getColumn("entities.".concat(this.entityType), columnId);
              } // Get value


              value = this.entity[columnId]; // Handle case of column not found by just returning value

              if (column) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", value);

            case 4:
              if (!(value == null)) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", null);

            case 6:
              if (!(column.type === "join")) {
                _context.next = 17;
                break;
              }

              if (!((ref = column.join.type) === '1-n' || ref === 'n-n')) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", null);

            case 9:
              if (!column.join.toTable.match(/^entities\./)) {
                _context.next = 17;
                break;
              }

              // Get the entity
              entityType = column.join.toTable.substr(9);
              _context.next = 13;
              return _regenerator["default"].awrap(new Promise(function (resolve, reject) {
                return _this.getEntityById(entityType, value, function (entity) {
                  return resolve(entity);
                });
              }));

            case 13:
              entity = _context.sent;

              if (!entity) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", new EntityRow({
                entityType: entityType,
                entity: entity,
                schema: this.schema,
                getEntityById: this.getEntityById
              }));

            case 16:
              return _context.abrupt("return", null);

            case 17:
              return _context.abrupt("return", value);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);
  return EntityRow;
}();