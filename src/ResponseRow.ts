import _ from "lodash"
import * as formUtils from "./formUtils"
import VisibilityCalculator, { VisibilityStructure } from "./VisibilityCalculator"
import EntityRow from "./EntityRow"
import { PromiseExprEvaluatorRow, Schema, Row } from "mwater-expressions"
import { ResponseData, RosterData, Answer, SiteAnswerValue, LocationAnswerValue } from "./response"
import {
  FormDesign,
  QuestionBase,
  DateQuestion,
  SiteQuestion,
  EntityQuestion,
  CascadingRefQuestion,
  Question,
  AssetQuestion
} from "./formDesign"
import { CustomRow } from "./CustomRow"
import AssetRow from "./AssetRow"

/*
  Implements the type of row object required by mwater-expressions' PromiseExprEvaluator. Allows expressions to be evaluated
  on responses
*/
export default class ResponseRow implements PromiseExprEvaluatorRow {
  /** data of entire response */
  responseData: ResponseData

  /** design of the form */
  formDesign: FormDesign

  /** schema to use */
  schema: Schema

  /** id of roster if it is a roster row */
  rosterId?: string

  /** index of roster row */
  rosterEntryIndex?: number

  /** looks up entity. Any callbacks after first one will be ignored.
   * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
   */
  getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void

  /** looks up an entity. Any callbacks after first one will be ignored.
   * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
   */
  getEntityByCode: (entityType: string, entityCode: string, callback: (entity: any) => void) => void

  /** Get a specific row of a custom table */
  getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>

  /** Gets an asset by _id */
  getAssetById: (assetSystemId: number, assetId: string) => Promise<any | null>

  /** Deployment _id of the response */
  deployment?: string

  /** Optional submitted on */
  submittedOn?: string

  /** Optional code */
  code?: string

  // Create a response row from a response data object.
  // Options:
  //  responseData: data of entire response
  //  formDesign: design of the form
  //  schema: schema to use
  //  rosterId: id of roster if it is a roster row
  //  rosterEntryIndex: index of roster row
  //  getEntityById(entityType, entityId, callback): looks up entity. Any callbacks after first one will be ignored.
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  //  getEntityByCode(entityType, entityCode, callback): looks up an entity. Any callbacks after first one will be ignored.
  //    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  constructor(options: {
    /** data of entire response */
    responseData: ResponseData

    /** design of the form */
    formDesign: FormDesign

    /** schema to use */
    schema: Schema

    /** id of roster if it is a roster row */
    rosterId?: string

    /** index of roster row */
    rosterEntryIndex?: number

    /** looks up entity. Any callbacks after first one will be ignored.
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityById: (entityType: string, entityId: string, callback: (entity: any) => void) => void

    /** looks up an entity. Any callbacks after first one will be ignored.
     * called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
     */
    getEntityByCode: (entityType: string, entityCode: string, callback: (entity: any) => void) => void

    /** Get a specific row of a custom table */
    getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>

    /** Gets an asset by _id */
    getAssetById: (assetSystemId: number, assetId: string) => Promise<any | null>

    /** Deployment _id of the response */
    deployment?: string

    /** Optional submitted on */
    submittedOn?: string

