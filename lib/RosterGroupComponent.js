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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const TextExprsComponent_1 = __importDefault(require("./TextExprsComponent"));
const ItemListComponent_1 = __importDefault(require("./ItemListComponent"));
const classnames_1 = __importDefault(require("classnames"));
// TODO Add focus()
// Rosters are repeated information, such as asking questions about household members N times.
// A roster group is a group of questions that is asked once for each roster entry
class RosterGroupComponent extends react_1.default.Component {
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
        this.isChildVisible = (index, id) => {
            return this.props.isVisible(`${this.getAnswerId()}.${index}.${id}`);
        };
        this.handleToggle = (index) => {
            this.setState({ collapsedEntries: lodash_1.default.xor(this.state.collapsedEntries, [index]) });
        };
        this.state = {
            collapsedEntries: []
        };
    }
    // Gets the id that the answer is stored under
    getAnswerId() {
        // Prefer rosterId if specified, otherwise use id.
        return this.props.rosterGroup.rosterId || this.props.rosterGroup._id;
    }
    // Get the current answer value
    getAnswer() {
        return (this.props.data[this.getAnswerId()] || []);
    }
    validate(scrollToFirstInvalid) {
        return __awaiter(this, void 0, void 0, function* () {
            // For each entry
            let foundInvalid = false;
            const iterable = this.getAnswer();
            for (let index = 0; index < iterable.length; index++) {
                const entry = iterable[index];
                const result = yield this[`itemlist_${index}`].validate(scrollToFirstInvalid && !foundInvalid);
                if (result) {
                    foundInvalid = true;
                }
            }
            return foundInvalid;
        });
    }
    renderName() {
        return R("h4", { key: "prompt" }, formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
    }
    renderEntryTitle(entry, index) {
        return R(TextExprsComponent_1.default, {
            localizedStr: this.props.rosterGroup.entryTitle,
            exprs: this.props.rosterGroup.entryTitleExprs,
            schema: this.props.schema,
            responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
            locale: this.context.locale
        });
    }
    renderEntry(entry, index) {
        const isCollapsed = this.state.collapsedEntries.includes(index);
        const bodyStyle = {
            height: isCollapsed ? 0 : "auto",
            transition: "height 0.25s ease-in",
            padding: isCollapsed ? 0 : 15,
            overflow: "hidden"
        };
        return R("div", { key: index, className: "card mb-3" }, R("div", { key: "header", className: "card-header", style: { fontWeight: "bold", position: "relative" } }, `${index + 1}. `, this.renderEntryTitle(entry, index), R("button", {
            className: "btn btn-link",
            style: { position: "absolute", right: 0, top: 5 },
            onClick: this.handleToggle.bind(null, index)
        }, R("span", {
            className: (0, classnames_1.default)("fas", { "fa-chevron-up": !isCollapsed, "fa-chevron-down": isCollapsed })
        }))), R("div", { key: "body", className: "card-body", style: bodyStyle }, this.props.rosterGroup.allowRemove
            ? R("button", {
                type: "button",
                style: { float: "right" },
                className: "btn btn-sm btn-link",
                onClick: this.handleRemove.bind(null, index)
            }, R("span", { className: "fas fa-times" }))
            : undefined, R(ItemListComponent_1.default, {
            ref: (c) => {
                return (this[`itemlist_${index}`] = c);
            },
            contents: this.props.rosterGroup.contents,
            data: this.getAnswer()[index].data,
            responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
            onDataChange: this.handleEntryDataChange.bind(null, index),
            isVisible: this.isChildVisible.bind(null, index),
            schema: this.props.schema
        })));
    }
    renderAdd() {
        if (this.props.rosterGroup.allowAdd) {
            return R("div", { key: "add" }, R("button", { type: "button", className: "btn btn-secondary btn-sm", onClick: this.handleAdd }, R("span", { className: "fas fa-plus" }), " " + this.context.T("Add")));
        }
        return null;
    }
    renderEmptyPrompt() {
        return R("div", { style: { fontStyle: "italic" } }, formUtils.localizeString(this.props.rosterGroup.emptyPrompt, this.context.locale) ||
            this.context.T("Click +Add to add an item"));
    }
    render() {
        return R("div", { style: { padding: 5, marginBottom: 20 } }, this.renderName(), lodash_1.default.map(this.getAnswer(), (entry, index) => this.renderEntry(entry, index)), 
        // Display message if none and can add
        this.getAnswer().length === 0 && this.props.rosterGroup.allowAdd ? this.renderEmptyPrompt() : undefined, this.renderAdd());
    }
}
exports.default = RosterGroupComponent;
RosterGroupComponent.contextTypes = {
    locale: prop_types_1.default.string,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
