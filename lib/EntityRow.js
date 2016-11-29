var EntityRow, _;

_ = require('lodash');


/*

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on an entity
 */

module.exports = EntityRow = (function() {
  function EntityRow(options) {
    this.options = options;
    this.entityType = options.entityType;
    this.entity = options.entity;
    this.schema = options.schema;
    this.getEntityById = options.getEntityById;
  }

  EntityRow.prototype.getPrimaryKey = function(callback) {
    return callback(null, this.entity._id);
  };

  EntityRow.prototype.getField = function(columnId, callback) {
    var column, entityType, ref, value;
    if (this.schema) {
      column = this.schema.getColumn("entities." + this.entityType, columnId);
    }
    value = this.entity[columnId];
    if (!column) {
      return callback(null, value);
    }
    if (value == null) {
      return callback(null, null);
    }
    if (column.type === "join") {
      if ((ref = column.join.type) === '1-n' || ref === 'n-n') {
        return callback(null, null);
      }
      if (column.join.toTable.match(/^entities\./)) {
        entityType = column.join.toTable.substr(9);
        this.getEntityById(entityType, value, (function(_this) {
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
    }
    return callback(null, value);
  };

  return EntityRow;

})();
