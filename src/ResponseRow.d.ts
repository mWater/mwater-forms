import { ExprEvaluatorRow, Row, Schema } from "mwater-expressions"
import { FormDesign } from "./formDesign"
import { ResponseData } from "./response"

/**
 * Create a response row from a response data object.
 * Options:
 *  responseData: data of entire response
 *  formDesign: design of the form
 *  schema: schema to use
 *  rosterId: id of roster if it is a roster row
 *  rosterEntryIndex: index of roster row
 *  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
 *    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
 *  getEntityByCode(entityType, entityCode, callback): looks up an entity. Any callbacks after first one will be ignored.
 *    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
 */
export default class ResponseRow implements ExprEvaluatorRow {
  constructor(options: {
    /** data of entire response */
    responseData: ResponseData
    /** design of the form */
    formDesign: FormDesign
    /** schema to use */
    schema: Schema
    /** id of roster if it is a roster row */
    rosterId: string | undefined
    /** index of roster row */
    rosterEntryIndex: number | undefined
    /** looks up entity. Any callbacks after first one will be ignored.
     * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any | null) => void) => void
    /**  looks up an entity. Any callbacks after first one will be ignored.
     * callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityByCode: (entityType: string, entityId: string, callback: (entity: any | null) => void) => void
  })

  /** gets primary key of row. callback is called with (error, value) */
  getPrimaryKey(callback: (error: any, value?: any) => void): void

  /** gets the value of a column. callback is called with (error, value) 
   * For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
   */
  getField(columnId: string, callback: (error: any, value?: any) => void): void

}
