"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadingListAnswerComponent = void 0;
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const bootstrap_1 = require("react-library/lib/bootstrap");
const formUtils_1 = require("../formUtils");
class CascadingListAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        /** Handle change to a dropdown */
        this.handleChange = (index, value) => {
            // If first one reset, then reset entire control
            if (index === 0 && !value) {
                this.handleReset();
                return;
            }
            const columnValues = this.state.columnValues.slice();
            columnValues[index] = value;
            // For each afterwards, set to null
            let pos = index + 1;
            for (; pos < this.props.columns.length; pos++) {
                columnValues[pos] = null;
            }
            // For each afterwards, set if has single value, or otherwise set to null
            pos = index + 1;
            for (; pos < this.props.columns.length; pos++) {
                const values = this.findValues(pos, columnValues);
                if (values.length == 1) {
                    columnValues[pos] = values[0];
                }
                else {
                    break;
                }
            }
            // Set rest to null
            for (; pos < this.props.columns.length; pos++) {
                columnValues[pos] = null;
            }
            // If all set, change value
            if (columnValues[this.props.columns.length - 1]) {
                // Find row
                for (const row of this.props.rows) {
                    let exclude = false;
                    for (let colIndex = 0; colIndex < this.props.columns.length; colIndex++) {
                        if (row[this.props.columns[colIndex].id] !== columnValues[colIndex]) {
                            exclude = true;
                        }
                    }
                    if (!exclude) {
                        // No longer editing
                        this.setState({ columnValues: columnValues, editing: false });
                        this.props.onValueChange(row);
                        return;
                    }
                }
            }
            this.setState({ columnValues: columnValues, editing: true });
        };
        /** Reset control */
        this.handleReset = () => {
            this.setState({ columnValues: this.props.columns.map((c) => null), editing: false });
            this.props.onValueChange();
        };
        this.state = {
            columnValues: props.columns.map((c) => (props.value ? props.value[c.id] || null : null)),
            editing: false
        };
    }
    /** Validate the component */
    validate() {
        return this.state.editing ? this.props.T("Incomplete selection") : null;
    }
    componentDidUpdate() {
        // Reset if alternate selected
        if (this.props.alternateSelected && (this.state.editing || this.state.columnValues.some(c => c != null))) {
            this.setState({ columnValues: this.props.columns.map((c) => null), editing: false });
        }
    }
    /** Find values of a particular dropdown filtering by all previous selections */
    findValues(index, columnValues) {
        let values = [];
        for (const row of this.props.rows) {
            let exclude = false;
            for (let prev = 0; prev < index; prev++) {
                if (row[this.props.columns[prev].id] !== columnValues[prev]) {
                    exclude = true;
                }
            }
            if (!exclude) {
                values.push(row[this.props.columns[index].id]);
            }
        }
        // Keep unique values
        values = lodash_1.default.uniq(values);
        return values;
    }
    renderDropdown(index) {
        // Determine available options
        let options = [];
        // Find all possible values, filtering by all previous selections
        const values = this.findValues(index, this.state.columnValues);
        for (const enumValue of this.props.columns[index].enumValues) {
            // Add if in values
            if (values.includes(enumValue.id)) {
                options.push({ value: enumValue.id, label: formUtils_1.localizeString(enumValue.name, this.props.locale) });
            }
        }
        // Sort options if set
        if (this.props.sortOptions) {
            options = lodash_1.default.sortBy(options, (opt) => opt.label);
        }
        return (react_1.default.createElement("div", { style: { paddingBottom: 15 }, key: index },
            react_1.default.createElement("label", { className: "text-muted" }, formUtils_1.localizeString(this.props.columns[index].name, this.props.locale)),
            react_1.default.createElement(bootstrap_1.Select, { value: this.state.columnValues[index], options: options, nullLabel: this.props.T("Select..."), onChange: this.handleChange.bind(null, index) })));
    }
    render() {
        const dropdowns = [];
        for (let i = 0; i < this.props.columns.length; i++) {
            dropdowns.push(this.renderDropdown(i));
            // Skip rest if not selected
            if (!this.state.columnValues[i]) {
                break;
            }
        }
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("button", { type: "button", className: "btn btn-link btn-sm", style: { float: "right" }, onClick: this.handleReset }, this.props.T("Reset")),
            dropdowns));
    }
}
exports.CascadingListAnswerComponent = CascadingListAnswerComponent;
