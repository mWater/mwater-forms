import _ from "lodash"
import { PromiseExprEvaluatorRow } from "mwater-expressions"

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

type Asset = any

/**
 * Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
 * on an asset.
 * 
 * Note: this is a copy of mwater-common's AssetRow
 */
export class AssetRow implements PromiseExprEvaluatorRow {
  asset: Asset

  constructor(asset: Asset) {
    this.asset = asset
  }

  async getPrimaryKey(): Promise<any> {
    return this.asset._id
  }

  async getField(columnId: string): Promise<any> {
    if (physicalColumns.includes(columnId)) {
      return this.asset[columnId]
    } else {
      return this.asset.data[columnId]
    }
  }

  followJoin(columnId: string): Promise<PromiseExprEvaluatorRow | PromiseExprEvaluatorRow[] | null> {
    throw new Error("Following joins not implemented for assets")
  }
}
