"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadingListDisplayComponent = void 0;
const react_1 = __importDefault(require("react"));
const formUtils_1 = require("../formUtils");
/** Displays a cascading list question answer */
const CascadingListDisplayComponent = (props) => {
    const parts = [];
    // Look up each column enum value
    for (let column of props.question.columns) {
        // Find enum value
        const enumValue = column.enumValues.find((ev) => ev.id == props.value[column.id]);
        parts.push(react_1.default.createElement("div", null,
            react_1.default.createElement("span", { className: "text-muted" },
                (0, formUtils_1.localizeString)(column.name, props.locale),
                ":\u00A0"),
            enumValue ? (0, formUtils_1.localizeString)(enumValue.name, props.locale) : "???"));
    }
    return react_1.default.createElement("div", null, parts);
};
exports.CascadingListDisplayComponent = CascadingListDisplayComponent;
