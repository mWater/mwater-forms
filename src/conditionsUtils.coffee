
# This code has been copied from FromCompiler, only getValue and getAlternate have been changed
exports.compileCondition = compileCondition = (cond) =>
  getValue = (data) =>
    answer = data[cond.lhs.question] || {}
    return answer.value

  getAlternate = (data) =>
    answer = data[cond.lhs.question] || {}
    return answer.alternate

  switch cond.op
    when "present"
      return (data) =>
        value = getValue(data)
        present = not(not value) and not (value instanceof Array and value.length == 0)
        if not present
          return false
        # If present, let's make sure that at least one field is set if it's an object
        else
          if value instanceof Object
            for key,v of value
              if v?
                return true
            # Not present, since the object has no set fields
            return false
          else
            return true
    when "!present"
      return (data) =>
        value = getValue(data)
        notPresent = (not value) or (value instanceof Array and value.length == 0)
        if notPresent
          return true
        # If present, let's make sure that at least one field is set if it's an object
        else
          if value instanceof Object
            for key,v of value
              if v?
                return false
            # Not present, since the object has no set fields
            return true
          else
            return false
    when "contains"
      return (data) =>
        return (getValue(data) or "").indexOf(cond.rhs.literal) != -1
    when "!contains"
      return (data) =>
        return (getValue(data) or "").indexOf(cond.rhs.literal) == -1
    when "="
      return (data) =>
        return getValue(data) == cond.rhs.literal
    when ">", "after"
      return (data) =>
        return getValue(data) > cond.rhs.literal
    when "<", "before"
      return (data) =>
        return getValue(data) < cond.rhs.literal
    when "!="
      return (data) =>
        return getValue(data) != cond.rhs.literal
    when "includes"
      return (data) =>
        return _.contains(getValue(data) or [], cond.rhs.literal) or cond.rhs.literal == getAlternate(data)
    when "!includes"
      return (data) =>
        return not _.contains(getValue(data) or [], cond.rhs.literal) and cond.rhs.literal != getAlternate(data)
    when "is"
      return (data) =>
        return getValue(data) == cond.rhs.literal or getAlternate(data) == cond.rhs.literal
    when "isnt"
      return (data) =>
        return getValue(data) != cond.rhs.literal and getAlternate(data) != cond.rhs.literal
    when "isoneof"
      return (data) =>
        value = getValue(data)
        if _.isArray(value)
          return _.intersection(cond.rhs.literal, value).length > 0 or _.contains(cond.rhs.literal, getAlternate(data))
        else
          return _.contains(cond.rhs.literal, value) or _.contains(cond.rhs.literal, getAlternate(data))
    when "isntoneof"
      return (data) =>
        value = getValue(data)
        if _.isArray(value)
          return _.intersection(cond.rhs.literal, value).length == 0 and not _.contains(cond.rhs.literal, getAlternate(data))
        else
          return not _.contains(cond.rhs.literal, value) and not _.contains(cond.rhs.literal, getAlternate(data))
    when "true"
      return (data) =>
        return getValue(data) == true
    when "false"
      return (data) =>
        return getValue(data) != true
    else
      throw new Error("Unknown condition op " + cond.op)

# This code has been copied from FromCompiler
exports.compileConditions = (conds) =>
  compConds = _.map(conds, @compileCondition)
  return (data) =>
    for compCond in compConds
      if not compCond(data)
        return false

    return true