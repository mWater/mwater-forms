import { PromiseExprEvaluatorRow, Schema } from "mwater-expressions"

/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an entity
 */
export default class EntityRow implements PromiseExprEvaluatorRow {
  constructor(options: {
    /**  e.g. "water_point" */
    entityType: string
    /**  object of entity */
    entity: any
    /**  schema that includes entity type */
    schema: Schema
    /** looks up entity. callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found */
    getEntityById(entityType: string, entityId: string, callback: (entity: any) => void): void
  }) 

  getPrimaryKey(): Promise<any>

  /** Gets the value of a column, returning a promise
   * For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
   */
  getField(columnId: string): Promise<any>
}