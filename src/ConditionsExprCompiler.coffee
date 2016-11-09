_ = require 'lodash'
formUtils = require './formUtils'

# Compiles conditions into mWater expressions
module.exports = class ConditionsExprCompiler
  constructor: (formDesign) ->
    @formDesign = formDesign

    # Index all items
    @itemMap = {}
    for item in formUtils.allItems(formDesign)
      if item._id
        @itemMap[item._id] = item

  compileConditions: (conditions, tableId) ->
    if not conditions or conditions.length == 0
      return null

    # Expressions to be and-ed
    exprs = []
    for cond in conditions
      item = @itemMap[cond.lhs.question]
      if not item
        continue

      type = formUtils.getAnswerType(item)

      if cond.op == "present"
        switch type
          when "text"
            exprs.push({ table: tableId, type: "op", op: "and", exprs: [
              { table: tableId, type: "op", op: "is not null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
              { table: tableId, type: "op", op: "<>", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }, { type: "literal", valueType: "text", value: "" }] }
              ] })
          when "choices", "images"
            exprs.push({ table: tableId, type: "op", op: "and", exprs: [
              { table: tableId, type: "op", op: "is not null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
              { table: tableId, type: "op", op: ">", exprs: [
                { table: tableId, type: "op", op: "length", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] } 
                { type: "literal", valueType: "number", value: 0 }
                ] }
              ] })
          when "aquagenx_cbt"
            exprs.push({ table: tableId, type: "op", op: "or", exprs: [
              { table: tableId, type: "op", op: "is not null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value:cbt:mpn" }] }
              { table: tableId, type: "op", op: "is not null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value:image" }] }
              ] })
          else
            exprs.push({ table: tableId, type: "op", op: "is not null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] })

      else if cond.op == "!present"
        switch type
          when "text"
            exprs.push({ table: tableId, type: "op", op: "or", exprs: [
              { table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
              { table: tableId, type: "op", op: "=", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }, { type: "literal", valueType: "text", value: "" }] }
              ] })
          when "choices", "images"
            exprs.push({ table: tableId, type: "op", op: "or", exprs: [
              { table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
              { table: tableId, type: "op", op: "=", exprs: [
                { table: tableId, type: "op", op: "length", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] } 
                { type: "literal", valueType: "number", value: 0 }
                ] }
              ] })
          when "aquagenx_cbt"
            exprs.push({ table: tableId, type: "op", op: "and", exprs: [
              { table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value:cbt:mpn" }] }
              { table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value:image" }] }
              ] })
          else
            exprs.push({ table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] })
      else if cond.op == "contains"
        exprs.push({ table: tableId, type: "op", op: "~*", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: "text", value: _.escapeRegExp(cond.rhs?.literal or "") }
        ]})
      else if cond.op == "!contains"
        exprs.push({ table: tableId, type: "op", op: "not", exprs: [
          { table: tableId, type: "op", op: "~*", exprs: [
            { table: tableId, type: "field", column: "data:#{item._id}:value" }
            { type: "literal", valueType: "text", value: _.escapeRegExp(cond.rhs?.literal or "") }
          ]}
        ]})
      else if cond.op == "="
        exprs.push({ table: tableId, type: "op", op: "=", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: "number", value: cond.rhs.literal }
        ]})
      else if cond.op == "!="
        exprs.push({ table: tableId, type: "op", op: "<>", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: "number", value: cond.rhs.literal }
        ]})
      else if cond.op == ">"
        exprs.push({ table: tableId, type: "op", op: ">", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: "number", value: cond.rhs.literal }
        ]})
      else if cond.op == "<"
        exprs.push({ table: tableId, type: "op", op: "<", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: "number", value: cond.rhs.literal }
        ]})
      else if cond.op == "is"
        # Special case for alternates
        if cond.rhs.literal in ['na', 'dontknow']
          exprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{cond.rhs.literal}" })
        else
          exprs.push({ table: tableId, type: "op", op: "=", exprs: [
            { table: tableId, type: "field", column: "data:#{item._id}:value" }
            { type: "literal", valueType: "enum", value: cond.rhs.literal }
          ]})
      else if cond.op == "isnt"
        # Special case for alternates
        if cond.rhs.literal in ['na', 'dontknow']
          exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:#{cond.rhs.literal}" }] })
        else
          exprs.push({ table: tableId, type: "op", op: "<>", exprs: [
            { table: tableId, type: "field", column: "data:#{item._id}:value" }
            { type: "literal", valueType: "enum", value: cond.rhs.literal }
          ]})
      else if cond.op == "includes"
        # Special case for alternates
        if cond.rhs.literal in ['na', 'dontknow']
          exprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{cond.rhs.literal}" })
        else
          exprs.push({ table: tableId, type: "op", op: "contains", exprs: [
            { table: tableId, type: "field", column: "data:#{item._id}:value" }
            { type: "literal", valueType: "enumset", value: [cond.rhs.literal] }
          ]})
      else if cond.op == "!includes"
        # Special case for alternates
        if cond.rhs.literal in ['na', 'dontknow']
          exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:#{cond.rhs.literal}" }] })
        else
          exprs.push({ table: tableId, type: "op", op: "not", exprs: [
            { table: tableId, type: "op", op: "contains", exprs: [
              { table: tableId, type: "field", column: "data:#{item._id}:value" }
              { type: "literal", valueType: "enumset", value: [cond.rhs.literal] }
            ]}
          ]})
      else if cond.op == "before"
        rhsType = if item.format.match /ss|LLL|lll|m|h|H/ then "datetime" else "date"

        exprs.push({ table: tableId, type: "op", op: "<", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: rhsType, value: cond.rhs.literal }
        ]})
      else if cond.op == "after"
        rhsType = if item.format.match /ss|LLL|lll|m|h|H/ then "datetime" else "date"

        exprs.push({ table: tableId, type: "op", op: ">", exprs: [
          { table: tableId, type: "field", column: "data:#{item._id}:value" }
          { type: "literal", valueType: rhsType, value: cond.rhs.literal }
        ]})
      else if cond.op == "true"
        exprs.push({ table: tableId, type: "field", column: "data:#{item._id}:value" })
      else if cond.op == "false"
        exprs.push({ table: tableId, type: "op", op: "or", exprs: [
          { table: tableId, type: "op", op: "is null", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
          { table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:value" }] }
        ]})
      else if cond.op == "isoneof"
        # Get alternates and values
        values = _.filter(cond.rhs.literal, (v) -> v not in ['na', 'dontknow'])
        alternates = _.filter(cond.rhs.literal, (v) -> v in ['na', 'dontknow'])

        if type == "choice"
          if values.length == 0 and alternates.length == 1
            exprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{alternates[0]}" })
          else if values.length == 0 and alternates.length > 1
            exprs.push({ table: tableId, type: "op", op: "or", exprs: _.map(alternates, ((alt) -> { table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })) })
          else 
            subexprs = [{ table: tableId, type: "op", op: "= any", exprs: [
              { table: tableId, type: "field", column: "data:#{item._id}:value" }
              { type: "literal", valueType: "enumset", value: values }
            ]}]
            for alt in alternates
              subexprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })

            if subexprs.length == 1
              exprs.push(subexprs[0])
            else
              exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs })

        else if type == "choices"
          subexprs = []
          for value in values
            subexprs.push({ table: tableId, type: "op", op: "contains", exprs: [
              { table: tableId, type: "field", column: "data:#{item._id}:value" }
              { type: "literal", valueType: "enumset", value: [value] }
            ]})
          for alt in alternates
            subexprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })

          if subexprs.length == 1
            exprs.push(subexprs[0])
          else
            exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs })
      else if cond.op == "isntoneof"
        # Get alternates and values
        values = _.filter(cond.rhs.literal, (v) -> v not in ['na', 'dontknow'])
        alternates = _.filter(cond.rhs.literal, (v) -> v in ['na', 'dontknow'])

        if type == "choice"
          if values.length == 0 and alternates.length == 1
            exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "field", column: "data:#{item._id}:#{alternates[0]}" }] })
          else if values.length == 0 and alternates.length > 1
            exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "op", op: "or", exprs: _.map(alternates, ((alt) -> { table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })) }] })
          else 
            subexprs = [{ table: tableId, type: "op", op: "= any", exprs: [
              { table: tableId, type: "field", column: "data:#{item._id}:value" }
              { type: "literal", valueType: "enumset", value: values }
            ]}]
            for alt in alternates
              subexprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })

            if subexprs.length == 1
              exprs.push({ table: tableId, type: "op", op: "not", exprs: [subexprs[0]] })
            else
              exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "op", op: "or", exprs: subexprs }] })

        else if type == "choices"
          subexprs = []
          for value in values
            subexprs.push({ table: tableId, type: "op", op: "contains", exprs: [
              { table: tableId, type: "field", column: "data:#{item._id}:value" }
              { type: "literal", valueType: "enumset", value: [value] }
            ]})
          for alt in alternates
            subexprs.push({ table: tableId, type: "field", column: "data:#{item._id}:#{alt}" })

          if subexprs.length == 1
            exprs.push({ table: tableId, type: "op", op: "not", exprs: [subexprs[0]] })
          else
            exprs.push({ table: tableId, type: "op", op: "not", exprs: [{ table: tableId, type: "op", op: "or", exprs: subexprs }] })

                
    # Make into big and
    if exprs.length == 0
      return null
    if exprs.length == 1
      return exprs[0]

    return { table: tableId, type:"op", op: "and", exprs: exprs }
