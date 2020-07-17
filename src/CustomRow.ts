import _  from 'lodash'
import formUtils from './formUtils'
import VisibilityCalculator, { VisibilityStructure } from './VisibilityCalculator'
import EntityRow from './EntityRow'
import { PromiseExprEvaluatorRow, Schema, Row } from 'mwater-expressions'
import { ResponseData, RosterData, Answer, SiteAnswerValue, LocationAnswerValue } from './response'
import { FormDesign, QuestionBase, DateQuestion, SiteQuestion, EntityQuestion } from './formDesign'

/*
  Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
  on custom table rows
*/
export class CustomRow implements PromiseExprEvaluatorRow {
  /** Custom table id (e.g. custom.xyz.abc) */
  tableId: string

  /** Custom row */
  row: Row

  /** schema to use */
  schema?: Schema

  /** looks up entity. Any callbacks after first one will be ignored. 
   * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found 
   */
  getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void

  // Create a custom row from a row object.
  // Options:
  //  row: row to create for
  //  schema: schema to use
  //  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  constructor(options: {
    /** Custom table id (e.g. custom.xyz.abc) */
    tableId: string
  
    /** Custom table row */
    row: Row

    /** schema to use */
    schema?: Schema

    /** looks up entity. Any callbacks after first one will be ignored. 
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found 
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void
  }) {
    this.tableId = options.tableId
    this.row = options.row
    this.schema = options.schema
    this.getEntityById = options.getEntityById
  }

  // Gets primary key of row
  getPrimaryKey() {
    return this.row._id
  }

  // Gets the value of a column
  async getField(columnId: string) {
    // Get column (gracefully handle if no schema)
    if (!this.schema) {
      return this.row[columnId]
    }

    // Get column
    const column = this.schema.getColumn(this.tableId, columnId)

    // Get value
    const value = this.row[columnId]

    // Handle case of column not found by just returning value
    if (!column) {
      return value
    }

    // Handle null case
    if (value == null) {
      return null
    }

    return value
  }

  async followJoin(columnId: string) {
    // Get column (gracefully handle if no schema)
    if (!this.schema) {
      return null
    }

    // Get column
    const column = this.schema.getColumn(this.tableId, columnId)

    // Handle case of column not found by just returning null
    if (!column) {
      return null
    }
    
    // Get value
    const value = this.row[columnId]

    if (column.type == "id") {
      // If to entity, follow
      if (column.idTable!.match(/^entities./)) {
        // Get the entity
        const entityType = column.idTable!.substr(9)

        const entity = await new Promise((resolve, reject) => 
          this.getEntityById(entityType, value, (entity) => resolve(entity))
        )
        if (entity) {
          return new EntityRow({
            entityType: entityType,
            entity: entity,
            schema: this.schema,
            getEntityById: this.getEntityById
          })
        }
        return null
      }
      else {
        throw new Error("Following non-entity joins not supported")
      }
    }

    // This is legacy code, as newer will leave as type "id"
    if (column.type == "join" && column.join!.type == 'n-1') {
      // If to entity, follow
      if (column.join!.toTable.match(/^entities./)) {
        // Get the entity
        const entityType = column.join!.toTable.substr(9)

        const entity = await new Promise((resolve, reject) => 
          this.getEntityById(entityType, value, (entity) => resolve(entity))
        )
        if (entity) {
          return new EntityRow({
            entityType: entityType,
            entity: entity,
            schema: this.schema,
            getEntityById: this.getEntityById
          })
        }
        return null
      }
      else {
        throw new Error("Following non-entity joins not supported")
      }
    }

    throw new Error(`Cannot follow join on type ${column.type}`)
  }
}