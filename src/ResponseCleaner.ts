import _ from "lodash"
import * as formUtils from "./formUtils"
import * as conditionUtils from "./conditionUtils"
import async from "async"
import { FormDesign, ResponseData, ResponseRow } from "."
import DefaultValueApplier from "./DefaultValueApplier"
import RandomAskedCalculator from "./RandomAskedCalculator"
import VisibilityCalculator, { VisibilityStructure } from "./VisibilityCalculator"

/*
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as condition evaluation is asynchronous.

*/
export default class ResponseCleaner {
  /**
   * Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
   * The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
   * The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
   * and should be repeated until the visibilityStructure is stable.
   * A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
   * Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
   * responseRowFactory: returns responseRow when called with data
   */
  cleanData = (
    design: FormDesign,
    visibilityCalculator: VisibilityCalculator,
    defaultValueApplier: DefaultValueApplier,
    randomAskedCalculator: RandomAskedCalculator | null,
    data: ResponseData,
    responseRowFactory: (data: ResponseData) => ResponseRow,
    oldVisibilityStructure: VisibilityStructure | null,
    callback: (err: any, result?: { data: ResponseData; visibilityStructure: VisibilityState }) => void
  ): void => {
    let nbIterations = 0
    let complete = false
    let newData = data
    let newVisibilityStructure: any = null

    // This needs to be repeated until it stabilizes
    return async.whilst(
      () => !complete,
      (cb) => {
        // Compute visibility
        return visibilityCalculator.createVisibilityStructure(
          newData,
          responseRowFactory(newData),
          (error: any, visibilityStructure: any) => {
            if (error) {
              return cb(error)
            }

            newVisibilityStructure = visibilityStructure

            // Clean data
            newData = this.cleanDataBasedOnVisibility(newData, newVisibilityStructure)
            newData = this.cleanDataBasedOnChoiceConditions(newData, newVisibilityStructure, design)
            newData = this.cleanDataCascadingLists(newData, newVisibilityStructure, design)

            // Default values
            if (defaultValueApplier) {
              newData = defaultValueApplier.setStickyData(newData, oldVisibilityStructure, newVisibilityStructure)
            }

            // Set random asked
            if (randomAskedCalculator) {
              newData = randomAskedCalculator.calculateRandomAsked(newData, newVisibilityStructure)
            }

            // Increment iterations
            nbIterations++

            // If the visibilityStructure is still the same twice, the process is now stable.
            if (_.isEqual(newVisibilityStructure, oldVisibilityStructure)) {
              complete = true
            }

            if (nbIterations >= 10) {
              return cb(new Error("Impossible to compute question visibility. The question conditions must be looping"))
            }

            // New is now old
            oldVisibilityStructure = newVisibilityStructure

            return cb(null)
          }
        )
      },
      (error) => {
        if (error) {
          return callback(error)
        }

        return callback(null, { data: newData, visibilityStructure: newVisibilityStructure })
      }
    )
  }

  // Remove data entries for all the invisible questions
  cleanDataBasedOnVisibility(data: any, visibilityStructure: any) {
    const newData = _.cloneDeep(data)

    for (let key in visibilityStructure) {
      const visible = visibilityStructure[key]
      if (!visible) {
        var questionId
        const values = key.split(".")
        // If the key doesn't contain any '.', simply remove the data entry unless has randomAsked
        if (values.length === 1) {
          if (newData[key]?.randomAsked != null) {
            newData[key] = { randomAsked: newData[key].randomAsked }
          } else {
            delete newData[key]
          }
          // Check if value is an array, which indicates roster
        } else if (_.isArray(newData[values[0]])) {
          // The id of the roster containing the data
          const rosterGroupId = values[0]
          // The index of the answer
          const index = parseInt(values[1])
          // The id of the answered question
          questionId = values[2]
          // If a data entry exist for that roster and that answer index
          if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
            // Delete the entry, but keep randomAsked
            const answerToClean = newData[rosterGroupId][index].data
            if (answerToClean) {
              if (answerToClean[questionId]?.randomAsked != null) {
                answerToClean[questionId] = { randomAsked: answerToClean[questionId].randomAsked }
              } else {
                delete answerToClean[questionId]
              }
            }
          }
        } else {
          // Must be a matrix
          const matrixId = values[0]
          const itemId = values[1]
          questionId = values[2]
          if (itemId && questionId && newData[matrixId]?.[itemId]?.[questionId]) {
            delete newData[matrixId][itemId][questionId]
          }
        }
      }
    }

