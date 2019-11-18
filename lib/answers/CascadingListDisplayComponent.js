"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var formUtils_1 = require("../formUtils");
exports.CascadingListDisplayComponent = function (props) {
    var parts = [];
    var _loop_1 = function (column) {
        // Find enum value
        var enumValue = column.enumValues.find(function (ev) { return ev.id == props.value[column.id]; });
        parts.push(react_1.default.createElement("div", null,
            react_1.default.createElement("span", { className: "text-muted" },
                formUtils_1.localizeString(column.name, props.locale),
                ":\u00A0"),
            enumValue ? formUtils_1.localizeString(enumValue.name, props.locale) : "???"));
    };
    // Look up each column enum value
    for (var _i = 0, _a = props.question.columns; _i < _a.length; _i++) {
        var column = _a[_i];
        _loop_1(column);
    }
    return react_1.default.createElement("div", null, parts);
};
