"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var react_1 = __importDefault(require("react"));
var bootstrap_1 = require("react-library/lib/bootstrap");
var formUtils_1 = require("../formUtils");
var CascadingRefAnswerComponent = /** @class */ (function (_super) {
    __extends(CascadingRefAnswerComponent, _super);
    function CascadingRefAnswerComponent(props) {
        var _this = _super.call(this, props) || this;
        /** Handle change to a dropdown */
        _this.handleChange = function (index, value) {
            var selectors = _this.props.question.selectors;
            // If first one reset, then reset entire control
            if (index === 0 && !value) {
                _this.handleReset();
                return;
            }
            var selectorValues = _this.state.selectorValues.slice();
            selectorValues[index] = value;
            // For each afterwards, set to null
            var pos = index + 1;
            for (; pos < selectors.length; pos++) {
                selectorValues[pos] = null;
            }
            // For each afterwards, set if has single value, or otherwise set to null
            pos = index + 1;
            for (; pos < selectors.length; pos++) {
                var values = _this.findValues(pos, selectorValues);
                if (values.length == 1) {
                    selectorValues[pos] = values[0];
                }
                else {
                    break;
                }
            }
            // Set rest to null
            for (; pos < _this.props.question.selectors.length; pos++) {
                selectorValues[pos] = null;
            }
            // If all set, change value
            if (selectorValues[selectors.length - 1]) {
                // Find row
                for (var _i = 0, _a = _this.state.rows; _i < _a.length; _i++) {
                    var row = _a[_i];
                    var exclude = false;
                    for (var pos_1 = 0; pos_1 < selectors.length; pos_1++) {
                        if (row[selectors[pos_1].columnId] !== selectorValues[pos_1]) {
                            exclude = true;
                        }
                    }
                    if (!exclude) {
                        // No longer editing
                        _this.setState({ selectorValues: selectorValues, editing: false });
                        _this.props.onValueChange(row._id);
                        return;
                    }
                }
            }
            _this.setState({ selectorValues: selectorValues, editing: true });
        };
        /** Reset control */
        _this.handleReset = function () {
            _this.setState({ selectorValues: _this.props.question.selectors.map(function (c) { return null; }), editing: false });
            _this.props.onValueChange();
        };
        _this.state = {
            editing: false
        };
        return _this;
    }
    CascadingRefAnswerComponent.prototype.componentDidMount = function () {
        var _this = this;
        // Load rows
        this.props.getCustomTableRows(this.props.question.tableId).then(function (rows) {
            // Load current value
            var row;
            if (_this.props.value) {
                // Find row
                row = rows.find(function (row) { return row._id == _this.props.value; });
            }
            // Get selector values
            var selectorValues = _this.props.question.selectors.map(function (sel) { return row ? row[sel.columnId] : null; });
            _this.setState({ selectorValues: selectorValues, rows: rows });
        }).catch(function (err) { throw err; });
    };
    /** Validate the component */
    CascadingRefAnswerComponent.prototype.validate = function () {
        return this.state.editing ? this.props.T("Incomplete selection") : null;
    };
    /** Find values of a particular dropdown filtering by all previous selections */
    CascadingRefAnswerComponent.prototype.findValues = function (index, selectorValues) {
        var values = [];
        for (var _i = 0, _a = this.state.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            var exclude = false;
            for (var prev = 0; prev < index; prev++) {
                if (row[this.props.question.selectors[prev].columnId] !== selectorValues[prev]) {
                    exclude = true;
                }
            }
            if (!exclude) {
                values.push(row[this.props.question.selectors[index].columnId]);
            }
        }
        // Keep unique values
        values = lodash_1.default.uniq(values);
        return values;
    };
    CascadingRefAnswerComponent.prototype.renderDropdown = function (index) {
        var selector = this.props.question.selectors[index];
        // Determine available options
        var options = [];
        // Find all possible values, filtering by all previous selections
        var values = this.findValues(index, this.state.selectorValues);
        var column = this.props.schema.getColumn(this.props.question.tableId, selector.columnId);
        if (!column) {
            // Not localized because should not happen
            return react_1.default.createElement("div", { className: "alert alert-danger" }, "Missing column");
        }
        // If enum
        if (column.type == "enum" && column.enumValues) {
            for (var _i = 0, _a = column.enumValues; _i < _a.length; _i++) {
                var enumValue = _a[_i];
                // Add if in values
                if (values.includes(enumValue.id)) {
                    options.push({ value: enumValue.id, label: formUtils_1.localizeString(enumValue.name, this.props.locale) });
                }
            }
        }
        else {
            // Text are added as is
            for (var _b = 0, values_1 = values; _b < values_1.length; _b++) {
                var value = values_1[_b];
                options.push({ value: value, label: value });
            }
        }
        return react_1.default.createElement("div", { style: { paddingBottom: 15 }, key: index },
            react_1.default.createElement("label", { className: "text-muted" }, formUtils_1.localizeString(selector.name, this.props.locale)),
            react_1.default.createElement(bootstrap_1.Select, { value: this.state.selectorValues[index], options: options, nullLabel: this.props.T("Select..."), onChange: this.handleChange.bind(null, index) }),
            selector.hint ?
                react_1.default.createElement("div", { className: "text-muted" }, formUtils_1.localizeString(selector.hint, this.props.locale))
                : null);
    };
    CascadingRefAnswerComponent.prototype.render = function () {
        if (!this.state.rows || !this.state.selectorValues) {
            return react_1.default.createElement("div", null,
                react_1.default.createElement("i", { className: "fa fa-spinner fa-spin" }));
        }
        var dropdowns = [];
        for (var i = 0; i < this.props.question.selectors.length; i++) {
            dropdowns.push(this.renderDropdown(i));
            // Skip rest if not selected
            if (!this.state.selectorValues[i]) {
                break;
            }
        }
        return react_1.default.createElement("div", null,
            react_1.default.createElement("button", { type: "button", className: "btn btn-link btn-xs", style: { float: "right" }, onClick: this.handleReset }, this.props.T("Reset")),
            dropdowns);
    };
    return CascadingRefAnswerComponent;
}(react_1.default.Component));
exports.CascadingRefAnswerComponent = CascadingRefAnswerComponent;
