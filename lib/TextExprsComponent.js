"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let TextExprsComponent;
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const async_1 = __importDefault(require("async"));
const formUtils = __importStar(require("./formUtils"));
const mwater_expressions_1 = require("mwater-expressions");
const mwater_expressions_2 = require("mwater-expressions");
const d3_format_1 = __importDefault(require("d3-format"));
const markdown_it_1 = __importDefault(require("markdown-it"));
// Displays a text string with optional expressions embedded in it that are computed
exports.default = TextExprsComponent = (function () {
    TextExprsComponent = class TextExprsComponent extends react_1.default.Component {
        static initClass() {
            this.propTypes = {
                localizedStr: prop_types_1.default.object,
                exprs: prop_types_1.default.array,
                schema: prop_types_1.default.object.isRequired,
                responseRow: prop_types_1.default.object.isRequired,
                locale: prop_types_1.default.string,
                markdown: prop_types_1.default.bool,
                format: prop_types_1.default.string
            };
            // Format to be used by d3 formatter
        }
        constructor(props) {
            super(props);
            this.state = {
                exprValueStrs: [] // Expression values strings to insert
            };
        }
        componentWillMount() {
            // Evaluate expressions
            return this.evaluateExprs();
        }
        componentDidUpdate() {
            // Evaluate expressions
            return this.evaluateExprs();
        }
        evaluateExprs() {
            if (!this.props.exprs || this.props.exprs.length === 0) {
                return;
            }
            // Evaluate each expression
            return async_1.default.map(this.props.exprs, (expr, cb) => {
                return new mwater_expressions_1.PromiseExprEvaluator({ schema: this.props.schema })
                    .evaluate(expr, { row: this.props.responseRow })
                    .then((value) => {
                    // stringify value
                    return cb(null, new mwater_expressions_2.ExprUtils(this.props.schema).stringifyExprLiteral(expr, value, this.props.locale));
                })
                    .catch(() => cb(null, "<error>"));
            }, (error, valueStrs) => {
                // Only update state if changed
                if (!lodash_1.default.isEqual(valueStrs, this.state.exprValueStrs)) {
                    return this.setState({ exprValueStrs: valueStrs });
                }
            });
        }
        render() {
            // Localize string
            let str = formUtils.localizeString(this.props.localizedStr, this.props.locale) || "";
            // Perform substitutions ({0}, {1}, etc.)
            str = str.replace(/\{(\d+)\}/g, (match, index) => {
                index = parseInt(index);
                if (this.state.exprValueStrs[index] != null) {
                    return this.state.exprValueStrs[index];
                }
                return "...";
            });
            if (this.props.markdown) {
                let html = str ? new markdown_it_1.default().render(str) : "";
                // Make sure links are external
                html = html.replace(/<a href=/g, '<a target="_blank" href=');
                return R("div", { dangerouslySetInnerHTML: { __html: html } });
            }
            else {
                str = this.props.format && !lodash_1.default.isNaN(Number(str)) ? d3_format_1.default.format(this.props.format)(str) : str;
                return R("span", null, str);
            }
        }
    };
    TextExprsComponent.initClass();
    return TextExprsComponent;
})();
