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
var CascadingListAnswerComponent = /** @class */ (function (_super) {
    __extends(CascadingListAnswerComponent, _super);
    function CascadingListAnswerComponent(props) {
        var _this = _super.call(this, props) || this;
        /** Handle change to a dropdown */
        _this.handleChange = function (index, value) {
            // If first one reset, then reset entire control
            if (index === 0 && !value) {
                _this.handleReset();
                return;
            }
            var columnValues = _this.state.columnValues.slice();
            columnValues[index] = value;
            // For each afterwards, set to null
            var pos = index + 1;
            for (; pos < _this.props.columns.length; pos++) {
                columnValues[pos] = null;
            }
            // For each afterwards, set if has single value, or otherwise set to null
            pos = index + 1;
            for (; pos < _this.props.columns.length; pos++) {
                var values = _this.findValues(pos, columnValues);
                if (values.length == 1) {
                    columnValues[pos] = values[0];
                }
                else {
                    break;
                }
            }
            // Set rest to null
            for (; pos < _this.props.columns.length; pos++) {
                columnValues[pos] = null;
            }
            // If all set, change value
            if (columnValues[_this.props.columns.length - 1]) {
                // Find row
                for (var _i = 0, _a = _this.props.rows; _i < _a.length; _i++) {
                    var row = _a[_i];
                    var exclude = false;
                    for (var colIndex = 0; colIndex < _this.props.columns.length; colIndex++) {
                        if (row[_this.props.columns[colIndex].id] !== columnValues[colIndex]) {
                            exclude = true;
                        }
                    }
                    if (!exclude) {
                        // No longer editing
                        _this.setState({ columnValues: columnValues, editing: false });
                        _this.props.onValueChange(row);
                        return;
                    }
                }
            }
            _this.setState({ columnValues: columnValues, editing: true });
        };
        /** Reset control */
        _this.handleReset = function () {
            _this.setState({ columnValues: _this.props.columns.map(function (c) { return null; }), editing: false });
            _this.props.onValueChange();
        };
        _this.state = {
            columnValues: props.columns.map(function (c) { return props.value ? props.value[c.id] : null; }),
            editing: false
        };
        return _this;
    }
    /** Validate the component */
    CascadingListAnswerComponent.prototype.validate = function () {
        return this.state.editing ? this.props.T("Incomplete selection") : null;
    };
    /** Find values of a particular dropdown filtering by all previous selections */
    CascadingListAnswerComponent.prototype.findValues = function (index, columnValues) {
        var values = [];
        for (var _i = 0, _a = this.props.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            var exclude = false;
            for (var prev = 0; prev < index; prev++) {
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
    };
    CascadingListAnswerComponent.prototype.renderDropdown = function (index) {
        // Determine available options
        var options = [];
        // Find all possible values, filtering by all previous selections
        var values = this.findValues(index, this.state.columnValues);
        for (var _i = 0, _a = this.props.columns[index].enumValues; _i < _a.length; _i++) {
            var enumValue = _a[_i];
            // Add if in values
            if (values.includes(enumValue.id)) {
                options.push({ value: enumValue.id, label: formUtils_1.localizeString(enumValue.name, this.props.locale) });
            }
        }
        // Sort options if set
        if (this.props.sortOptions) {
            options = lodash_1.default.sortBy(options, function (opt) { return opt.label; });
        }
        return react_1.default.createElement("div", { style: { paddingBottom: 15 }, key: index },
            react_1.default.createElement("label", { className: "text-muted" }, formUtils_1.localizeString(this.props.columns[index].name, this.props.locale)),
            react_1.default.createElement(bootstrap_1.Select, { value: this.state.columnValues[index], options: options, nullLabel: this.props.T("Select..."), onChange: this.handleChange.bind(null, index) }));
    };
    CascadingListAnswerComponent.prototype.render = function () {
        var dropdowns = [];
        for (var i = 0; i < this.props.columns.length; i++) {
            dropdowns.push(this.renderDropdown(i));
            // Skip rest if not selected
            if (!this.state.columnValues[i]) {
                break;
            }
        }
        return react_1.default.createElement("div", null,
            react_1.default.createElement("button", { type: "button", className: "btn btn-link btn-xs", style: { float: "right" }, onClick: this.handleReset }, this.props.T("Reset")),
            dropdowns);
    };
    return CascadingListAnswerComponent;
}(react_1.default.Component));
exports.CascadingListAnswerComponent = CascadingListAnswerComponent;
