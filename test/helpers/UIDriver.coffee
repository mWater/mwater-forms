$ = require 'jquery'
assert = require("chai").assert

class UIDriver
  constructor: (el) ->
    @el = $(el)

  getDisabled: (str) ->
    for item in @el.find("a,button")
      if $(item).text().indexOf(str) != -1
        return $(item).is(":disabled")
    assert.fail(null, str, "Can't find: " + str)

  click: (str) ->
    for item in @el.find("a,button")
      if $(item).text().indexOf(str) != -1
        #console.log "Clicking: " + $(item).text()
        $(item).trigger("click")
        return
    assert.fail(null, str, "Can't find: " + str)
  
  fill: (str, value) ->
    for item in @el.find("label")
      if $(item).text().indexOf(str) != -1
        box = @el.find("#"+$(item).attr('for'))
        box.val(value)
  
  text: ->
    return @el.text()
      
  html: ->
    return @el.html()
    
  wait: (after) ->
    setTimeout after, 10

module.exports = UIDriver