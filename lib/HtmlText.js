"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Block of HTML Text to include in form
// TODO needed?
var HtmlText;

module.exports = HtmlText = function () {
  function HtmlText(html) {
    (0, _classCallCheck3.default)(this, HtmlText);

    this.html = html;
    this.render();
  }

  (0, _createClass3.default)(HtmlText, [{
    key: "render",
    value: function render() {
      return this.$el.html(this.html);
    }
  }]);
  return HtmlText;
}();