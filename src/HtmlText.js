// Block of HTML Text to include in form
// TODO needed?
let HtmlText;

export default HtmlText = class HtmlText {
  constructor(html) {
    this.html = html;
    this.render();
  }

  render() {
    return this.$el.html(this.html);
  }
};