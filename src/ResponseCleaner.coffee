# The ResponseCleaner has a very clear ans simple task: removes the data entry (answer) of invisible questions
# The only complexity is the handling of Rosters

formUtils = require './formUtils'
conditionsUtils = require './conditionsUtils'

module.exports = class ResponseCleaner
  # Returns an array containing the cleaned data
  cleanData: (data, visibilityStructure, design) ->
    # NOTE: Always remember that data is immutable
    # Creates a copy of the data and cleans it
    newData = _.clone(data)

    @cleanDataBasedOnVisibility(newData, visibilityStructure)
    @cleanDataBasedOnChoiceConditions(newData, design)

    return newData

  # Remove data entries for all the invisible questions
  cleanDataBasedOnVisibility: (newData, visibilityStructure) ->
    for key, visible of visibilityStructure
      if not visible
        values = key.split('.')
        # If the key doesn't contain any '.', simply remove the data entry
        if values.length == 1
          delete newData[key]
        # Else, it's a RosterGroup or a RosterMatrix
        else
          # The id of the roster containing the data
          rosterGroupId = values[0]
          # The index of the answer
          index = parseInt(values[1])
          # The id of the answered question
          questionId = values[2]
          # If a data entry exist for that roster and that answer index
          if newData[rosterGroupId]? and newData[rosterGroupId][index]?
            # Delete the entry
            answerToClean = newData[rosterGroupId][index]
            delete answerToClean[questionId]

  cleanDataBasedOnChoiceConditions: (newData, design) ->
    questions = formUtils.priorQuestions(design)
    # For each question of the form
    for question in questions
      # Of dropdown or radio type (types with conditional choices)
      if question._type == 'DropdownQuestion' or question._type == 'RadioQuestion'
        for choice in question.choices
          # If one of the choice is conditional
          if choice.conditions
            # And it's the selected choice
            if choice.id == newData[question._id]?.value
              # Test the condition
              if not conditionsUtils.compileConditions(choice.conditions)(newData)
                delete newData[question._id]

