"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// Block of HTML Text to include in form
// TODO needed?
var HtmlText;

module.exports = HtmlText =
/*#__PURE__*/
function () {
  function HtmlText(html) {
    (0, _classCallCheck2.default)(this, HtmlText);
    this.html = html;
    this.render();
  }

  (0, _createClass2.default)(HtmlText, [{
    key: "render",
    value: function render() {
      return this.$el.html(this.html);
    }
  }]);
  return HtmlText;
}();