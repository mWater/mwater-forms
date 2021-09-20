"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadingRefAnswerComponent = void 0;
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const bootstrap_1 = require("react-library/lib/bootstrap");
const formUtils_1 = require("../formUtils");
/** Cascading selection of a row from a table.
 * Special handling of null (arrives as undefined) values in table: they are converted to ""
 */
class CascadingRefAnswerComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        /** Handle change to a dropdown */
        this.handleChange = (index, value) => {
            const dropdowns = this.props.question.dropdowns;
            // If first one reset, then reset entire control
            if (index === 0 && !value) {
                this.handleReset();
                return;
            }
            const dropdownValues = this.state.dropdownValues.slice();
            dropdownValues[index] = value;
            // For each afterwards, set to null
            let pos = index + 1;
            for (; pos < dropdowns.length; pos++) {
                dropdownValues[pos] = null;
            }
            // For each afterwards, set if has single value, or otherwise set to null
            pos = index + 1;
            for (; pos < dropdowns.length; pos++) {
                const values = this.findValues(pos, dropdownValues);
                if (values.length == 1) {
                    dropdownValues[pos] = values[0];
                }
                else {
                    break;
                }
            }
            // Set rest to null
            for (; pos < this.props.question.dropdowns.length; pos++) {
                dropdownValues[pos] = null;
            }
            // If all set, change value
            if (dropdownValues[dropdowns.length - 1]) {
                // Find row
                for (const row of this.state.rows) {
                    let exclude = false;
                    for (let pos = 0; pos < dropdowns.length; pos++) {
                        if ((row[dropdowns[pos].columnId] || "") !== dropdownValues[pos]) {
                            exclude = true;
                        }
                    }
                    if (!exclude) {
                        // No longer editing
                        this.setState({ dropdownValues: dropdownValues, editing: false });
                        this.props.onValueChange(row._id);
                        return;
                    }
                }
            }
            this.setState({ dropdownValues: dropdownValues, editing: true });
        };
        /** Reset control */
        this.handleReset = () => {
            this.setState({ dropdownValues: this.props.question.dropdowns.map((c) => null), editing: false });
            this.props.onValueChange();
        };
        this.state = {
            editing: false
        };
    }
    componentDidMount() {
        // Load rows
        this.props
            .getCustomTableRows(this.props.question.tableId)
            .then((rows) => {
            // Load current value
            let row;
            if (this.props.value) {
                // Find row
                row = rows.find((row) => row._id == this.props.value);
            }
            // Get dropdown values
            const dropdownValues = this.props.question.dropdowns.map((sel) => (row ? (row[sel.columnId] || "") : null));
            this.setState({ dropdownValues, rows });
        })
            .catch((err) => {
            this.setState({ rows: [] });
            throw err;
        });
    }
    /** Validate the component */
    validate() {
        return this.state.editing ? this.props.T("Incomplete selection") : null;
    }
    /** Find values of a particular dropdown filtering by all previous selections */
    findValues(index, dropdownValues) {
        let values = [];
        for (const row of this.state.rows) {
            let exclude = false;
            for (let prev = 0; prev < index; prev++) {
                if ((row[this.props.question.dropdowns[prev].columnId] || "") !== dropdownValues[prev]) {
                    exclude = true;
                }
            }
            if (!exclude) {
                const columnId = this.props.question.dropdowns[index].columnId;
                values.push(row[columnId] || "");
            }
        }
        // Keep unique values
        values = lodash_1.default.uniq(values);
        return values;
    }
    renderDropdown(index) {
        const dropdown = this.props.question.dropdowns[index];
        // Determine available options
        const options = [];
        // Find all possible values, filtering by all previous selections
        const values = this.findValues(index, this.state.dropdownValues);
        const column = this.props.schema.getColumn(this.props.question.tableId, dropdown.columnId);
        if (!column) {
            // Not localized because should not happen
            return react_1.default.createElement("div", { className: "alert alert-danger" }, "Missing column");
        }
        // If enum
        if (column.type == "enum" && column.enumValues) {
            for (const enumValue of column.enumValues) {
                // Add if in values
                if (values.includes(enumValue.id)) {
                    options.push({ value: enumValue.id, label: formUtils_1.localizeString(enumValue.name, this.props.locale) });
                }
            }
        }
        else {
            // Text are added as is, converting null to ""
            for (const value of values) {
                options.push({ value: value, label: value });
            }
        }
        return (react_1.default.createElement("div", { style: { paddingBottom: 15 }, key: index },
            react_1.default.createElement("label", { className: "text-muted" }, formUtils_1.localizeString(dropdown.name, this.props.locale)),
            react_1.default.createElement(bootstrap_1.Select, { value: this.state.dropdownValues[index], options: options, nullLabel: this.props.T("Select..."), onChange: this.handleChange.bind(null, index) }),
            dropdown.hint ? react_1.default.createElement("div", { className: "text-muted" }, formUtils_1.localizeString(dropdown.hint, this.props.locale)) : null));
    }
    render() {
        if (!this.state.rows || !this.state.dropdownValues) {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("i", null, this.props.T("Loading question data. This may take several minutes..."))),
                react_1.default.createElement("div", { className: "progress" },
                    react_1.default.createElement("div", { className: "progress-bar progress-bar-striped active", style: { width: "100%" } }))));
        }
        const dropdowns = [];
        for (let i = 0; i < this.props.question.dropdowns.length; i++) {
            dropdowns.push(this.renderDropdown(i));
            // Skip rest if not selected
            if (!this.state.dropdownValues[i]) {
                break;
            }
        }
        // If can't access table, fatal error
        const table = this.props.schema.getTable(this.props.question.tableId);
        if (!table) {
            // Means that doesn't have access to table
            return (react_1.default.createElement("div", { className: "alert alert-danger" }, this.props.T("Cannot access data for this question. Please contact your administrator.")));
        }
        // If no data, probably internet issue or not set up
        if (this.state.rows.length == 0) {
            return (react_1.default.createElement("div", { className: "alert alert-warning" }, this.props.T("No data found for question. Please ensure that you are connected to internet for the first use of this form.")));
        }
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("button", { type: "button", className: "btn btn-link btn-xs", style: { float: "right" }, onClick: this.handleReset }, this.props.T("Reset")),
            dropdowns));
    }
}
exports.CascadingRefAnswerComponent = CascadingRefAnswerComponent;
