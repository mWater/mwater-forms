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
const react_1 = __importStar(require("react"));
const ReorderableListComponent_1 = __importDefault(require("react-library/lib/reorderable/ReorderableListComponent"));
const formUtils_1 = require("../formUtils");
const lodash_1 = __importDefault(require("lodash"));
const reduceAnswer = (value) => {
    return value.reduce((v, c, i) => {
        v[c.id] = i + 1;
        return v;
    }, {});
};
const RankedQuestion = ({ choices, locale, answer, onValueChange }) => {
    const handleReorder = react_1.useCallback((value) => {
        onValueChange(reduceAnswer(value));
    }, [onValueChange]);
    const items = react_1.useMemo(() => {
        return lodash_1.default.sortBy(choices, (item) => { var _a; return !!answer ? ((_a = answer[item.id]) !== null && _a !== void 0 ? _a : 0) : 0; });
    }, [choices, answer]);
    const moveUp = react_1.useCallback((index) => {
        const newAnswer = [...items];
        [newAnswer[index], newAnswer[index - 1]] = [newAnswer[index - 1], newAnswer[index]];
        onValueChange(reduceAnswer(newAnswer));
    }, [items]);
    const moveDown = react_1.useCallback((index) => {
        const newAnswer = [...items];
        [newAnswer[index], newAnswer[index + 1]] = [newAnswer[index + 1], newAnswer[index]];
        onValueChange(reduceAnswer(newAnswer));
    }, [items]);
    const renderItem = (entry, index, connectDragSource, connectDragPreview, connectDropTarget) => {
        return connectDropTarget(connectDragPreview(react_1.default.createElement("div", { className: "__ranked_option" },
            react_1.default.createElement("div", { className: "label" },
                connectDragSource(react_1.default.createElement("span", { className: "fas fa-grip-vertical" })),
                `${index + 1}. `,
                react_1.default.createElement("span", null, formUtils_1.localizeString(entry.label, locale))),
            react_1.default.createElement("div", { className: "controls" },
                react_1.default.createElement("button", { className: "btn", disabled: index == 0, onClick: () => moveUp(index) },
                    react_1.default.createElement("span", { className: "fas fa-arrow-up" })),
                react_1.default.createElement("button", { className: "btn", disabled: index + 1 === items.length, onClick: () => moveDown(index) },
                    react_1.default.createElement("span", { className: "fas fa-arrow-down" }))))));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ReorderableListComponent_1.default, { items: items, onReorder: handleReorder, renderItem: renderItem, getItemId: (entry) => entry.id })));
};
exports.default = RankedQuestion;
