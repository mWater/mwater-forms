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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const formUtils_1 = require("../formUtils");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const lodash_1 = __importDefault(require("lodash"));
const reduceAnswer = (value) => {
    return value.reduce((v, c, i) => {
        v[c.id] = i + 1;
        return v;
    }, {});
};
const RankedQuestion = ({ choices, locale, answer, onValueChange }) => {
    const items = (0, react_1.useMemo)(() => {
        return lodash_1.default.sortBy(choices, (item) => { var _a; return !!answer ? ((_a = answer[item.id]) !== null && _a !== void 0 ? _a : 0) : 0; });
    }, [choices, answer]);
    const handleReorder = (0, react_1.useCallback)((result) => {
        if (!result.destination) {
            return;
        }
        const _items = reorder(items, result.source.index, result.destination.index);
        onValueChange(reduceAnswer(_items));
    }, [onValueChange, items]);
    const moveUp = (0, react_1.useCallback)((index) => {
        const newAnswer = [...items];
        [newAnswer[index], newAnswer[index - 1]] = [newAnswer[index - 1], newAnswer[index]];
        onValueChange(reduceAnswer(newAnswer));
    }, [items]);
    const moveDown = (0, react_1.useCallback)((index) => {
        const newAnswer = [...items];
        [newAnswer[index], newAnswer[index + 1]] = [newAnswer[index + 1], newAnswer[index]];
        onValueChange(reduceAnswer(newAnswer));
    }, [items]);
    return (react_1.default.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleReorder },
        react_1.default.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "ranked__droppable" }, (provided, snapshot) => (react_1.default.createElement("div", Object.assign({}, provided.droppableProps, { ref: provided.innerRef }),
            items.map((item, index) => (react_1.default.createElement(react_beautiful_dnd_1.Draggable, { key: item.id, draggableId: item.id, index: index }, (provided, snapshot) => (react_1.default.createElement("div", Object.assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { style: getItemStyle(snapshot.isDragging, provided.draggableProps.style) }),
                react_1.default.createElement("div", { className: "__ranked_option" },
                    react_1.default.createElement("div", { className: "label" },
                        react_1.default.createElement("span", { className: "fas fa-arrows-alt" }),
                        `${index + 1}. `,
                        react_1.default.createElement("span", null, (0, formUtils_1.localizeString)(item.label, locale))),
                    react_1.default.createElement("div", { className: "controls" },
                        react_1.default.createElement("button", { className: "btn", disabled: index == 0, onClick: () => moveUp(index) },
                            react_1.default.createElement("span", { className: "fas fa-arrow-up" })),
                        react_1.default.createElement("button", { className: "btn", disabled: index + 1 === items.length, onClick: () => moveDown(index) },
                            react_1.default.createElement("span", { className: "fas fa-arrow-down" }))))))))),
            provided.placeholder)))));
};
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => (Object.assign({ 
    // some basic styles to make the items look a bit nicer
    userSelect: "none", margin: `0 0 ${grid}px 0`, 
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey", borderRadius: 4 }, draggableStyle));
const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
});
exports.default = RankedQuestion;
