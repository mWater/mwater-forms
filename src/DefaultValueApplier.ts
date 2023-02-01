import _ from "lodash"
import moment from "moment"
import * as formUtils from "./formUtils"
import { StickyStorage } from "./formContext"
import { FormDesign, Item } from "./formDesign"
import { Answer, ResponseData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"

/** The DefaultValueApplier applies a value stored in the stickyStorage as a default answer to a question.
 * It uses the following logic:
 *    - The question needs to be newly visible
 *    - The question needs to have a default value
 *    - The data for that question needs to be undefined or null, alternate needs to be null or undefined
 */
 export default class DefaultValueApplier {
   formDesign: FormDesign
   stickyStorage: StickyStorage
   entity: any
   entityType: string | undefined
   assetSystemId: number | undefined
   assetType: string | undefined
   assetId: string | undefined

  /** entity is entity to use */
  constructor(formDesign: FormDesign, stickyStorage: StickyStorage, options: {
    entity?: any
    entityType?: string
    assetSystemId?: number
    assetType?: string
    assetId?: string
  } = {}) {
    this.formDesign = formDesign
    this.stickyStorage = stickyStorage
    this.entity = options.entity
    this.entityType = options.entityType
    this.assetSystemId = options.assetSystemId
    this.assetType = options.assetType
    this.assetId = options.assetId
  }

  setStickyData(
    data: ResponseData,
    previousVisibilityStructure: VisibilityStructure,
    newVisibilityStructure: VisibilityStructure
  ): ResponseData {
    // NOTE: Always remember that data is immutable
    const newData = _.cloneDeep(data)

    for (let key in newVisibilityStructure) {
      // If it wasn't visible and it now is
      const nowVisible = newVisibilityStructure[key]
      if (nowVisible && !previousVisibilityStructure[key]) {
        var dataEntry, question, type
        const values = key.split(".")

        // Simple question
        if (values.length === 1) {
          type = "simple"
          question = formUtils.findItem(this.formDesign, values[0])
          dataEntry = data[values[0]]
        } else if (values.length === 3 && values[1].match(/^\d+$/)) {
          // Roster
          type = "roster"
          question = formUtils.findItem(this.formDesign, values[2])

          // Get roster
          dataEntry = data[values[0]]

          // Get data for roster entry
          dataEntry = dataEntry[parseInt(values[1])]
          if (!dataEntry) {
            continue
          }

          // Get data for specific question
          dataEntry = data[values[2]]
        } else if (values.length === 3) {
          type = "matrix"
          // Matrix sticky is not supported
          continue
        } else {
          continue
        }

        // If question not found
        if (question == null) {
          continue
        }

        // The data for that question needs to be undefined or null
        // Alternate for that question needs to be undefined or null
        if (dataEntry == null || ((dataEntry as Answer).value == null && (dataEntry as Answer).alternate == null)) {
          const defaultValue = this.getHighestPriorityDefaultValue(question)
          // Makes sure that a defaultValue has been found
          if (defaultValue != null && defaultValue !== "") {
            // Create the dataEntry if not present
            if (dataEntry == null) {
              if (type === "simple") {
                newData[values[0]] = dataEntry = {}
              } else if (type === "roster") {
                newData[values[0]][parseInt(values[1])].data[values[2]] = dataEntry = {}
              } else if (type === "matrix") {
                // Ensure that question exists
                newData[values[0]] = newData[values[0]] || {}
                newData[values[0]][values[1]] = newData[values[0]][values[1]] || {}
                newData[values[0]][values[1]][values[2]] = dataEntry = {}
              }
            }

            (dataEntry as Answer).value = defaultValue
          }
        }
      }
    }

    return newData
  }

  /** 2 different sources exist for default values.
   * This function returns the one with highest priority:
   * - entityType/entity
   * - sticky with a stored sticky value
   */
  getHighestPriorityDefaultValue(question: Item) {
    if (
      this.entityType != null &&
      this.entity != null &&
      (question._type === "SiteQuestion" || question._type === "EntityQuestion")
    ) {
      let entityType
      if (question._type === "SiteQuestion") {
        const siteType = (question.siteTypes ? question.siteTypes[0] : undefined) || "water_point"
        entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_")
      } else {
        ;({ entityType } = question)
      }

      if (entityType === this.entityType) {
        if (question._type === "SiteQuestion") {
          return { code: this.entity.code }
        } else {
          return this.entity._id
        }
      }
    }

    // Fill in asset question
    if (question._type === "AssetQuestion"
      && this.assetSystemId != null &&
      this.assetId != null &&
      this.assetType != null) {
      if (question.assetSystemId === this.assetSystemId) {
        if (question.assetTypes == null || question.assetTypes.includes(this.assetType)) {
          return this.assetId
        }
      }
    }

    // If it's a sticky question or if it has a defaultValue
    // Tries to use a sticky value if possible, if not it tries to use the defaultValue field
    if (formUtils.isQuestion(question)) {
      if (question.sticky) {
        // Uses stickyStorage.get(questionId) to find any sticky value
        return this.stickyStorage.get(question._id)
      }
    }

    // Handle defaultNow
    if ((question._type === "DateQuestion" || question._type === "DateColumnQuestion") && question.defaultNow) {
      // If datetime
      if (question.format!.match(/ss|LLL|lll|m|h|H/)) {
        return new Date().toISOString()
      } else {
        return moment().format("YYYY-MM-DD")
      }
    }

    return undefined
  }
}
