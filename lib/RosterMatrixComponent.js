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
// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const ValidationCompiler_1 = __importDefault(require("./answers/ValidationCompiler"));
const ReorderableListComponent_1 = __importDefault(require("react-library/lib/reorderable/ReorderableListComponent"));
const MatrixColumnCellComponent_1 = __importDefault(require("./MatrixColumnCellComponent"));
// Rosters are repeated information, such as asking questions about household members N times.
// A roster matrix is a list of column-type questions with one row for each entry in the roster
class RosterMatrixComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        // Propagate an answer change to the onDataChange
        this.handleAnswerChange = (answer) => {
            const change = {};
            change[this.getAnswerId()] = answer;
            return this.props.onDataChange(lodash_1.default.extend({}, this.props.data, change));
        };
        // Handles a change in data of a specific entry of the roster
        this.handleEntryDataChange = (index, data) => {
            const answer = this.getAnswer().slice();
            answer[index] = lodash_1.default.extend({}, answer[index], { data });
            return this.handleAnswerChange(answer);
        };
        this.handleAdd = () => {
            const answer = this.getAnswer().slice();
            answer.push({ _id: formUtils.createUid(), data: {} });
            return this.handleAnswerChange(answer);
        };
        this.handleRemove = (index) => {
            const answer = this.getAnswer().slice();
            answer.splice(index, 1);
            return this.handleAnswerChange(answer);
        };
        this.handleCellChange = (entryIndex, columnId, answer) => {
            let { data } = this.getAnswer()[entryIndex];
            const change = {};
            change[columnId] = answer;
            data = lodash_1.default.extend({}, data, change);
            return this.handleEntryDataChange(entryIndex, data);
        };
        this.handleSort = (column, order) => {
            let answer = this.getAnswer();
            answer = lodash_1.default.sortByOrder(answer, [(item) => { var _a; return (_a = item.data[column._id]) === null || _a === void 0 ? void 0 : _a.value; }], [order]);
            return this.handleAnswerChange(answer);
        };
        this.renderEntry = (entry, index, connectDragSource, connectDragPreview, connectDropTarget) => {
            const elem = R("tr", { key: index }, lodash_1.default.map(this.props.rosterMatrix.contents, (column, columnIndex) => this.renderCell(entry, index, column, columnIndex)), this.props.rosterMatrix.allowRemove
                ? R("td", { key: "_remove" }, R("button", { type: "button", className: "btn btn-sm btn-link", onClick: this.handleRemove.bind(null, index) }, R("span", { className: "fas fa-times" })))
                : undefined);
            return connectDropTarget(connectDragPreview(connectDragSource(elem)));
        };
        this.state = {
            validationErrors: {}
        };
    }
    // Gets the id that the answer is stored under
    getAnswerId() {
        // Prefer rosterId if specified, otherwise use id.
        return this.props.rosterMatrix.rosterId || this.props.rosterMatrix._id;
    }
    // Get the current answer value
    getAnswer() {
        return (this.props.data[this.getAnswerId()] || []);
    }
    validate(scrollToFirstInvalid) {
        var _a, _b;
        const validationErrors = {};
        // For each entry
        let foundInvalid = false;
        const iterable = this.getAnswer();
        for (let rowIndex = 0; rowIndex < iterable.length; rowIndex++) {
            // For each column
            const entry = iterable[rowIndex];
            for (let columnIndex = 0; columnIndex < this.props.rosterMatrix.contents.length; columnIndex++) {
                const column = this.props.rosterMatrix.contents[columnIndex];
                const key = `${rowIndex}_${column._id}`;
                if (column.required && (((_a = entry.data[column._id]) === null || _a === void 0 ? void 0 : _a.value) == null || ((_b = entry.data[column._id]) === null || _b === void 0 ? void 0 : _b.value) === "")) {
                    foundInvalid = true;
                    validationErrors[key] = true;
                }
                if (column.validations && column.validations.length > 0) {
                    const validationError = new ValidationCompiler_1.default(this.context.locale).compileValidations(column.validations)(entry.data[column._id]);
                    if (validationError) {
                        foundInvalid = true;
                        validationErrors[key] = validationError;
                    }
                }
            }
        }
        // Save state
        this.setState({ validationErrors });
        // Scroll into view
        if (foundInvalid && scrollToFirstInvalid) {
            this.prompt.scrollIntoView();
        }
        return foundInvalid;
    }
    renderName() {
        return R("h4", {
            key: "prompt",
            ref: (c) => {
                this.prompt = c;
            }
        }, formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale));
    }
    renderColumnHeader(column, index) {
        return R("th", { key: column._id }, formUtils.localizeString(column.text, this.context.locale), 
        // Required star
        column.required ? R("span", { className: "required" }, "*") : undefined, 
        // Allow sorting
        ["TextColumnQuestion", "NumberColumnQuestion", "DateColumnQuestion"].includes(column._type)
            ? R("div", { style: { float: "right" } }, R("span", {
                className: "table-sort-controls fas fa-caret-up",
                style: { cursor: "pointer" },
                onClick: this.handleSort.bind(null, column, "asc")
            }), R("span", {
                className: "table-sort-controls fas fa-caret-down",
                style: { cursor: "pointer" },
                onClick: this.handleSort.bind(null, column, "desc")
            }))
            : undefined);
    }
    renderHeader() {
        return R("thead", null, R("tr", null, lodash_1.default.map(this.props.rosterMatrix.contents, (column, index) => this.renderColumnHeader(column, index)), 
        // Extra for remove button
        this.props.rosterMatrix.allowRemove ? R("th", null) : undefined));
    }
    renderCell(entry, entryIndex, column, columnIndex) {
        // Get data of the entry
        const entryData = this.getAnswer()[entryIndex].data;
        // Determine if invalid
        const key = `${entryIndex}_${column._id}`;
        const invalid = this.state.validationErrors[key];
        // Render cell
        return R(MatrixColumnCellComponent_1.default, {
            key: column._id,
            column,
            data: entryData,
            responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), entryIndex),
            answer: (entryData === null || entryData === void 0 ? void 0 : entryData[column._id]) || {},
            onAnswerChange: this.handleCellChange.bind(null, entryIndex, column._id),
            invalid: !!invalid,
            invalidMessage: typeof invalid == "string" ? invalid : undefined,
            schema: this.props.schema
        });
    }
    renderAdd() {
        if (this.props.rosterMatrix.allowAdd) {
            return R("div", { key: "add", style: { marginTop: 10 } }, R("button", { type: "button", className: "btn btn-primary", onClick: this.handleAdd }, R("span", { className: "fas fa-plus" }), " " + this.context.T("Add")));
        }
        return null;
    }
    renderBody() {
        return R(ReorderableListComponent_1.default, {
            items: this.getAnswer(),
            onReorder: this.handleAnswerChange,
            renderItem: this.renderEntry,
            getItemId: (entry) => entry._id,
            element: R("tbody", null)
        });
    }
    renderEmptyPrompt() {
        return R("div", { style: { fontStyle: "italic" } }, formUtils.localizeString(this.props.rosterMatrix.emptyPrompt, this.context.locale) ||
            this.context.T("Click +Add to add an item"));
    }
    render() {
        return R("div", { style: { padding: 5, marginBottom: 20 } }, this.renderName(), R("table", { className: "table" }, this.renderHeader(), this.renderBody()), 
        // Display message if none and can add
        this.getAnswer().length === 0 && this.props.rosterMatrix.allowAdd ? this.renderEmptyPrompt() : undefined, this.renderAdd());
    }
}
exports.default = RosterMatrixComponent;
RosterMatrixComponent.contextTypes = {
    locale: prop_types_1.default.string,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
