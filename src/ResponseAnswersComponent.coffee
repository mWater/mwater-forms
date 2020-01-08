PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

formUtils = require './formUtils'
moment = require 'moment'
ezlocalize = require 'ez-localize'
ui = require 'react-library/lib/bootstrap'
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent')
VisibilityCalculator = require './VisibilityCalculator'
ResponseRow = require('./ResponseRow').default
TextExprsComponent = require './TextExprsComponent'

ImageDisplayComponent = require './ImageDisplayComponent'
EntityDisplayComponent = require './EntityDisplayComponent'
AdminRegionDisplayComponent = require './AdminRegionDisplayComponent'

AquagenxCBTDisplayComponent = require './answers/AquagenxCBTDisplayComponent'
CascadingListDisplayComponent = require("./answers/CascadingListDisplayComponent").CascadingListDisplayComponent
CascadingRefDisplayComponent = require("./answers/CascadingRefDisplayComponent").CascadingRefDisplayComponent

# Displays the answers of a response in a table
module.exports = class ResponseAnswersComponent extends AsyncLoadComponent
  @propTypes:
    formDesign: PropTypes.object.isRequired
    data: PropTypes.object.isRequired
    schema: PropTypes.object.isRequired  # Schema of the 

    hideEmptyAnswers: PropTypes.bool # True to hide empty answers

    locale: PropTypes.string # Defaults to english
    T: PropTypes.func.isRequired  # Localizer to use
    formCtx: PropTypes.object.isRequired    # Form context to use

    prevData: PropTypes.object # Previous data
    showPrevAnswers: PropTypes.bool
    highlightChanges: PropTypes.bool
    hideUnchangedAnswers: PropTypes.bool
    showChangedLink: PropTypes.bool
    onChangedLinkClick: PropTypes.func
    onCompleteHistoryLinkClick: PropTypes.func

  # Check if form design or data are different
  isLoadNeeded: (newProps, oldProps) ->
    return not _.isEqual(newProps.formDesign, oldProps.formDesign) or not _.isEqual(newProps.data, oldProps.data) 

  # Call callback with state changes
  load: (props, prevProps, callback) ->
    responseRow = new ResponseRow({
      responseData: props.data
      formDesign: props.formDesign
      getEntityById: props.formCtx.getEntityById
      getEntityByCode: props.formCtx.getEntityByCode
      getCustomTableRow: props.formCtx.getCustomTableRow
    })

    # Calculate visibility asynchronously
    new VisibilityCalculator(props.formDesign, props.schema).createVisibilityStructure(props.data, responseRow, (error, visibilityStructure) =>
      callback(error: error, visibilityStructure: visibilityStructure)
    )

  handleLocationClick: (location) ->
    if @props.formCtx.displayMap
      @props.formCtx.displayMap(location)

  renderLocation: (location) ->
    if location
      return R 'div', null, 
        R 'a', onClick: @handleLocationClick.bind(this, location), style: { cursor: "pointer" },
          "#{location.latitude}\u00B0 #{location.longitude}\u00B0"
          if location.accuracy then "(+/-) #{location.accuracy} m"

  renderAnswer: (q, answer) ->
    if not answer
      return null

    # Handle alternates
    if answer.alternate
      switch answer.alternate 
        when "na"
          return R 'em', null, @props.T("Not Applicable")
        when "dontknow"
          return R 'em', null, @props.T("Don't Know")

    if answer.confidential?
      return R 'em', null, T("Redacted")
    
    if not answer.value?
      return null
    
    switch formUtils.getAnswerType(q)
      when "text"
        # Format as url if url
        if answer.value and answer.value.match(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/)
          # Open in system window if in cordova
          target = if window.cordova? then "_system" else "_blank"
          return R 'a', href: answer.value, target: target, 
            answer.value

        return answer.value
      when "number"
        return "" + answer.value
      when "choice"
        choice = _.findWhere(q.choices, { id: answer.value })
        if choice
          label = formUtils.localizeString(choice.label, @props.locale)
          if answer.specify?
            specify = answer.specify[answer.value]
          else
            specify = null

          return R 'div', null,
            label
            if specify 
              ": "  
              R 'em', null, specify
        else
          return R 'span', className: "label label-danger", "Invalid Choice"
      when "choices"
        return _.map answer.value, (v) => 
          choice = _.findWhere(q.choices, { id: v })
          if choice
            return R 'div', null, 
              formUtils.localizeString(choice.label, @props.locale)
              if answer.specify? and answer.specify[v]
                ": "
                R 'em', null, answer.specify[v]
          else 
            return R 'div', className: "label label-danger", "Invalid Choice"
  
      when "date"
        # Depends on precision
        if answer.value.length <= 7   # YYYY or YYYY-MM
          return R 'div', null, answer.value
        else if answer.value.length <= 10 # Date
          return R 'div', null, moment(answer.value).format("LL")
        else
          return R 'div', null, moment(answer.value).format("LLL")

      when "units"
        if answer.value and answer.value.quantity? and answer.value.units?
          # Find units
          units = _.findWhere(q.units, { id: answer.value.units })

          valueStr = "" + answer.value.quantity
          unitsStr = if units then formUtils.localizeString(units.label, @props.locale) else "(Invalid)"

          if q.unitsPosition == "prefix" 
            return R 'div', null,
              R 'em', null, unitsStr
              " "
              valueStr
          else 
            return R 'div', null,
              valueStr
              " "
              R 'em', null, unitsStr

      when "boolean"
        return if answer.value then @props.T("True") else @props.T("False")

      when "location"
        return @renderLocation(answer.value)

      when "image"
        if answer.value
          return R(ImageDisplayComponent, image: answer.value, imageManager: @props.formCtx.imageManager, T: @props.T)

      when "images"
        return _.map answer.value, (img) =>
          R(ImageDisplayComponent, image: img, imageManager: @props.formCtx.imageManager, T: @props.T)

      when "texts"
        return _.map answer.value, (txt) =>
          R 'div', null, txt

      when "site"
        code = answer.value
        # TODO Eventually always go to code parameter. Legacy responses used code directly as value.
        if _.isObject(code)
          code = code.code

        # Convert to new entity type
        siteType = (if q.siteTypes then q.siteTypes[0]) or "water_point" 
        entityType = siteType.toLowerCase().replace(new RegExp(' ', 'g'), "_")

        return R(EntityDisplayComponent, {
          entityCode: code
          entityType: entityType
          getEntityByCode: @props.formCtx.getEntityByCode
          renderEntityView: @props.formCtx.renderEntitySummaryView
          T: @props.T
        })

      when "entity"
        return R(EntityDisplayComponent, {
          entityId: answer.value
          entityType: q.entityType
          getEntityById: @props.formCtx.getEntityById
          renderEntityView: @props.formCtx.renderEntitySummaryView
          T: @props.T
        })

      when "admin_region"
        return R(AdminRegionDisplayComponent, {
          getAdminRegionPath: @props.formCtx.getAdminRegionPath
          value: answer.value
          T: @props.T
        })

      when "items_choices"
        for item in q.items
          choiceId = answer.value[item.id]
          if choiceId?
            choice = _.findWhere(q.choices, { id: choiceId })
            if choice?
              return R 'div', null,
                formUtils.localizeString(choice.label, @props.locale)
            else
              return R 'span', className: "label label-danger", "Invalid Choice"

      when "aquagenx_cbt"
        return R AquagenxCBTDisplayComponent, 
          value: answer.value
          questionId: q._id
          imageManager: @props.formCtx.imageManager

      when "cascading_list"
        return R CascadingListDisplayComponent,
          question: q
          value: answer.value
          locale: @props.locale

      when "cascading_ref"
        return R CascadingRefDisplayComponent,
          question: q
          value: answer.value
          locale: @props.locale
          schema: @props.schema
          getCustomTableRow: @props.formCtx.getCustomTableRow

  # Special render on multiple rows
  renderMatrixAnswer: (q, answer, prevAnswer) ->
    if not answer
      return null
    if answer.alternate
      return null
    if not answer.value?
      return null

    if formUtils.getAnswerType(q) == "items_choices"
      contents = []
      for item in q.items
        itemTd = R 'td', style: {textAlign: "center"},
          formUtils.localizeString(item.label, @props.locale)
        choiceId = answer.value[item.id]
        if choiceId?
          choice = _.findWhere(q.choices, { id: choiceId })
          if choice?
            contents.push R 'tr', null,
              itemTd,
              R 'td', null,
                formUtils.localizeString(choice.label, @props.locale)
          else
            contents.push R 'tr', null,
              itemTd,
              R 'td', null,
                R 'span', className: "label label-danger", "Invalid Choice"

          if @props.showPrevAnswers and prevAnswer
            choiceId = prevAnswer.value[item.id]
            if choiceId?
              choice = _.findWhere(q.choices, { id: choiceId })
              if choice?
                contents.push R 'tr', null,
                  itemTd,
                  R 'td', null,
                    formUtils.localizeString(choice.label, @props.locale)
              else
                contents.push R 'tr', null,
                  itemTd,
                  R 'td', null,
                    R 'span', className: "label label-danger", "Invalid Choice"
      return contents
    else
      return null


  renderQuestion: (q, dataId) ->
    # Get answer
    dataIds = dataId.split('.')
    if dataIds.length == 1
      answer = @props.data[dataId]
    else
      rosterData = @props.data[dataIds[0]]
      if rosterData.value?
        rosterData = rosterData.value
        answer = rosterData[dataIds[1]][dataIds[2]]
      else
        answer = rosterData[dataIds[1]].data[dataIds[2]]

    # Do not display if empty and hide empty true
    if @props.hideEmptyAnswers and not answer?.value? and not answer?.alternate
      return null

    prevAnswer = null
    trProps = 
      key: dataId

    if @props.prevData
      if dataIds.length == 1
        prevAnswer = @props.prevData.data[dataId]
      else
        prevRosterData = @props.prevData.data[dataIds[0]]
        if prevRosterData?
          if prevRosterData.value?
            prevRosterData = prevRosterData.value
            prevAnswer = prevRosterData[dataIds[1]]?[dataIds[2]]
          else
            prevAnswer = prevRosterData[dataIds[1]]?.data[dataIds[2]]

    matrixAnswer = @renderMatrixAnswer(q, answer, prevAnswer)

    # If both answer and previous answer are falsy
    if not prevAnswer and not answer?.value? and @props.hideUnchangedAnswers
      return null

    if not _.isEqual(prevAnswer?.value, answer?.value) or not _.isEqual(prevAnswer?.specify, answer?.specify)
      if @props.highlightChanges
        trProps['style'] = { background: '#ffd'}
    else 
      if @props.hideUnchangedAnswers
        return null

    return [
      R 'tr', trProps,
        R 'td', key: "name", style: { width: "50%" },
          formUtils.localizeString(q.text, @props.locale)
        R 'td', key: "value",
          R 'div', null,
            if not matrixAnswer?
              @renderAnswer(q, answer, dataId)
            if answer and answer.timestamp
              
                @props.T('Answered')
                ": "
                moment(answer.timestamp).format('llll')
            if answer and answer.location
              @renderLocation(answer.location)
            
            if prevAnswer? and not _.isEqual(prevAnswer.value, answer?.value) and @props.showChangedLink
              R 'a', style: { float: 'right', display: 'inline-block', cursor: 'pointer', fontSize: 9 }, onClick: @props.onChangedLinkClick, key: 'view_change',
                R ui.Icon, id: "glyphicon-pencil"
                " " 
                T("Edited")

        if @props.showPrevAnswers and @props.prevData
          R 'td', key: "prevValue",
            if prevAnswer? and not _.isEqual(prevAnswer.value, answer?.value) and @props.onCompleteHistoryLinkClick
              R 'a', style: { float: 'right', display: 'inline-block', cursor: 'pointer', fontSize: 9 }, onClick: @props.onCompleteHistoryLinkClick, key: 'view_history',
                T("Show Changes")

            if not prevMatrixAnswer?
              @renderAnswer(q, prevAnswer)
            if prevAnswer and prevAnswer.timestamp
              R 'div', null,
                @props.T('Answered')
                ": "
                moment(prevAnswer.timestamp).format('llll')
            if prevAnswer and prevAnswer.location
              @renderLocation(prevAnswer.location)
      matrixAnswer
    ]

  # Add all the items with the proper rosterId to items array
  # Looks inside groups and sections
  collectItemsReferencingRoster: (items, contents, rosterId) ->
    # Get the contents of all the other question that are referencing this roster
    for otherItem in contents
      if otherItem._type == 'Group' or otherItem._type == 'Section'
        @collectItemsReferencingRoster(items, otherItem.contents, rosterId)
      if otherItem.rosterId == rosterId
        items.push.apply(items, otherItem.contents);

  # dataId is the key used for looking up the data + testing visibility
  # dataId is simply item._id except for rosters children
  renderItem: (item, visibilityStructure, dataId) ->
    if not visibilityStructure[dataId]
      return

    colspan = if (@props.showPrevAnswers and @props.prevData) then 3 else 2
    # Sections and Groups behave the same
    if item._type == "Section" or item._type == "Group"
      contents = _.map item.contents, (item) =>
        id = item._id
        if dataId  # The group is inside a roster
          parts = dataId.split(".")
          parts.pop()
          parts.push(item._id)
          id = parts.join(".")
        @renderItem(item, visibilityStructure, id)

      # Remove nulls
      contents = _.compact(contents)

      # Do not display if empty
      if contents.length == 0
        return null

      return [
        R 'tr', key: item._id,
          R 'td', colSpan: colspan, style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)
        contents
      ]

    # RosterMatrices and RosterGroups behave the same
    # Only the one storing the data will display it
    # The rosters referencing another one will display a simple text to say so
    if item._type == "RosterMatrix" or item._type == "RosterGroup"
      items = []
      # Simply display a text referencing the other roster if a reference
      if item.rosterId?
        # Unless hiding empty, in which case blank
        if @props.hideEmptyAnswers
          return null

        referencedRoster = formUtils.findItem(@props.formDesign, item.rosterId)
        return R 'tr', null,
          R 'td', style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)
          R 'td', colSpan: colspan-1,
            R 'span', style: {fontStyle: 'italic'},
              @props.T("Data is stored in {0}", formUtils.localizeString(referencedRoster.name, @props.locale))

      # Get the data for that roster
      data = @props.data[item._id]

      if (not data or data.length == 0) and @props.hideEmptyAnswers
        return null

      # Get the questions of the other rosters referencing this one
      items = _.clone(item.contents)
      @collectItemsReferencingRoster(items, @props.formDesign.contents, item._id)

      return [
        R 'tr', key: item._id,
          R 'td', colSpan: colspan, style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)

        if data?
          # For each entry in data
          for entry, index in data
            contents = _.map items, (childItem) =>
              dataId = "#{item._id}.#{index}.#{childItem._id}"
              @renderItem(childItem, visibilityStructure, dataId)

            # Remove nulls
            contents = _.compact(contents)

            # Do not display if empty
            if contents.length == 0
              null
            else
              [
                # Display the index of the answer
                R 'tr', null,
                  R 'td', colSpan: colspan, style: { fontWeight: "bold" },
                    "#{index+1}."
                # And the answer for each question
                contents
              ]
      ]

    if item._type == "MatrixQuestion"
      answer = @props.data[dataId]
      if answer?.value?
        rows = []
        rows.push R 'tr', key: item._id,
          R 'td', colSpan: colspan, style: { fontWeight: "bold" },
            formUtils.localizeString(item.name, @props.locale)
        for rowItem in item.items
          itemValue = answer.value[rowItem.id]
          if itemValue
            rows.push R 'tr', null,
              R 'td', colSpan: colspan, style: { fontStyle: 'italic' },
                formUtils.localizeString(rowItem.label, @props.locale)
            for column in item.columns
              if itemValue[column._id]
                dataId = "#{item._id}.#{rowItem.id}.#{column._id}"
                rows.push @renderItem(column, visibilityStructure, dataId)
        return rows
      else
        return null

    if formUtils.isQuestion(item)
      return @renderQuestion(item, dataId)
    
    if formUtils.isExpression(item)
      return @renderExpression(item, dataId)

  renderExpression: (q, dataId) -> 
    return [
      R 'tr', key: dataId,
        R 'td', key: "name", style: { width: "50%" },
          formUtils.localizeString(q.text, @props.locale)
        R 'td', key: "value",
          R 'div', null,
            @renderExpressionAnswer(q, dataId)

        if @props.showPrevAnswers and @props.prevData
          R 'td', key: "prevValue", null 
    ]
  
  renderExpressionAnswer: (q, dataId) ->
    rosterId = null
    rosterEntryIndex = undefined
    if dataId?
      dataIds = dataId.split('.')
      rosterId = dataIds[0]
      rosterEntryIndex = dataIds[1]

    return R TextExprsComponent,
      localizedStr: if q._type == "TextColumn" then q.cellText else {_base: "en", en: "{0}"}
      exprs: if q._type == "TextColumn" then q.cellTextExprs else [q.expr]
      schema: @props.schema
      format: q.format
      responseRow: new ResponseRow({
        responseData: @props.data
        schema: @props.schema
        formDesign: @props.formDesign
        rosterId: rosterId
        rosterEntryIndex: rosterEntryIndex
        getEntityById: @props.formCtx.getEntityById
        getEntityByCode: @props.formCtx.getEntityByCode
      })
      locale: @props.locale

  render: ->
    if @state.error
      return R 'div', className: "alert alert-danger", 
        @state.error.message

    if not @state.visibilityStructure
      return R 'div', null, "Loading..."

    R 'table', className: "table table-bordered table-condensed", style: { marginBottom: 0 },
      R 'thead', null,
        R 'tr', null,
          R 'th', null, "Question"
          R 'th', null, "Answer"
          if @props.showPrevAnswers
            R 'th', null, "Original Answer"
      R 'tbody', null, 
        _.map @props.formDesign.contents, (item) =>
          @renderItem(item, @state.visibilityStructure, item._id)

