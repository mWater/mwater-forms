import * as formUtils from "./formUtils"
import _ from "lodash"
import { FormDesign, QuestionBase } from "./formDesign"
import { Answer, ResponseData } from "./response"
import { VisibilityStructure } from "./VisibilityCalculator"

/** The RandomAskedCalculator sets the randomAsked property of visible answers, determining if the question will be visible.
 * If question has randomAskProbability, it is visible unless randomAsked is set to false, which this class determines.
 */
export default class RandomAskedCalculator {
  formDesign: FormDesign

  constructor(formDesign: FormDesign) {
    this.formDesign = formDesign
  }
  
  calculateRandomAsked(data: ResponseData, visibilityStructure: VisibilityStructure): ResponseData {
    // NOTE: Always remember that data is immutable
    const newData = _.cloneDeep(data)

    // Index all items by _id
    const items = _.indexBy(formUtils.allItems(this.formDesign), "_id")

    // For each item in visibility structure
    for (let key in visibilityStructure) {
      // Do nothing with invisible
      var item
      const visible = visibilityStructure[key]
      if (!visible) {
        continue
      }

      const parts = key.split(".")

      // If simple key
      if (parts.length === 1) {
        item = items[parts[0]]
        if (!item) {
          continue
        }
        if (formUtils.isBaseQuestion(item)) {
          if (item.randomAskProbability != null) {
            newData[item._id] = newData[item._id] || {}
            if ((newData[item._id] as Answer).randomAsked == null) {
              (newData[item._id] as Answer).randomAsked = this.generateRandomValue(item.randomAskProbability)
            }
          }
        }
      } else {
        // If not roster, skip
        if (!parts[1].match(/^\d+$/)) {
          continue
        }

        // Lookup question in roster
        item = items[parts[2]]
        if (!item) {
          continue
        }

        // Get roster index
        const entryIndex = parseInt(parts[1])

        if (formUtils.isBaseQuestion(item) && item.randomAskProbability != null) {
          // Get enty data
          const entryData = newData[parts[0]][entryIndex].data

          // Create structure
          entryData[item._id] = entryData[item._id] || {}

          // Set randomAsked
          if (entryData[item._id].randomAsked == null) {
            entryData[item._id].randomAsked = this.generateRandomValue(item.randomAskProbability)
          }
        }
      }
    }

    return newData
  }

  // Randomly determine asked
  generateRandomValue(probability: any) {
    return Math.random() < probability
  }
}
