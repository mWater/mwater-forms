# Block of HTML Text to include in form
# TODO needed?
module.exports = class HtmlText
  constructor: (html) ->
    @html = html
    @render()

  render: ->
    @$el.html(@html)