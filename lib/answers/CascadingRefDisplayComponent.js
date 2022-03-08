"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadingRefDisplayComponent = void 0;
const react_1 = __importStar(require("react"));
const formUtils_1 = require("../formUtils");
/** Displays a cascading list question answer */
const CascadingRefDisplayComponent = (props) => {
    const [row, setRow] = (0, react_1.useState)();
    const [notFound, setNotFound] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Load row
        if (props.value) {
            setLoading(true);
            props
                .getCustomTableRow(props.question.tableId, props.value)
                .then((r) => {
                if (r) {
                    setRow(r);
                    setNotFound(false);
                    setLoading(false);
                }
                else {
                    setNotFound(true);
                    setLoading(false);
                }
            })
                .catch((err) => {
                throw err;
            });
        }
        else {
            setRow(null);
            setNotFound(false);
        }
    }, [props.value]);
    if (loading) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("i", { className: "fa fa-spinner fa-spin" })));
    }
    if (notFound) {
        return react_1.default.createElement("div", { className: "text-danger" }, "???");
    }
    if (!row) {
        return null;
    }
    const parts = [];
    // Look up each column enum value or text
    for (const dropdown of props.question.dropdowns) {
        const column = props.schema.getColumn(props.question.tableId, dropdown.columnId);
        if (!column) {
            // Not localized because should not happen
            parts.push(react_1.default.createElement("div", { className: "alert alert-danger" }, "Missing column"));
            continue;
        }
        // Find enum value
        if (column.type == "enum" && column.enumValues) {
            const enumValue = column.enumValues.find((ev) => ev.id == row[column.id]);
            parts.push(react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    (0, formUtils_1.localizeString)(dropdown.name, props.locale),
                    ":\u00A0"),
                enumValue ? (0, formUtils_1.localizeString)(enumValue.name, props.locale) : "???"));
        }
        else {
            parts.push(react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "text-muted" },
                    (0, formUtils_1.localizeString)(dropdown.name, props.locale),
                    ":\u00A0"),
                row[column.id]));
        }
    }
    return react_1.default.createElement("div", null, parts);
};
exports.CascadingRefDisplayComponent = CascadingRefDisplayComponent;
