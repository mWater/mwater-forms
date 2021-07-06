export default class HtmlText {
  constructor(html: any) {
    this.html = html
    this.render()
  }

  render() {
    return this.$el.html(this.html)
  }
}
