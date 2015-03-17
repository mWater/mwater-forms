var HtmlText;

module.exports = HtmlText = (function() {
  function HtmlText(html) {
    this.html = html;
    this.render();
  }

  HtmlText.prototype.render = function() {
    return this.$el.html(this.html);
  };

  return HtmlText;

})();
