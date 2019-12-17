_ = require 'lodash'

###

Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
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
  getPrimaryKey: () ->
    return Promise.resolve(@entity._id)

  # Gets the value of a column, returning a promise
  # For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
  getField: (columnId) ->
    # Get column (gracefully handle if no schema)
    if @schema
      column = @schema.getColumn("entities.#{@entityType}", columnId)

    # Get value
    value = @entity[columnId]

    # Handle case of column not found by just returning value
    if not column
      return value

    if not value?
      return null

    if column.type == "join"
      # Do not support n-n, 1-n joins
      if column.join.type in ['1-n', 'n-n']
        return null

      # Can handle joins to another entity
      if column.join.toTable.match(/^entities\./)
        # Get the entity
        entityType = column.join.toTable.substr(9)
        entity = await new Promise((resolve, reject) => 
          @getEntityById(entityType, value, (entity) => resolve(entity))
        )
        if (entity) 
          return new EntityRow({
            entityType: entityType
            entity: entity
            schema: @schema
            getEntityById: @getEntityById
          })
        return null

    # Simple value
    return value

