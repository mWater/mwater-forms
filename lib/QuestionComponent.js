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
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const TextExprsComponent_1 = __importDefault(require("./TextExprsComponent"));
const LocationFinder_1 = __importDefault(require("./LocationFinder"));
const CurrentPositionFinder_1 = __importDefault(require("./CurrentPositionFinder"));
const AnswerValidator_1 = __importDefault(require("./answers/AnswerValidator"));
const AdminRegionAnswerComponent_1 = __importDefault(require("./answers/AdminRegionAnswerComponent"));
const AquagenxCBTAnswerComponent_1 = __importDefault(require("./answers/AquagenxCBTAnswerComponent"));
const BarcodeAnswerComponent_1 = __importDefault(require("./answers/BarcodeAnswerComponent"));
const CheckAnswerComponent_1 = __importDefault(require("./answers/CheckAnswerComponent"));
const DateAnswerComponent_1 = __importDefault(require("./answers/DateAnswerComponent"));
const DropdownAnswerComponent_1 = __importDefault(require("./answers/DropdownAnswerComponent"));
const EntityAnswerComponent_1 = __importDefault(require("./answers/EntityAnswerComponent"));
const ImageAnswerComponent_1 = __importDefault(require("./answers/ImageAnswerComponent"));
const ImagesAnswerComponent_1 = __importDefault(require("./answers/ImagesAnswerComponent"));
const LikertAnswerComponent_1 = __importDefault(require("./answers/LikertAnswerComponent"));
const LocationAnswerComponent_1 = __importDefault(require("./answers/LocationAnswerComponent"));
const MatrixAnswerComponent_1 = __importDefault(require("./answers/MatrixAnswerComponent"));
const MulticheckAnswerComponent_1 = __importDefault(require("./answers/MulticheckAnswerComponent"));
const NumberAnswerComponent_1 = __importDefault(require("./answers/NumberAnswerComponent"));
const RadioAnswerComponent_1 = __importDefault(require("./answers/RadioAnswerComponent"));
const SiteAnswerComponent_1 = __importDefault(require("./answers/SiteAnswerComponent"));
const StopwatchAnswerComponent_1 = __importDefault(require("./answers/StopwatchAnswerComponent"));
const TextAnswerComponent_1 = __importDefault(require("./answers/TextAnswerComponent"));
const TextListAnswerComponent_1 = __importDefault(require("./answers/TextListAnswerComponent"));
const UnitsAnswerComponent_1 = __importDefault(require("./answers/UnitsAnswerComponent"));
const CascadingListAnswerComponent_1 = require("./answers/CascadingListAnswerComponent");
const CascadingRefAnswerComponent_1 = require("./answers/CascadingRefAnswerComponent");
// Question component that displays a question of any type.
// Displays question text and hint
// Displays toggleable help
// Displays required (*)
// Displays comments field
// Does NOT fill in when sticky and visible for first time. This is done by data cleaning
// Does NOT remove answer when invisible. This is done by data cleaning
// Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
// Displays alternates and makes exclusive with answer
class QuestionComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleToggleHelp = () => {
            return this.setState({ helpVisible: !this.state.helpVisible });
        };
        this.handleValueChange = (value) => {
            return this.handleAnswerChange(lodash_1.default.extend({}, this.getAnswer(), { value }, { alternate: null }));
        };
        // Record a position found
        this.handleCurrentPositionFound = (loc) => {
            if (!this.unmounted) {
                const newAnswer = lodash_1.default.clone(this.getAnswer());
                newAnswer.location = lodash_1.default.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
                return this.props.onAnswerChange(newAnswer);
            }
        };
        this.handleCurrentPositionStatus = (status) => {
            // Always record useable positions
            if (status.useable) {
                return this.handleCurrentPositionFound(status.pos);
            }
        };
        this.handleAnswerChange = (newAnswer) => {
            const readonly = this.context.disableConfidentialFields && this.props.question.confidential;
            if (readonly) {
                return;
            }
            const oldAnswer = this.getAnswer();
            if (this.props.question.sticky && this.context.stickyStorage != null && newAnswer.value != null) {
                // TODO: SurveyorPro: What should happen if value is set to null?
                // TODO: SurveyorPro: What should happen if alternate is set? (or anything else that didn't change the value field)
                this.context.stickyStorage.set(this.props.question._id, newAnswer.value);
            }
            if (this.props.question.recordTimestamp && oldAnswer.timestamp == null) {
                newAnswer.timestamp = new Date().toISOString();
            }
            // Record location if no answer and not already getting location
            if (this.props.question.recordLocation && oldAnswer.location == null && !this.currentPositionFinder) {
                // Create location finder
                const locationFinder = this.context.locationFinder || new LocationFinder_1.default();
                // Create position finder
                this.currentPositionFinder = new CurrentPositionFinder_1.default({ locationFinder });
                // Listen to current position events (for setting location)
                this.currentPositionFinder.on("found", this.handleCurrentPositionFound);
                this.currentPositionFinder.on("status", this.handleCurrentPositionStatus);
                this.currentPositionFinder.start();
            }
            return this.props.onAnswerChange(newAnswer);
        };
        this.handleAlternate = (alternate) => {
            const answer = this.getAnswer();
            // If we are selecting a new alternate
            if (answer.alternate !== alternate) {
                // If old alternate was null (important not to do this when changing from an alternate value to another)
                if (answer.alternate == null) {
                    // It saves value and specify
                    this.setState({ savedValue: answer.value, savedSpecify: answer.specify });
                }
                // Then clear value, specify and set alternate
                return this.handleAnswerChange(lodash_1.default.extend({}, answer, {
                    value: null,
                    specify: null,
                    alternate
                }));
            }
            else {
                // Clear alternate and put back saved value and specify
                this.handleAnswerChange(lodash_1.default.extend({}, answer, {
                    value: this.state.savedValue,
                    specify: this.state.savedSpecify,
                    alternate: null
                }));
                return this.setState({ savedValue: null, savedSpecify: null });
            }
        };
        this.handleCommentsChange = (ev) => {
            return this.handleAnswerChange(lodash_1.default.extend({}, this.getAnswer(), { comments: ev.target.value }));
        };
        // Either jump to next question or select the comments box
        this.handleNextOrComments = (ev) => {
            var _a, _b;
            // If it has a comment box, set the focus on it
            if (this.props.question.commentsField != null) {
                const { comments } = this;
                // For some reason, comments can be null here sometimes
                comments === null || comments === void 0 ? void 0 : comments.focus();
                return comments === null || comments === void 0 ? void 0 : comments.select();
                // Else we lose the focus and go to the next question
            }
            else {
                // Blur the input (remove the focus)
                ev.target.blur();
                return (_b = (_a = this.props).onNext) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
        };
        this.state = {
            helpVisible: false,
            validationError: null,
            // savedValue and savedSpecify are used to save the value when selecting an alternate answer
            savedValue: null,
            savedSpecify: null
        };
    }
    componentWillUnmount() {
        this.unmounted = true;
        // Stop position finder
        if (this.currentPositionFinder) {
            return this.currentPositionFinder.stop();
        }
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.context.locale !== nextContext.locale) {
            return true;
        }
        if (nextProps.question.textExprs != null && nextProps.question.textExprs.length > 0) {
            return true;
        }
        if (nextProps.question.choices != null) {
            for (let choice of nextProps.question.choices) {
                if (choice.conditions != null && choice.conditions.length > 0) {
                    return true;
                }
            }
        }
        if (nextProps.question !== this.props.question) {
            return true;
        }
        const oldAnswer = this.props.data[this.props.question._id];
        const newAnswer = nextProps.data[this.props.question._id];
        if (newAnswer !== oldAnswer) {
            return true;
        }
        if (!lodash_1.default.isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    }
    focus() {
        const { answer } = this;
        if (answer != null && answer.focus != null) {
            return answer.focus();
        }
    }
    getAnswer() {
        // The answer to this question
        const answer = this.props.data[this.props.question._id];
        if (answer != null) {
            return answer;
        }
        return {};
    }
    // Returns true if validation error
    validate(scrollToFirstInvalid) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            // If we are disabling confidential data return true
            if (this.context.disableConfidentialFields && this.props.question.confidential) {
                return false;
            }
            // If answer has custom validation, use that
            if ((_a = this.answer) === null || _a === void 0 ? void 0 : _a.validate) {
                const answerInvalid = (_b = this.answer) === null || _b === void 0 ? void 0 : _b.validate();
                if (answerInvalid && scrollToFirstInvalid) {
                    this.prompt.scrollIntoView();
                }
                if (answerInvalid) {
                    this.setState({ validationError: answerInvalid });
                    return answerInvalid;
                }
            }
            let validationError = yield new AnswerValidator_1.default(this.props.schema, this.props.responseRow, this.context.locale).validate(this.props.question, this.getAnswer());
            // Check for isValid function in answer component, as some answer components don't store invalid answers
            // like the number answer.
            if (!validationError && ((_c = this.answer) === null || _c === void 0 ? void 0 : _c.isValid) && !((_d = this.answer) === null || _d === void 0 ? void 0 : _d.isValid())) {
                validationError = true;
            }
            if (validationError != null) {
                if (scrollToFirstInvalid) {
                    this.prompt.scrollIntoView();
                }
                this.setState({ validationError });
                return true;
            }
            else {
                this.setState({ validationError: null });
                return false;
            }
        });
    }
    renderPrompt() {
        const promptDiv = R("div", {
            className: "prompt",
            ref: (c) => {
                return (this.prompt = c);
            }
        }, this.props.question.code ? R("span", { className: "question-code" }, this.props.question.code + ": ") : undefined, R(TextExprsComponent_1.default, {
            localizedStr: this.props.question.text,
            exprs: this.props.question.textExprs,
            schema: this.props.schema,
            responseRow: this.props.responseRow,
            locale: this.context.locale
        }), 
        // Required star
        this.props.question.required && !(this.context.disableConfidentialFields && this.props.question.confidential)
            ? R("span", { className: "required" }, "*")
            : undefined, this.props.question.help
            ? R("button", { type: "button", id: "helpbtn", className: "btn btn-link btn-sm", onClick: this.handleToggleHelp }, R("span", { className: "glyphicon glyphicon-question-sign" }))
            : undefined);
        // Special case!
        if (this.props.question._type === "CheckQuestion") {
            return R(CheckAnswerComponent_1.default, {
                ref: (c) => {
                    return (this.answer = c);
                },
                value: this.getAnswer().value,
                onValueChange: this.handleValueChange,
                label: this.props.question.label
            }, promptDiv);
        }
        else {
            return promptDiv;
        }
    }
    renderHint() {
        return R("div", null, this.props.question.hint
            ? R("div", { className: "text-muted" }, formUtils.localizeString(this.props.question.hint, this.context.locale))
            : undefined, this.context.disableConfidentialFields && this.props.question.confidential
            ? R("div", { className: "text-muted" }, this.context.T("Confidential answers may not be edited."))
            : undefined);
    }
    renderHelp() {
        if (this.state.helpVisible && this.props.question.help) {
            return R("div", {
                className: "help well well-sm",
                dangerouslySetInnerHTML: {
                    __html: new markdown_it_1.default().render(formUtils.localizeString(this.props.question.help, this.context.locale))
                }
            });
        }
    }
    renderValidationError() {
        if (this.state.validationError != null && typeof this.state.validationError === "string") {
            return R("div", { className: "validation-message text-danger" }, this.state.validationError);
        }
    }
    renderAlternates() {
        if (this.props.question.alternates &&
            (this.props.question.alternates.na || this.props.question.alternates.dontknow)) {
            return R("div", null, this.props.question.alternates.dontknow
                ? R("div", {
                    id: "dn",
                    className: `touch-checkbox alternate ${this.getAnswer().alternate === "dontknow" ? "checked" : undefined}`,
                    onClick: this.handleAlternate.bind(null, "dontknow")
                }, this.context.T("Don't Know"))
                : undefined, this.props.question.alternates.na
                ? R("div", {
                    id: "na",
                    className: `touch-checkbox alternate ${this.getAnswer().alternate === "na" ? "checked" : undefined}`,
                    onClick: this.handleAlternate.bind(null, "na")
                }, this.context.T("Not Applicable"))
                : undefined);
        }
    }
    renderCommentsField() {
        if (this.props.question.commentsField) {
            return R("textarea", {
                className: "form-control question-comments",
                id: "comments",
                ref: (c) => {
                    return (this.comments = c);
                },
                placeholder: this.context.T("Comments"),
                value: this.getAnswer().comments,
                onChange: this.handleCommentsChange
            });
        }
    }
    renderAnswer() {
        const answer = this.getAnswer();
        const readonly = (this.context.disableConfidentialFields && this.props.question.confidential) || (answer === null || answer === void 0 ? void 0 : answer.confidential) != null;
        switch (this.props.question._type) {
            case "TextQuestion":
                return R(TextAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    format: this.props.question.format,
                    readOnly: readonly,
                    onValueChange: this.handleValueChange,
                    onNextOrComments: this.handleNextOrComments
                });
                break;
            case "NumberQuestion":
                return R(NumberAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onChange: !readonly ? this.handleValueChange : undefined,
                    decimal: this.props.question.decimal,
                    onNextOrComments: this.handleNextOrComments
                });
                break;
            case "DropdownQuestion":
                return R(DropdownAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    choices: this.props.question.choices,
                    answer,
                    data: this.props.data,
                    onAnswerChange: this.handleAnswerChange
                });
                break;
            case "LikertQuestion":
                return R(LikertAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    items: this.props.question.items,
                    choices: this.props.question.choices,
                    answer,
                    data: this.props.data,
                    onAnswerChange: this.handleAnswerChange
                });
                break;
            case "RadioQuestion":
                return R(RadioAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    choices: this.props.question.choices,
                    answer,
                    data: this.props.data,
                    displayMode: this.props.question.displayMode,
                    onAnswerChange: this.handleAnswerChange
                });
                break;
            case "MulticheckQuestion":
                return R(MulticheckAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    choices: this.props.question.choices,
                    data: this.props.data,
                    answer,
                    onAnswerChange: this.handleAnswerChange
                });
                break;
            case "DateQuestion":
                return R(DateAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    format: this.props.question.format,
                    placeholder: this.props.question.placeholder,
                    onNextOrComments: this.handleNextOrComments
                });
                break;
            case "UnitsQuestion":
                return R(UnitsAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    answer,
                    onValueChange: this.handleValueChange,
                    units: this.props.question.units,
                    defaultUnits: this.props.question.defaultUnits,
                    prefix: this.props.question.unitsPosition === "prefix",
                    decimal: this.props.question.decimal,
                    onNextOrComments: this.handleNextOrComments
                });
                break;
            case "CheckQuestion":
                // Look at renderPrompt special case
                return null;
                break;
            case "LocationQuestion":
                return R(LocationAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    disableSetByMap: this.props.question.disableSetByMap,
                    disableManualLatLng: this.props.question.disableManualLatLng,
                    value: answer.value,
                    onValueChange: this.handleValueChange
                });
                break;
            case "ImageQuestion":
                return R(ImageAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    image: answer.value,
                    onImageChange: this.handleValueChange,
                    consentPrompt: this.props.question.consentPrompt
                        ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
                        : undefined
                });
                break;
            case "ImagesQuestion":
                return R(ImagesAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    imagelist: answer.value,
                    onImagelistChange: this.handleValueChange,
                    consentPrompt: this.props.question.consentPrompt
                        ? formUtils.localizeString(this.props.question.consentPrompt, this.context.locale)
                        : undefined
                });
                break;
            case "TextListQuestion":
                return R(TextListAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    onNextOrComments: this.handleNextOrComments
                });
                break;
            case "SiteQuestion":
                return R(SiteAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    siteTypes: this.props.question.siteTypes,
                    T: this.context.T
                });
                break;
            case "BarcodeQuestion":
                return R(BarcodeAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange
                });
                break;
            case "EntityQuestion":
                return R(EntityAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    entityType: this.props.question.entityType,
                    onValueChange: this.handleValueChange
                });
                break;
            case "AdminRegionQuestion":
                return R(AdminRegionAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onChange: this.handleValueChange
                });
                break;
            case "StopwatchQuestion":
                return R(StopwatchAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    T: this.context.T
                });
                break;
            case "MatrixQuestion":
                return R(MatrixAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    alternate: answer.alternate,
                    items: this.props.question.items,
                    columns: this.props.question.columns,
                    data: this.props.data,
                    responseRow: this.props.responseRow,
                    schema: this.props.schema
                });
                break;
            case "AquagenxCBTQuestion":
                return R(AquagenxCBTAnswerComponent_1.default, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    questionId: this.props.question._id
                });
                break;
            case "CascadingListQuestion":
                return R(CascadingListAnswerComponent_1.CascadingListAnswerComponent, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    columns: this.props.question.columns,
                    rows: this.props.question.rows,
                    sortOptions: this.props.question.sortOptions,
                    T: this.context.T,
                    locale: this.context.locale
                });
                break;
            case "CascadingRefQuestion":
                return R(CascadingRefAnswerComponent_1.CascadingRefAnswerComponent, {
                    ref: (c) => {
                        return (this.answer = c);
                    },
                    question: this.props.question,
                    value: answer.value,
                    onValueChange: this.handleValueChange,
                    schema: this.props.schema,
                    getCustomTableRows: this.context.getCustomTableRows,
                    T: this.context.T,
                    locale: this.context.locale
                });
                break;
            default:
                return `Unknown type ${this.props.question._type}`;
        }
        return null;
    }
    render() {
        const answer = this.getAnswer();
        // Create classname to include invalid if invalid
        let className = "question";
        if (this.state.validationError != null) {
            className += " invalid";
        }
        return R("div", { className, "data-qn-id": this.props.question._id }, this.renderPrompt(), this.renderHint(), this.renderHelp(), R("div", { className: "answer" }, this.renderAnswer()), answer.confidential != null
            ? R("span", { className: "help-block" }, this.context.T("Confidential answers may not be edited."))
            : undefined, answer.confidential == null ? [this.renderAlternates(), this.renderValidationError()] : undefined, this.renderCommentsField());
    }
}
exports.default = QuestionComponent;
QuestionComponent.contextTypes = {
    locale: prop_types_1.default.string,
    stickyStorage: prop_types_1.default.object,
    locationFinder: prop_types_1.default.object,
    T: prop_types_1.default.func.isRequired,
    disableConfidentialFields: prop_types_1.default.bool,
    getCustomTableRows: prop_types_1.default.func.isRequired
};
