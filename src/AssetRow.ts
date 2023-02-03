import _ from "lodash"
import { Schema } from "mwater-expressions"

/** Columns that are also physical columns in asset table, not stored in jsonb field "data" */
const physicalColumns = [
  "parent",
  "asset_id",
  "type",
  "name",
  "description",
  "location",
  "admin_region",
  "admins",
  "viewers",
  "water_system",
  "water_point"
]

/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an asset.
 */
export default class AssetRow {
  /** System id of asset */
  systemId: number

  /** Object of asset */
  asset: any

  /** Schema that includes asset table */
  schema: Schema

  constructor(options: {
    /** System id of asset */
    systemId: number

    /** Object of asset */
    asset: any

    /** Schema that includes asset table */
    schema: Schema
  }) {
    this.systemId = options.systemId
    this.asset = options.asset
    this.schema = options.schema
  }

  // Gets primary key of row. callback is called with (error, value)
  getPrimaryKey() {
    return Promise.resolve(this.asset._id)
  }

  // Gets the value of a column, returning a promise
  getField(columnId: string) {
    // TODO: Doesn't support 1-n joins
    if (physicalColumns.includes(columnId)) {
      return Promise.resolve(this.asset[columnId] ?? null)
    }
    return Promise.resolve(this.asset.data[columnId] ?? null)
  }

  async followJoin(columnId: string) {
    // TODO joins not supported
    return null
  }
}
