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
let MatrixAnswerComponent;
const lodash_1 = __importDefault(require("lodash"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("../formUtils"));
const MatrixColumnCellComponent_1 = __importDefault(require("../MatrixColumnCellComponent"));
const ValidationCompiler_1 = __importDefault(require("./ValidationCompiler"));
// Matrix with columns and items
exports.default = MatrixAnswerComponent = (function () {
    MatrixAnswerComponent = class MatrixAnswerComponent extends react_1.default.Component {
        constructor(props) {
            super(props);
            this.handleCellChange = (item, column, answer) => {
                let matrixValue = this.props.value || {};
                // Get data of the item, which is indexed by item id in the answer
                let itemData = matrixValue[item.id] || {};
                // Set column in item
                let change = {};
                change[column._id] = answer;
                itemData = lodash_1.default.extend({}, itemData, change);
                // Set item data within value
                change = {};
                change[item.id] = itemData;
                matrixValue = lodash_1.default.extend({}, matrixValue, change);
                return this.props.onValueChange(matrixValue);
            };
            this.state = {
                validationErrors: {} // Map of "<item.id>_<column.id>" to validation error
            };
        }
        static initClass() {
            this.contextTypes = { locale: prop_types_1.default.string }; // Current locale (e.g. "en")
            this.propTypes = {
                items: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                    // Unique (within the question) id of the item. Cannot be "na" or "dontknow" as they are reserved for alternates
                    id: prop_types_1.default.string.isRequired,
                    // Label of the choice, localized
                    label: prop_types_1.default.object.isRequired,
                    // Hint associated with a choice
                    hint: prop_types_1.default.object
                })).isRequired,
                // Array of matrix columns
                columns: prop_types_1.default.array.isRequired,
                value: prop_types_1.default.object,
                onValueChange: prop_types_1.default.func.isRequired,
                alternate: prop_types_1.default.string,
                data: prop_types_1.default.object,
                responseRow: prop_types_1.default.object,
                schema: prop_types_1.default.object.isRequired
            };
            // Schema to use, including form
        }
        focus() {
            // TODO
            return null;
        }
        // Validate a matrix answer. Returns true if invalid was found, false otherwise
        validate() {
            var _a, _b;
            // Alternate selected means cannot be invalid
            if (this.props.alternate) {
                return false;
            }
            const validationErrors = {};
            // Important to let know the caller if something has been found (so it can scrollToFirst properly)
            let foundInvalid = false;
            // For each entry
            for (let rowIndex = 0; rowIndex < this.props.items.length; rowIndex++) {
                // For each column
                const item = this.props.items[rowIndex];
                for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
                    const column = this.props.columns[columnIndex];
                    const key = `${item.id}_${column._id}`;
                    const data = (_b = (_a = this.props.value) === null || _a === void 0 ? void 0 : _a[item.id]) === null || _b === void 0 ? void 0 : _b[column._id];
                    if (column.required && ((data === null || data === void 0 ? void 0 : data.value) == null || (data === null || data === void 0 ? void 0 : data.value) === "")) {
                        foundInvalid = true;
                        validationErrors[key] = true;
                        continue;
                    }
                    if (column.validations && column.validations.length > 0) {
                        const validationError = new ValidationCompiler_1.default(this.context.locale).compileValidations(column.validations)(data);
                        if (validationError) {
                            foundInvalid = true;
                            validationErrors[key] = validationError;
                        }
                    }
                }
            }
            // Save state
            this.setState({ validationErrors });
            return foundInvalid;
        }
        renderColumnHeader(column, index) {
            return R("th", { key: `header:${column._id}` }, formUtils.localizeString(column.text, this.context.locale), 
            // Required star
            column.required ? R("span", { className: "required" }, "*") : undefined);
        }
        // Render the header row
        renderHeader() {
            return R("thead", null, R("tr", null, 
            // First item
            R("th", null), lodash_1.default.map(this.props.columns, (column, index) => this.renderColumnHeader(column, index))));
        }
        renderCell(item, itemIndex, column, columnIndex) {
            const matrixValue = this.props.value || {};
            // Get data of the item, which is indexed by item id in the answer
            const itemData = matrixValue[item.id] || {};
            // Get cell answer which is inside the item data, indexed by column id
            const cellAnswer = itemData[column._id] || {};
            // Determine if invalid
            const key = `${item.id}_${column._id}`;
            const invalid = this.state.validationErrors[key];
            // Render cell
            return R(MatrixColumnCellComponent_1.default, {
                key: column._id,
                column,
                data: this.props.data,
                responseRow: this.props.responseRow,
                answer: cellAnswer,
                onAnswerChange: this.handleCellChange.bind(null, item, column),
                invalid: invalid != null,
                schema: this.props.schema
            });
        }
        renderItem(item, index) {
            return R("tr", { key: index }, R("td", { key: "_item" }, R("label", null, formUtils.localizeString(item.label, this.context.locale)), item.hint
                ? [R("br"), R("div", { className: "text-muted" }, formUtils.localizeString(item.hint, this.context.locale))]
                : undefined), lodash_1.default.map(this.props.columns, (column, columnIndex) => this.renderCell(item, index, column, columnIndex)));
        }
        render() {
            // Create table
            // borderCollapse is set to separate (overriding bootstrap table value), so that we can properly see the validation
            // error borders (or else the top one of the first row is missing since it's being collapsed with the th border)
            return R("table", { className: "table", style: { borderCollapse: "separate" } }, this.renderHeader(), R("tbody", null, lodash_1.default.map(this.props.items, (item, index) => this.renderItem(item, index))));
        }
    };
    MatrixAnswerComponent.initClass();
    return MatrixAnswerComponent;
})();