    /** Optional code */
    code?: string
  }) {
    this.formDesign = options.formDesign
    this.schema = options.schema
    this.responseData = options.responseData
    this.rosterId = options.rosterId
    this.rosterEntryIndex = options.rosterEntryIndex
    this.getEntityById = options.getEntityById
    this.getEntityByCode = options.getEntityByCode
    this.getCustomTableRow = options.getCustomTableRow
    this.getAssetById = options.getAssetById
    this.deployment = options.deployment
    this.submittedOn = options.submittedOn
    this.code = options.code
  }

  // Gets the response row for a roster entry
  getRosterResponseRow(rosterId: string, rosterEntryIndex: number) {
    return new ResponseRow({
      formDesign: this.formDesign,
      schema: this.schema,
      responseData: this.responseData,
      getEntityById: this.getEntityById,
      getEntityByCode: this.getEntityByCode,
      getCustomTableRow: this.getCustomTableRow,
      getAssetById: this.getAssetById,
      deployment: this.deployment,
      rosterId: rosterId,
      rosterEntryIndex: rosterEntryIndex
    })
  }

  // Gets primary key of row
  getPrimaryKey() {
    // Not available if not roster
    if (!this.rosterId) {
      return null
    }
    // Get roster id
    return this.responseData[this.rosterId!][this.rosterEntryIndex!]
  }

  // Gets the value of a column
  async getField(columnId: string) {
    var siteType, value

    let data = this.responseData

    // Go into roster
    if (this.rosterId) {
      data = this.responseData[this.rosterId][this.rosterEntryIndex!].data
    }

    if (columnId === "deployment") {
      return this.deployment
    }

    if (columnId == "submittedOn") {
      return this.submittedOn
    }

    if (columnId == "code") {
      return this.code
    }

    // Handle "response" of roster
    if (columnId === "response" && this.rosterId) {
      // Primary key not available
      return null
    }

    // Handle "index" of roster
    if (columnId === "index" && this.rosterId) {
      return this.rosterEntryIndex
    }

    // Handle data
    if (columnId.match(/^data:/)) {
      const parts = columnId.split(":")

      // Roster
      if (parts.length === 2) {
        if (_.isArray(this.responseData[parts[1]])) {
          // Extract _id s
          return _.map(this.responseData[parts[1]] as RosterData, (entry, index) => entry._id)
        }
      }

      // Visible
      if (parts.length === 3 && parts[2] === "visible") {
        const visibilityCalculator = new VisibilityCalculator(this.formDesign, this.schema)
        const visibilityStructure = await new Promise<VisibilityStructure>((resolve, reject) => {
          visibilityCalculator.createVisibilityStructure(
            this.responseData,
            this,
            (error: any, visibilityStructure: any) => {
              if (error) {
                reject(error)
              } else {
                resolve(visibilityStructure)
              }
            }
          )
        })
        return visibilityStructure[parts[1]]
      }

      // Simple values
      if (parts.length === 3 && parts[2] === "value") {
        let value = data[parts[1]] ? (data[parts[1]] as Answer).value : null

        // Null "" and []
        if (value === "" || (_.isArray(value) && value.length === 0)) {
          value = null
        }
        if (value == null) {
          return null
        }

        // Get type of answer
        const question = formUtils.findItem(this.formDesign, parts[1])
        if (!question) {
          return null
        }

        const answerType = formUtils.getAnswerType(question as Question)
        // Pad to YYYY-MM-DD
        if (answerType === "date") {
          if ((value as string).length === 4) {
            value = value + "-01-01"
          }
          if ((value as string).length === 7) {
            value = value + "-01"
          }
          // If date only, truncate
          if (!(question as DateQuestion).format.match(/ss|LLL|lll|m|h|H/)) {
            value = (value as string).substr(0, 10)
          }
        }

        if (answerType === "site") {
          // Create site entity row
          siteType =
            ((question as SiteQuestion).siteTypes ? (question as SiteQuestion).siteTypes![0] : null) || "water_point"
          const entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_")
          const code = (value as SiteAnswerValue).code
          if (code) {
            const entity: any = await new Promise((resolve) => {
              this.getEntityByCode(
                entityType,
                code,
                _.once((entity) => {
                  if (entity) {
                    return resolve(entity)
                  } else {
                    console.log(`Warning: Site ${code} not found in ResponseRow`)
                    return resolve(null)
                  }
                })
              )
            })
            if (entity) {
              return entity._id
            }
          }
          return null
        }

        if (answerType === "entity") {
          return value
        }

        if (answerType == "cascading_ref") {
          return value
        }

        // Location
        if (value && (value as LocationAnswerValue).latitude != null) {
          return {
            type: "Point",
            coordinates: [(value as LocationAnswerValue).longitude, (value as LocationAnswerValue).latitude]
          }
        }

        return nullify(value)
      }

      // Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT
      if (parts[2] === "value") {
        value = data[parts[1]] ? (data[parts[1]] as Answer).value : null
        for (const part of _.drop(parts, 3)) {
          value = value != null ? value[part] : null
        }
        return nullify(value)
      }
      // Specify
      if (parts[2] === "specify") {
        return nullify(
          data[parts[1]] &&
            (data[parts[1]] as Answer).specify != null &&
            (data[parts[1]] as Answer).specify![parts[3]] != null
            ? (data[parts[1]] as Answer).specify![parts[3]]
            : null
        )
      }

      // Comments
      if (parts[2] === "comments") {
        return nullify(data[parts[1]] ? (data[parts[1]] as Answer).comments : null)
      }

      // # Altitude and accuracy
      // if parts[2] == "value" and parts[3] in ["altitude", "accuracy"]
      //   return callback(null, data[parts[1]]?.value?[parts[3]])

      // # Units
      // if parts[2] == "value" and parts[3] in ["quantity", "units"]
      //   return callback(null, data[parts[1]]?.value?[parts[3]])

      // # Aquagenx cbt
      // if parts[2] == "value" and parts[3] == "cbt" and parts[4] in ["c1","c2","c3","c4","c5","healthRisk","mpn","confidence","accuracy"]
      //   return callback(null, data[parts[1]]?.value?[parts[3]]?[parts[4]])

      // if parts[2] == "value" and parts[3] == "image"
      //   return callback(null, data[parts[1]]?.value?[parts[3]])

      // Randomly asked
      if (parts.length === 3 && parts[2] === "randomAsked") {
        return data[parts[1]] ? (data[parts[1]] as Answer).randomAsked || false : null
      }

      // Alternates
      if (parts.length === 3 && (parts[2] === "na" || parts[2] === "dontknow")) {
        return data[parts[1]] ? (data[parts[1]] as Answer).alternate == parts[2] || null : null
      }
      // Timestamp
      if (parts.length === 3 && parts[2] === "timestamp") {
        return nullify(data[parts[1]] ? (data[parts[1]] as Answer).timestamp : null)
      }
      // Location
      if (parts.length === 3 && parts[2] === "location") {
        const location = data[parts[1]] ? (data[parts[1]] as Answer).location : null
        if (location) {
          return {
            type: "Point",
            coordinates: [location.longitude, location.latitude]
          }
        }
        return null
      }
      if (parts.length === 4 && parts[2] === "location" && parts[3] === "accuracy") {
        const location = data[parts[1]] ? (data[parts[1]] as Answer).location : null
        if (location) {
          return nullify(location.accuracy)
        }
        return null
      }
      if (parts.length === 4 && parts[2] === "location" && parts[3] === "altitude") {
        const location = data[parts[1]] ? (data[parts[1]] as Answer).location : null
        if (location) {
          return nullify(location.altitude)
        }
        return null
      }
    }
    return null
  }

  /** Follows a join to get row or rows */
  async followJoin(columnId: string) {
    var siteType, value
    let data = this.responseData

    // Go into roster
    if (this.rosterId) {
      data = this.responseData[this.rosterId][this.rosterEntryIndex!].data
    }

    // Handle "response" of roster
    if (columnId === "response" && this.rosterId) {
      return new ResponseRow({
        formDesign: this.formDesign,
        schema: this.schema,
        responseData: this.responseData,
        getEntityById: this.getEntityById,
        getEntityByCode: this.getEntityByCode,
        getCustomTableRow: this.getCustomTableRow,
        getAssetById: this.getAssetById,
        deployment: this.deployment
      })
    }

    // Handle data
    if (columnId.match(/^data:/)) {
      const parts = columnId.split(":")

      // Roster
      if (parts.length === 2) {
        if (_.isArray(this.responseData[parts[1]])) {
          return _.map(this.responseData[parts[1]] as RosterData, (entry, index) =>
            this.getRosterResponseRow(parts[1], index)
          )
        }
      }

      // Simple values
      if (parts.length === 3 && parts[2] === "value") {
        let value = data[parts[1]] ? (data[parts[1]] as Answer).value : null

        if (value == null) {
          return null
        }

        // Get type of answer
        const question = formUtils.findItem(this.formDesign, parts[1])
        if (!question) {
          return null
        }

        const answerType = formUtils.getAnswerType(question as QuestionBase)

        if (answerType === "site") {
          // Create site entity row
          siteType =
            ((question as SiteQuestion).siteTypes ? (question as SiteQuestion).siteTypes![0] : null) || "water_point"
          const entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_")
          const code = (value as SiteAnswerValue).code
          if (code) {
            const entity = await new Promise((resolve) => {
              this.getEntityByCode(
                entityType,
                code,
                _.once((entity) => {
                  if (entity) {
                    return resolve(entity)
                  } else {
                    console.log(`Warning: Site ${code} not found in ResponseRow`)
                    return resolve(null)
                  }
                })
              )
            })
            if (entity) {
              return new EntityRow({
                entityType: entityType,
                entity: entity,
                schema: this.schema,
                getEntityById: this.getEntityById
              })
            }
          }
          return null
        }

        if (answerType === "entity") {
          // Create site entity row
          if (value) {
            const entity = await new Promise((resolve) => {
              this.getEntityById(
                (question as EntityQuestion).entityType,
                value as string,
                _.once((entity) => {
                  if (entity) {
                    resolve(entity)
                  } else {
                    console.log(`Warning: Entity ${value} not found in ResponseRow`)
                    resolve(null)
                  }
                })
              )
            })
            if (entity) {
              return new EntityRow({
                entityType: (question as EntityQuestion).entityType,
                entity: entity,
                schema: this.schema,
                getEntityById: this.getEntityById
              })
            }
          }
          return null
        }

        if (answerType == "cascading_ref") {
          // Create custom row
          if (value) {
            const tableId = (question as CascadingRefQuestion).tableId
            const customRow = await this.getCustomTableRow(tableId, value as string)
            if (customRow) {
              return new CustomRow({
                tableId: (question as CascadingRefQuestion).tableId,
                getEntityById: this.getEntityById,
                row: customRow,
                schema: this.schema
              })
            }
          }
          return null
        }

        if (answerType == "asset") {
          // Create asset row
          if (value) {
            const systemId = (question as AssetQuestion).assetSystemId
            const asset = await this.getAssetById(systemId, value as string)
            if (asset) {
              return new AssetRow({
                systemId,
                asset,
                schema: this.schema
              })
            }
          }
          return null
        }
      }
    }
    return null
  }
}

/** Converts undefined to null */
function nullify(value: any) {
  if (value != null) {
    return value
  }
  return null
}
