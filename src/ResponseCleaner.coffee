_ = require 'lodash'
formUtils = require './formUtils'
conditionUtils = require './conditionUtils'
async = require 'async'

###
ResponseCleaner removes the data entry (answer) of invisible questions and defaults values

The process of cleaning data is an iterative one, as making a question invisible removes its answer, which in turn may make
other questions invisible or visible. 

To further complicate it, when a question becomes visible, it may get a default value, which may in turn trigger other visibility changes

Therefore, it's an iterative process which is also asynchronous, as condition evaluation is asynchronous.

###
module.exports = class ResponseCleaner

  # Cleans data, calling back with { data: cleaned data, visibilityStructure: final visibility structure (since expensive to compute) }
  # The old visibility structure is needed as defaulting of values requires knowledge of how visibility has changed
  # The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
  # and should be repeated until the visibilityStructure is stable.
  # A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
  # Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
  # responseRowFactory: returns responseRow when called with data
  cleanData: (design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, responseRowFactory, oldVisibilityStructure, callback) =>
    nbIterations = 0
    complete = false
    newData = data
    newVisibilityStructure = null

    # This needs to be repeated until it stabilizes
    async.whilst (-> not complete), (cb) =>
      # Compute visibility
      visibilityCalculator.createVisibilityStructure newData, responseRowFactory(newData), (error, visibilityStructure) =>
        if error
          return cb(error)

        newVisibilityStructure = visibilityStructure

        # Clean data
        newData = @cleanDataBasedOnVisibility(newData, newVisibilityStructure)
        newData = @cleanDataBasedOnChoiceConditions(newData, newVisibilityStructure, design)

        # Default values
        if defaultValueApplier
          newData = defaultValueApplier.setStickyData(newData, oldVisibilityStructure, newVisibilityStructure)

        # Set random asked
        if randomAskedCalculator
          newData = randomAskedCalculator.calculateRandomAsked(newData, newVisibilityStructure)

        # Increment iterations
        nbIterations++

        # If the visibilityStructure is still the same twice, the process is now stable.
        if _.isEqual(newVisibilityStructure, oldVisibilityStructure)
          complete = true

        if nbIterations >= 10
          return cb(new Error('Impossible to compute question visibility. The question conditions must be looping'))
  
        # New is now old
        oldVisibilityStructure = newVisibilityStructure

        cb(null)
    , (error) =>
      if error
        return callback(error)

      callback(null, { data: newData, visibilityStructure: newVisibilityStructure })

  # Remove data entries for all the invisible questions
  cleanDataBasedOnVisibility: (data, visibilityStructure) ->
    newData = _.cloneDeep(data)

    for key, visible of visibilityStructure
      if not visible
        values = key.split('.')
        # If the key doesn't contain any '.', simply remove the data entry unless has randomAsked
        if values.length == 1
          if newData[key]?.randomAsked?
            newData[key] = { randomAsked: newData[key].randomAsked }
          else
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
            # Delete the entry, but keep randomAsked
            answerToClean = newData[rosterGroupId][index].data
            if answerToClean
              if answerToClean[questionId]?.randomAsked?
                answerToClean[questionId] = { randomAsked: answerToClean[questionId].randomAsked }
              else
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