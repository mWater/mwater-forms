"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var formUtils_1 = require("../formUtils");
/** Displays a cascading list question answer */
exports.CascadingRefDisplayComponent = function (props) {
    var _a = react_1.useState(), row = _a[0], setRow = _a[1];
    var _b = react_1.useState(false), notFound = _b[0], setNotFound = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    react_1.useEffect(function () {
        // Load row
        if (props.value) {
            setLoading(true);
            props.getCustomTableRow(props.question.tableId, props.value).then(function (r) {
                if (r) {
                    setRow(r);
                    setNotFound(false);
                    setLoading(false);
                }
                else {
                    setNotFound(true);
                    setLoading(false);
                }
            }).catch(function (err) { throw err; });
        }
        else {
            setRow(null);
            setNotFound(false);
        }
    }, [props.value]);
    if (loading) {
        return react_1.default.createElement("div", null,
            react_1.default.createElement("i", { className: "fa fa-spinner fa-spin" }));
    }
    if (notFound) {
        return react_1.default.createElement("div", { className: "text-danger" }, "???");
    }
    if (!row) {
        return null;
    }
    var parts = [];
    var _loop_1 = function (dropdown) {
        var column = props.schema.getColumn(props.question.tableId, dropdown.columnId);
        if (!column) {
            // Not localized because should not happen      
            parts.push(react_1.default.createElement("div", { className: "alert alert-danger" }, "Missing column"));
            return "continue";
        }
        // Find enum value
        if (column.type == "enum" && column.enumValues) {
            var enumValue = column.enumValues.find(function (ev) { return ev.id == row[column.id]; });
            parts.push(react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    formUtils_1.localizeString(dropdown.name, props.locale),
                    ":\u00A0"),
                enumValue ? formUtils_1.localizeString(enumValue.name, props.locale) : "???"));
        }
        else {
            parts.push(react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    formUtils_1.localizeString(dropdown.name, props.locale),
                    ":\u00A0"),
                row[column.id]));
        }
    };
    // Look up each column enum value or text
    for (var _i = 0, _d = props.question.dropdowns; _i < _d.length; _i++) {
        var dropdown = _d[_i];
        _loop_1(dropdown);
    }
    return react_1.default.createElement("div", null, parts);
};
