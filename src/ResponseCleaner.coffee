_ = require 'lodash'
formUtils = require './formUtils'
conditionUtils = require './conditionUtils'

###
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as 

###
module.exports = class ResponseCleaner
  # Returns an array containing the cleaned data
  cleanData: (data, visibilityStructure, design) ->
    newData = @cleanDataBasedOnVisibility(data, visibilityStructure)
    newData = @cleanDataBasedOnChoiceConditions(newData, visibilityStructure, design)
    return newData

  # Remove data entries for all the invisible questions
  cleanDataBasedOnVisibility: (data, visibilityStructure) ->
    newData = _.cloneDeep(data)

    for key, visible of visibilityStructure
      if not visible
        values = key.split('.')
        # If the key doesn't contain any '.', simply remove the data entry
        if values.length == 1
          delete newData[key]
        # Check if value is an array, which indicates roster
        else if _.isArray(newData[values[0]])
          # The id of the roster containing the data
          rosterGroupId = values[0]
          # The index of the answer
          index = parseInt(values[1])
          # The id of the answered question
          questionId = values[2]
          # If a data entry exist for that roster and that answer index
          if newData[rosterGroupId]? and newData[rosterGroupId][index]?
            # Delete the entry
            answerToClean = newData[rosterGroupId][index].data
            if answerToClean
              delete answerToClean[questionId]
        else # Must be a matrix
          matrixId = values[0]
          itemId = values[1]
          questionId = values[2]
          if itemId and questionId and newData[matrixId]?[itemId]?[questionId]
            delete (newData[matrixId][itemId])[questionId]

    return newData

  # Remove data entries for all the conditional choices that are false
  # 'DropdownQuestion', 'RadioQuestion' and 'DropdownColumnQuestion' can have choices that are only present if a condition
  # is filled. If the condition is no longer filled, the answer data needs to be removed
  cleanDataBasedOnChoiceConditions: (data, visibilityStructure, design) ->
    newData = _.cloneDeep(data)

    for key, visible of visibilityStructure
      if visible
        values = key.split('.')
        selectedChoice = null

        # FIRST: Setup what is needed for the cleaning the data (different for rosters)
        # If the key doesn't contain any '.', simply remove the data entry
        if values.length == 1
          questionId = key
          conditionData = newData
          selectedChoice = newData[questionId]?.value
          # A simple delete
          deleteAnswer = () ->
            delete newData[questionId]
        # Check if value is an array, which indicates roster
        else if _.isArray(newData[values[0]])
          # The id of the roster containing the data
          rosterGroupId = values[0]
          # The index of the answer
          index = parseInt(values[1])
          # The id of the answered question
          questionId = values[2]
          if newData[rosterGroupId]? and newData[rosterGroupId][index]?
            # Delete the entry
            conditionData = newData[rosterGroupId][index].data
            selectedChoice = conditionData?[questionId]?.value
            deleteAnswer = () ->
              # Need to find what needs to be cleaned first (with roster data)
              answerToClean = newData[rosterGroupId][index].data
              delete answerToClean[questionId]

        # SECOND: look for conditional choices and delete their answer if the conditions are false
        if selectedChoice?
          # Get the question
          question = formUtils.findItem(design, questionId)
          # Of dropdown or radio type (types with conditional choices)
          if question._type == 'DropdownQuestion' or question._type == 'RadioQuestion' or question._type == 'DropdownColumnQuestion'
            for choice in question.choices
              # If one of the choice is conditional
              if choice.conditions
                # And it's the selected choice
                if choice.id == selectedChoice
                  # Test the condition
                  if not conditionUtils.compileConditions(choice.conditions)(conditionData)
                    deleteAnswer()

    return newData