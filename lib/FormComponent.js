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
const SectionsComponent_1 = __importDefault(require("./SectionsComponent"));
const ItemListComponent_1 = __importDefault(require("./ItemListComponent"));
const ez_localize_1 = require("ez-localize");
const ResponseCleaner_1 = __importDefault(require("./ResponseCleaner"));
const ResponseRow_1 = __importDefault(require("./ResponseRow"));
const DefaultValueApplier_1 = __importDefault(require("./DefaultValueApplier"));
const VisibilityCalculator_1 = __importDefault(require("./VisibilityCalculator"));
const RandomAskedCalculator_1 = __importDefault(require("./RandomAskedCalculator"));
const formContextTypes = __importStar(require("./formContextTypes"));
/** Displays a form that can be filled out */
class FormComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
            // Cannot submit if at least one item is invalid
            const result = yield this.itemListComponent.validate(true);
            if (!result) {
                return this.props.onSubmit();
            }
        });
        this.isVisible = (itemId) => {
            return this.props.forceAllVisible || this.state.visibilityStructure[itemId];
        };
        this.createResponseRow = (data) => {
            return new ResponseRow_1.default({
                responseData: data,
                formDesign: this.props.design,
                schema: this.props.schema,
                getEntityById: this.props.formCtx.getEntityById,
                getEntityByCode: this.props.formCtx.getEntityByCode,
                getCustomTableRow: this.props.formCtx.getCustomTableRow,
                getAssetById: this.props.formCtx.getAssetById,
                deployment: this.props.deployment
            });
        };
        this.handleDataChange = (data) => {
            const visibilityCalculator = new VisibilityCalculator_1.default(this.props.design, this.props.schema);
            const defaultValueApplier = this.props.formCtx.stickyStorage ? new DefaultValueApplier_1.default(this.props.design, this.props.formCtx.stickyStorage, {
                entityType: this.props.entityType,
                entity: this.props.entity,
                assetSystemId: this.props.assetSystemId,
                assetType: this.props.assetType,
                assetId: this.props.assetId,
            }) : null;
            const randomAskedCalculator = new RandomAskedCalculator_1.default(this.props.design);
            const responseCleaner = new ResponseCleaner_1.default();
            // Immediately update data, as another answer might be clicked on (e.g. blur from a number input and clicking on a radio answer)
            this.currentData = data;
            this.props.onDataChange(data);
            // Clean response data, remembering which data object is being cleaned
            this.cleanInProgress = data;
            return responseCleaner.cleanData(this.props.design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, this.createResponseRow, this.state.visibilityStructure, (error, results) => {
                if (error) {
                    alert(this.state.T("Error saving data") + `: ${error.message}`);
                    return;
                }
                // Ignore if from a previous clean
                if (data !== this.cleanInProgress) {
                    console.log("Ignoring stale handleDataChange data");
                    return;
                }
                this.setState({ visibilityStructure: results.visibilityStructure });
                // Ignore if unchanged
                if (!lodash_1.default.isEqual(data, results.data)) {
                    this.currentData = results.data;
                    return this.props.onDataChange(results.data);
                }
            });
        };
        this.handleNext = () => {
            return this.submit.focus();
        };
        this.state = {
            visibilityStructure: {},
            T: this.createLocalizer(this.props.design, this.props.locale)
        };
        // Save which data visibility structure applies to
        this.currentData = null;
    }
    getChildContext() {
        return lodash_1.default.extend({}, this.props.formCtx, {
            T: this.state.T,
            locale: this.props.locale,
            disableConfidentialFields: this.props.disableConfidentialFields
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.design !== nextProps.design || this.props.locale !== nextProps.locale) {
            return this.setState({ T: this.createLocalizer(nextProps.design, nextProps.locale) });
        }
    }
    componentDidUpdate(prevProps) {
        // When data change is external, process it to set visibility, etc.
        if (prevProps.data !== this.props.data && !lodash_1.default.isEqual(this.props.data, this.currentData)) {
            return this.handleDataChange(this.props.data);
        }
    }
    // This will clean the data that has been passed at creation
    // It will also initialize the visibilityStructure
    // And set the sticky data
    componentWillMount() {
        return this.handleDataChange(this.props.data);
    }
    // Creates a localizer for the form design
    createLocalizer(design, locale) {
        // Create localizer
        const localizedStrings = design.localizedStrings || [];
        const localizerData = {
            locales: design.locales,
            strings: localizedStrings
        };
        const { T } = new ez_localize_1.Localizer(localizerData, locale);
        return T;
    }
    render() {
        if (this.props.design.contents[0] &&
            this.props.design.contents[0]._type === "Section" &&
            !this.props.singlePageMode) {
            return R(SectionsComponent_1.default, {
                contents: this.props.design.contents,
                data: this.props.data,
                onDataChange: this.handleDataChange,
                responseRow: this.createResponseRow(this.props.data),
                schema: this.props.schema,
                onSubmit: this.props.onSubmit,
                onSaveLater: this.props.onSaveLater,
                onDiscard: this.props.onDiscard,
                isVisible: this.isVisible
            });
        }
        else {
            return R("div", null, R(ItemListComponent_1.default, {
                ref: (c) => {
                    this.itemListComponent = c;
                },
                contents: this.props.design.contents,
                data: this.props.data,
                onDataChange: this.handleDataChange,
                responseRow: this.createResponseRow(this.props.data),
                schema: this.props.schema,
                isVisible: this.isVisible,
                onNext: this.handleNext
            }), this.props.onSubmit
                ? R("button", {
                    type: "button",
                    key: "submitButton",
                    className: "btn btn-primary",
                    ref: (c) => {
                        this.submit = c;
                    },
                    onClick: this.handleSubmit
                }, this.props.submitLabel ? this.props.submitLabel : this.state.T("Submit"))
                : undefined, "\u00A0", this.props.onSaveLater
                ? [
                    R("button", {
                        type: "button",
                        key: "saveLaterButton",
                        className: "btn btn-secondary",
                        onClick: this.props.onSaveLater
                    }, this.props.saveLaterLabel ? this.props.saveLaterLabel : this.state.T("Save for Later")),
                    "\u00A0"
                ]
                : undefined, this.props.onDiscard
                ? R("button", { type: "button", key: "discardButton", className: "btn btn-secondary", onClick: this.props.onDiscard }, this.props.discardLabel
                    ? this.props.discardLabel
                    : [R("span", { className: "fas fa-trash-alt" }), " " + this.state.T("Discard")])
                : undefined);
        }
    }
}
exports.default = FormComponent;
FormComponent.childContextTypes = lodash_1.default.extend({}, formContextTypes, {
    T: prop_types_1.default.func.isRequired,
    locale: prop_types_1.default.string,
    disableConfidentialFields: prop_types_1.default.bool
});
