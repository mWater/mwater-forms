_ = require 'lodash'
formUtils = require './formUtils'

###

Implements the type of row object required by mwater-expressions' ExprEvaluator. Allows expressions to be evaluated
on responses

###
module.exports = class ResponseRow   
  # Create a response row from a response data object.
  # Options:
  #  responseData: data of entire response
  #  formDesign: design of the form
  #  rosterId: id of roster if it is a roster row
  #  rosterEntryIndex: index of roster row
  #  getEntityById(entityType, entityId, callback): looks up entity
  #    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  #  getEntityByCode(entityType, entityCode, callback): looks up an entity 
  #    callback: called with an entity e.g. { _id: some id, a: "abc", b: 123 } or callback null if entity not found
  constructor: (options) ->
    @options = options
    @formDesign = options.formDesign
    @responseData = options.responseData
    @rosterId = options.rosterId
    @rosterEntryIndex = options.rosterEntryIndex
    @getEntityById = options.getEntityById
    @getEntityByCode = options.getEntityByCode

  # Gets primary key of row. callback is called with (error, value)
  getPrimaryKey: (callback) ->
    # Not available if not roster
    if not @rosterId
      return callback(null, null)

    # Get roster id
    callback(null, @responseData[@rosterId][@rosterEntryIndex]._id)

  # Gets the value of a column. callback is called with (error, value)    
  # For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
  getField: (columnId, callback) ->
    data = @responseData

    # Go into roster
    if @rosterId
      data = @responseData[@rosterId][@rosterEntryIndex].data

    # Handle "response" of roster
    if columnId == "response" and @rosterId
      return callback(null, new ResponseRow(_.omit(@options, "rosterId", "rosterEntryIndex")))

    # Handle "index" of roster
    if columnId == "index" and @rosterId
      return callback(null, @rosterEntryIndex)

    # Handle data
    if columnId.match(/^data:/)
      parts = columnId.split(":")

      # Roster
      if parts.length == 2
        if _.isArray(@responseData[parts[1]])
          return callback(null, _.map(@responseData[parts[1]], (entry, index) =>
            return new ResponseRow(_.extend({}, @options, rosterId: parts[1], rosterEntryIndex: index))
            ))

      # Simple values
      if parts.length == 3 and parts[2] == "value"
        value = data[parts[1]]?.value

        # Null "" and []
        if value == "" or (_.isArray(value) and value.length == 0)
          value = null

        if not value?
          return callback(null, null)

        # Get type of answer
        question = formUtils.findItem(@formDesign, parts[1])
        if not question
          return callback(null, null)

        answerType = formUtils.getAnswerType(question)
        if answerType == "site"
          # Create site entity row
          siteType = (if question.siteTypes then question.siteTypes[0]) or "Water point" 
          entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")

          code = value.code
          if code
            @getEntityByCode(entityType, code, (entity) => callback(null, new EntityRow(entity)))
          else
            callback(null, null)
          return

        if answerType == "entity"
          # Create site entity row
          @getEntityById(question.entityType, value, (entity) => callback(null, new EntityRow(entity)))
          return

        # Location
        if value and value.latitude?
          return callback(null, { type: "Point", coordinates: [value.longitude, value.latitude]})

        return callback(null, value)

      # Value can also recurse for handing matrix, item_choices, altitude, accuracy and CBT
      if parts[2] == "value"
        value = data[parts[1]]?.value

        for part in _.drop(parts, 3)
          value = value?[part]

        return callback(null, value)
        
      # # Altitude and accuracy
      # if parts[2] == "value" and parts[3] in ["altitude", "accuracy"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # # Units
      # if parts[2] == "value" and parts[3] in ["quantity", "units"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # # Aquagenx cbt
      # if parts[2] == "value" and parts[3] == "cbt" and parts[4] in ["c1","c2","c3","c4","c5","healthRisk","mpn","confidence","accuracy"]
      #   return callback(null, data[parts[1]]?.value?[parts[3]]?[parts[4]])

      # if parts[2] == "value" and parts[3] == "image"
      #   return callback(null, data[parts[1]]?.value?[parts[3]])

      # Alternates
      if parts.length == 3 and parts[2] in ['na', 'dontknow']
        return callback(null, data[parts[1]]?.alternate == parts[2] or null)

      # Timestamp
      if parts.length == 3 and parts[2] == "timestamp"
        return callback(null, data[parts[1]]?.timestamp)

      # Location
      if parts.length == 3 and parts[2] == "location"
        if data[parts[1]]?.location
          return callback(null, { type: "Point", coordinates: [data[parts[1]]?.location.longitude, data[parts[1]].location.latitude]})
        else
          return callback(null, null)

      if parts.length == 4 and parts[2] == "location" and parts[3] == "accuracy"
        return callback(null, data[parts[1]]?.location?.accuracy)

      if parts.length == 4 and parts[2] == "location" and parts[3] == "altitude"
        return callback(null, data[parts[1]]?.location?.altitude)

    return callback(null, null)

  # Gets the ordering of a row if they are ordered. Otherwise, not defined or callback null
  getOrdering: (callback) ->
    callback(null, null)

# Entity row created on demand
class EntityRow
  constructor: (entity) ->
    @entity = entity

  # Gets primary key of row. callback is called with (error, value)
  getPrimaryKey: (callback) ->
    callback(null, @entity._id)

  # Gets the value of a column. callback is called with (error, value)    
  # For joins, getField will get array of rows for 1-n and n-n joins and a row for n-1 and 1-1 joins
  getField: (columnId, callback) ->
    callback(null, @entity[columnId])