    return newData
  }

  // Remove data entries for all the conditional choices that are false
  // 'DropdownQuestion', 'RadioQuestion' and 'DropdownColumnQuestion' can have choices that are only present if a condition
  // is filled. If the condition is no longer filled, the answer data needs to be removed
  cleanDataBasedOnChoiceConditions(data: any, visibilityStructure: any, design: any) {
    const newData = _.cloneDeep(data)

    for (let key in visibilityStructure) {
      const visible = visibilityStructure[key]
      if (visible) {
        var conditionData, deleteAnswer, questionId: any
        const values = key.split(".")
        let selectedChoice = null

        // FIRST: Setup what is needed for the cleaning the data (different for rosters)
        // If the key doesn't contain any '.', simply remove the data entry
        if (values.length === 1) {
          questionId = key
          conditionData = newData
          selectedChoice = newData[questionId]?.value
          // A simple delete
          deleteAnswer = () => delete newData[questionId]
          // Check if value is an array, which indicates roster
        } else if (_.isArray(newData[values[0]])) {
          // The id of the roster containing the data
          var rosterGroupId = values[0]
          // The index of the answer
          var index = parseInt(values[1])
          // The id of the answered question
          questionId = values[2]
          if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
            // Delete the entry
            conditionData = newData[rosterGroupId][index].data
            selectedChoice = conditionData?.[questionId]?.value
            deleteAnswer = function () {
              // Need to find what needs to be cleaned first (with roster data)
              const answerToClean = newData[rosterGroupId][index].data
              return delete answerToClean[questionId]
            }
          }
        }

        // SECOND: look for conditional choices and delete their answer if the conditions are false
        if (selectedChoice != null) {
          // Get the question
          const question = formUtils.findItem(design, questionId)
          // Of dropdown or radio type (types with conditional choices)
          if (
            question._type === "DropdownQuestion" ||
            question._type === "RadioQuestion" ||
            question._type === "DropdownColumnQuestion"
          ) {
            for (let choice of question.choices) {
              // If one of the choice is conditional
              if (choice.conditions) {
                // And it's the selected choice
                if (choice.id === selectedChoice) {
                  // Test the condition
                  if (!conditionUtils.compileConditions(choice.conditions)(conditionData)) {
                    deleteAnswer()
                  }
                }
              }
            }
          }
        }
      }
    }

    return newData
  }

  // Cascading lists might reference rows that don't exists,
  // or the c0, c1, etc. values might be out of date
  // or the id might be missing (if updated using ResponseDataExprValueUpdater)
  cleanDataCascadingLists(data: any, visibilityStructure: any, design: any) {
    const newData = _.cloneDeep(data)

    for (var key in visibilityStructure) {
      const visible = visibilityStructure[key]
      if (visible) {
        var questionId, relevantData
        const values = key.split(".")
        let answerValue = null

        // FIRST: Setup what is needed for the cleaning the data (different for rosters)
        // Simple case
        if (values.length === 1) {
          questionId = key
          relevantData = newData
          answerValue = newData[questionId]?.value
          // A simple delete

          // Check if value is an array, which indicates roster
        } else if (_.isArray(newData[values[0]])) {
          // The id of the roster containing the data
          const rosterGroupId = values[0]
          // The index of the answer
          const index = parseInt(values[1])
          // The id of the answered question
          questionId = values[2]
          if (newData[rosterGroupId] != null && newData[rosterGroupId][index] != null) {
            // Delete the entry
            relevantData = newData[rosterGroupId][index].data
            answerValue = relevantData?.[questionId]?.value
          }
        }

        // SECOND: look for conditional choices and delete their answer if the conditions are false
        if (answerValue != null) {
          // Get the question
          const question = formUtils.findItem(design, questionId)
          // If cascading list
          if (question._type === "CascadingListQuestion") {
            // If id, find row
            if (answerValue.id) {
              const row = _.find(question.rows, { id: answerValue.id })
              if (!row) {
                delete relevantData[question._id].value
              } else {
                // Update answer if wrong
                if (!!_.isEqual(answerValue, row)) {
                  relevantData[question._id].value = row
                }
              }
            } else {
              // Look up by column values as id is not present
              var value: any
              let rows = question.rows.slice()
              for (key in answerValue) {
                value = answerValue[key]
                rows = _.filter(rows, (r) => r[key] === value)
              }

              // Should be one row
              if (rows.length === 1) {
                relevantData[question._id].value = rows[0]
              } else {
                delete relevantData[question._id].value
              }
            }
          }
        }
      }
    }

    return newData
  }
}
