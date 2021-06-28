import _ from "lodash"
import { Schema } from "mwater-expressions"

/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an entity
 */
 export default class EntityRow {
  /**  e.g. "water_point" */
  entityType: string
  /**  object of entity */
  entity: any
  /**  schema that includes entity type */
  schema: Schema
  /** looks up entity. callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found */
  getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void

  constructor(options: {
    /**  e.g. "water_point" */
    entityType: string
    /**  object of entity */
    entity: any
    /**  schema that includes entity type */
    schema: Schema
    /** looks up entity. callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found */
    getEntityById(entityType: string, entityId: string, callback: (entity: any) => void): void
  }) {
    this.entityType = options.entityType
    this.entity = options.entity
    this.schema = options.schema
    this.getEntityById = options.getEntityById
  }

  // Gets primary key of row. callback is called with (error, value)
  getPrimaryKey() {
    return Promise.resolve(this.entity._id)
  }

  // Gets the value of a column, returning a promise
  getField(columnId: any) {
    // Get column (gracefully handle if no schema)
    let column
    if (this.schema) {
      column = this.schema.getColumn(`entities.${this.entityType}`, columnId)
    }

    // Get value
    const value = this.entity[columnId]

    // Handle case of column not found by just returning value
    if (!column) {
      return Promise.resolve(value)
    }

    if (value == null) {
      return Promise.resolve(null)
    }

    // Simple value
    return Promise.resolve(value)
  }

  async followJoin(columnId: any) {
    // Get column (gracefully handle if no schema)
    let column, entity, entityType: any
    if (this.schema) {
      column = this.schema.getColumn(`entities.${this.entityType}`, columnId)
    }

    if (!column) {
      return null
    }

    // Get value
    const value = this.entity[columnId]

    if (column.type === "id") {
      // Can handle joins to another entity
      if (column.idTable!.match(/^entities\./)) {
        // Get the entity
        entityType = column.idTable!.substr(9)
        entity = await new Promise((resolve, reject) => {
          return this.getEntityById(entityType, value, (entity: any) => resolve(entity));
        })
        if (entity) {
          return new EntityRow({
            entityType,
            entity,
            schema: this.schema,
            getEntityById: this.getEntityById
          })
        }
        return null
      }
    }

    // This is legacy code, as newer will leave as type "id"
    if (column.type === "join") {
      // Do not support n-n, 1-n joins
      if (["1-n", "n-n"].includes(column.join!.type)) {
        return null
      }

      // Can handle joins to another entity
      if (column.join!.toTable.match(/^entities\./)) {
        // Get the entity
        entityType = column.join!.toTable.substr(9)
        entity = await new Promise((resolve, reject) => {
          return this.getEntityById(entityType, value, (entity: any) => resolve(entity));
        })
        if (entity) {
          return new EntityRow({
            entityType,
            entity,
            schema: this.schema,
            getEntityById: this.getEntityById
          })
        }
        return null
      }
    }
    return null
  }
}
