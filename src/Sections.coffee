Backbone = require 'backbone'
_ = require 'lodash'
if process.browser
  require './jquery-scrollintoview'
ezlocalize = require 'ez-localize'

module.exports = class Sections extends Backbone.View
  className: "survey"

  initialize: (options) ->
    # Save options
    @options = options or {}
    @sections = @options.sections

    @T = options.T or ezlocalize.defaultT

    @render()
    
    # Adjust next/prev based on model
    @listenTo(@model, "change", @renderNextPrev)
    
    # Go to first section
    @showSection 0
    return

  events:
    "click #discard": "discard"
    "click #close": "close"
    "click .next": "nextSection"
    "click .prev": "prevSection"
    "click .finish": "finish"
    "click a.section-crumb": "crumbSection"

  finish: ->
    # Validate current section
    section = @sections[@section]
    @trigger "complete"  if section.validate()

  close: ->
    @trigger "close"

  discard: ->
    @trigger "discard"

  crumbSection: (e) ->
    # Go to section
    index = parseInt(e.target.getAttribute("data-value"))
    @showSection index

  getNextSectionIndex: ->
    i = @section + 1
    while i < @sections.length
      return i  if @sections[i].shouldBeVisible()
      i++
    return

  getPrevSectionIndex: ->
    i = @section - 1
    while i >= 0
      return i  if @sections[i].shouldBeVisible()
      i--
    return

  nextSection: ->
    # Validate current section
    section = @sections[@section]
    @showSection @getNextSectionIndex()  if section.validate()

  prevSection: ->
    @showSection @getPrevSectionIndex()

  showSection: (index) ->
    @section = index
    _.each @sections, (s) ->
      s.$el.hide()

    @sections[index].$el.show()
    
    # Setup breadcrumbs
    visibleSections = _.filter(_.take(@sections, index + 1), (s) ->
      s.shouldBeVisible()
    )
    index = 1
    sectionsIndex = _.map _.initial(visibleSections), (s) -> {label: "#{index++}."}
    data = {
      lastSectionLabel: "#{index}. #{_.last(visibleSections).name} "
      sectionsIndex: sectionsIndex
    }
    @$(".breadcrumb").html require('./templates/Sections_breadcrumbs.hbs')(data, helpers: { T: @T })
    @renderNextPrev()
    
    # Scroll into view
    @$el.scrollintoview()

  renderNextPrev: ->
    # Setup next/prev buttons
    @$(".prev").toggle @getPrevSectionIndex()?
    @$(".next").toggle  @getNextSectionIndex()?
    @$(".finish").toggle not @getNextSectionIndex()?

  render: ->
    @$el.html require('./templates/Sections.hbs')({
      submitLabel: @options.submitLabel
      allowSaveForLater: @options.allowSaveForLater
      }, helpers: { T: @T })
    
    # Add sections
    sectionsEl = @$(".sections")
    _.each @sections, (s) ->
      sectionsEl.append s.$el

    this

  # Remove all sections
  remove: ->
    for section in @sections
      section.remove()
      
    # Call built-in remove 
    super()
