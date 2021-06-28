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
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ItemListComponent_1 = __importDefault(require("./ItemListComponent"));
const formUtils = __importStar(require("./formUtils"));
class SectionsComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.itemListComponent.validate(true);
            if (!result) {
                return this.props.onSubmit();
            }
        });
        this.handleBackSection = () => {
            // Move to previous that is visible
            const previousVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1);
            if (previousVisibleIndex !== -1) {
                this.setState({ sectionNum: previousVisibleIndex });
                // Scroll to top of section
                return this.sections.scrollIntoView();
            }
        };
        // This should never happen... simply ignore
        this.handleNextSection = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.itemListComponent.validate(true);
            if (result) {
                return;
            }
            // Move to next that is visible
            const nextVisibleIndex = this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1);
            if (nextVisibleIndex !== -1) {
                this.setState({ sectionNum: nextVisibleIndex });
                // Scroll to top of section
                return this.sections.scrollIntoView();
            }
        });
        // This should never happen... simply ignore
        this.handleBreadcrumbClick = (index) => {
            return this.setState({ sectionNum: index });
        };
        this.handleItemListNext = () => {
            return this.nextOrSubmit.focus();
        };
        this.state = {
            sectionNum: 0
        };
    }
    static initClass() {
        this.contextTypes = {
            locale: prop_types_1.default.string,
            T: prop_types_1.default.func.isRequired // Localizer to use
        };
    }
    hasPreviousSection() {
        // Returns true if a visible index exist with a higher value
        return this.nextVisibleSectionIndex(this.state.sectionNum - 1, -1) !== -1;
    }
    hasNextSection() {
        // Returns true if a visible index exist with a higher value
        return this.nextVisibleSectionIndex(this.state.sectionNum + 1, 1) !== -1;
    }
    nextVisibleSectionIndex(index, increment) {
        if (index < 0) {
            return -1;
        }
        if (index >= this.props.contents.length) {
            return -1;
        }
        const section = this.props.contents[index];
        const isVisible = this.props.isVisible(section._id);
        if (isVisible) {
            return index;
        }
        else {
            return this.nextVisibleSectionIndex(index + increment, increment);
        }
    }
    renderBreadcrumbs() {
        const breadcrumbs = [];
        let index = 0;
        while (index < this.state.sectionNum) {
            const section = this.props.contents[index];
            const visible = this.props.isVisible(section._id);
            breadcrumbs.push(R("li", { key: index }, R("b", null, visible
                ? R("a", {
                    className: "section-crumb",
                    disabled: !visible,
                    onClick: this.handleBreadcrumbClick.bind(this, index)
                }, `${index + 1}.`)
                : `${index + 1}.`)));
            index++;
        }
        const currentSectionName = formUtils.localizeString(this.props.contents[this.state.sectionNum].name, this.context.locale);
        breadcrumbs.push(R("li", { key: this.state.sectionNum }, R("b", null, `${this.state.sectionNum + 1}. ${currentSectionName}`)));
        return R("ul", { className: "breadcrumb" }, breadcrumbs);
    }
    renderSection() {
        const section = this.props.contents[this.state.sectionNum];
        return R("div", { key: section._id }, R("h3", null, formUtils.localizeString(section.name, this.context.locale)), R(ItemListComponent_1.default, {
            ref: (c) => {
                return (this.itemListComponent = c);
            },
            contents: section.contents,
            data: this.props.data,
            onDataChange: this.props.onDataChange,
            isVisible: this.props.isVisible,
            responseRow: this.props.responseRow,
            onNext: this.handleItemListNext,
            schema: this.props.schema
        }));
    }
    renderButtons() {
        return R("div", { className: "form-controls" }, 
        // If can go back
        this.hasPreviousSection()
            ? [
                R("button", { key: "back", type: "button", className: "btn btn-default", onClick: this.handleBackSection }, R("span", { className: "glyphicon glyphicon-backward" }), " " + this.context.T("Back")),
                "\u00A0"
            ]
            : undefined, 
        // Can go forward or submit
        (() => {
            if (this.hasNextSection()) {
                return R("button", {
                    key: "next",
                    type: "button",
                    ref: (c) => {
                        return (this.nextOrSubmit = c);
                    },
                    className: "btn btn-primary",
                    onClick: this.handleNextSection
                }, this.context.T("Next") + " ", R("span", { className: "glyphicon glyphicon-forward" }));
            }
            else if (this.props.onSubmit) {
                return R("button", {
                    key: "submit",
                    type: "button",
                    ref: (c) => {
                        return (this.nextOrSubmit = c);
                    },
                    className: "btn btn-primary",
                    onClick: this.handleSubmit
                }, this.context.T("Submit"));
            }
        })(), "\u00A0", this.props.onSaveLater
            ? [
                R("button", { key: "saveLater", type: "button", className: "btn btn-default", onClick: this.props.onSaveLater }, this.context.T("Save for Later")),
                "\u00A0"
            ]
            : undefined, this.props.onDiscard
            ? R("button", { key: "discard", type: "button", className: "btn btn-default", onClick: this.props.onDiscard }, R("span", { className: "glyphicon glyphicon-trash" }), " " + this.context.T("Discard"))
            : undefined);
    }
    render() {
        return R("div", {
            ref: (c) => {
                return (this.sections = c);
            }
        }, this.renderBreadcrumbs(), R("div", { className: "sections" }, this.renderSection()), this.renderButtons());
    }
}
exports.default = SectionsComponent;
SectionsComponent.initClass();
