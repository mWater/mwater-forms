"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HtmlText {
    constructor(html) {
        this.html = html;
        this.render();
    }
    render() {
        return this.$el.html(this.html);
    }
}
exports.default = HtmlText;
