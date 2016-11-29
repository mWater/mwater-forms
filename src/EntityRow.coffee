_ = require 'lodash'

###

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on an entity

###
module.exports = class EntityRow
  # Options:
  #  entityType: e.g. "water_point"
  #  entity: object of entity
  #  schema: schema that includes entity type
  #  getEntityById(entityType, entityId, callback): looks up entity
  #    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  constructor: (options) ->
    @options = options

    @entityType = options.entityType
    @entity = options.entity
    @schema = options.schema
    @getEntityById = options.getEntityById

  # Gets primary key of row. callback is called with (error, value)
  getPrimaryKey: (callback) ->
    callback(null, @entity._id)

  # Gets the value of a column. callback is called with (error, value)    
  # For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
  getField: (columnId, callback) ->
    # Get column (gracefully handle if no schema)
    if @schema
      column = @schema.getColumn("entities.#{@entityType}", columnId)

    # Get value
    value = @entity[columnId]


    # Handle case of column not found by just returning value
    if not column
      return callback(null, value)

    if not value?
      return callback(null, null)

    if column.type == "join"
      # Do not support n-n, 1-n joins
      if column.join.type in ['1-n', 'n-n']
        return callback(null, null)

      # Can handle joins to another entity
      if column.join.toTable.match(/^entities\./)
        # Get the entity
        entityType = column.join.toTable.substr(9)
        @getEntityById(entityType, value, (entity) =>
          callback(null, new EntityRow({
            entityType: entityType
            entity: entity
            schema: @schema
            getEntityById: @getEntityById
          }))
        )
        return

    # Simple value
    callback(null, value)

