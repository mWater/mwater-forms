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
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formUtils = __importStar(require("./formUtils"));
const moment_1 = __importDefault(require("moment"));
const ui = __importStar(require("react-library/lib/bootstrap"));
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
const VisibilityCalculator_1 = __importDefault(require("./VisibilityCalculator"));
const ResponseRow_1 = __importDefault(require("./ResponseRow"));
const TextExprsComponent_1 = __importDefault(require("./TextExprsComponent"));
const ImageDisplayComponent_1 = __importDefault(require("./ImageDisplayComponent"));
const EntityDisplayComponent_1 = __importDefault(require("./EntityDisplayComponent"));
const AdminRegionDisplayComponent_1 = __importDefault(require("./AdminRegionDisplayComponent"));
const AquagenxCBTDisplayComponent_1 = __importDefault(require("./answers/AquagenxCBTDisplayComponent"));
const CascadingListDisplayComponent_1 = require("./answers/CascadingListDisplayComponent");
const CascadingRefDisplayComponent_1 = require("./answers/CascadingRefDisplayComponent");
const CalculationsDisplayComponent_1 = require("./CalculationsDisplayComponent");
// Displays the answers of a response in a table
class ResponseAnswersComponent extends AsyncLoadComponent_1.default {
    // Check if form design or data are different
    isLoadNeeded(newProps, oldProps) {
        return !lodash_1.default.isEqual(newProps.formDesign, oldProps.formDesign) || !lodash_1.default.isEqual(newProps.data, oldProps.data);
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        const responseRow = new ResponseRow_1.default({
            responseData: props.data,
            formDesign: props.formDesign,
            getEntityById: props.formCtx.getEntityById,
            getEntityByCode: props.formCtx.getEntityByCode,
            getCustomTableRow: props.formCtx.getCustomTableRow,
            deployment: props.deployment,
            schema: props.schema
        });
        // Calculate visibility asynchronously
        return new VisibilityCalculator_1.default(props.formDesign, props.schema).createVisibilityStructure(props.data, responseRow, (error, visibilityStructure) => {
            return callback({ error, visibilityStructure, responseRow });
        });
    }
    handleLocationClick(location) {
        if (this.props.formCtx.displayMap) {
            return this.props.formCtx.displayMap(location);
        }
    }
    renderLocation(location) {
        if (location) {
            return R("div", null, R("a", { onClick: this.handleLocationClick.bind(this, location), style: { cursor: "pointer" } }, `${location.latitude}\u00B0 ${location.longitude}\u00B0`, location.accuracy != null ? `(+/-) ${location.accuracy.toFixed(3)} m` : undefined, location.method ? ` (${location.method})` : undefined));
        }
        return null;
    }
    renderAnswer(q, answer) {
        let label, specify;
        if (!answer) {
            return null;
        }
        // Handle alternates
        if (answer.alternate) {
            switch (answer.alternate) {
                case "na":
                    return R("em", null, this.props.T("Not Applicable"));
                    break;
                case "dontknow":
                    return R("em", null, this.props.T("Don't Know"));
                    break;
            }
        }
        if (answer.confidential != null) {
            return R("em", null, this.props.T("Redacted"));
        }
        if (answer.value == null) {
            return null;
        }
        switch (formUtils.getAnswerType(q)) {
            case "text":
                // Format as url if url
                if (answer.value &&
                    answer.value.match(/^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:,&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:,&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&,;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/)) {
                    // Open in system window if in cordova
                    const target = window.cordova != null ? "_system" : "_blank";
                    return R("a", { href: answer.value, target }, answer.value);
                }
                return answer.value;
            case "number":
                return "" + answer.value;
            case "choice":
                var choice = lodash_1.default.findWhere(q.choices, { id: answer.value });
                if (choice) {
                    label = formUtils.localizeString(choice.label, this.props.locale);
                    if (answer.specify != null) {
                        specify = answer.specify[answer.value];
                    }
                    else {
                        specify = null;
                    }
                    return R("div", null, label, (() => {
                        if (specify) {
                            ;
                            (": ");
                            return R("em", null, specify);
                        }
                    })());
                }
                else {
                    return R("span", { className: "label label-danger" }, "Invalid Choice");
                }
            case "choices":
                return lodash_1.default.map(answer.value, (v) => {
                    choice = lodash_1.default.findWhere(q.choices, { id: v });
                    if (choice) {
                        return R("div", null, formUtils.localizeString(choice.label, this.props.locale), (() => {
                            if (answer.specify != null && answer.specify[v]) {
                                ;
                                (": ");
                                return R("em", null, answer.specify[v]);
                            }
                        })());
                    }
                    else {
                        return R("div", { className: "label label-danger" }, "Invalid Choice");
                    }
                });
            case "date":
                // Depends on precision
                if (answer.value.length <= 7) {
                    // YYYY or YYYY-MM
                    return R("div", null, answer.value);
                }
                else if (answer.value.length <= 10) {
                    // Date
                    return R("div", null, moment_1.default(answer.value).format("LL"));
                }
                else {
                    return R("div", null, moment_1.default(answer.value).format("LLL"));
                }
            case "units":
                if (answer.value && answer.value.quantity != null && answer.value.units != null) {
                    // Find units
                    const units = lodash_1.default.findWhere(q.units, { id: answer.value.units });
                    const valueStr = "" + answer.value.quantity;
                    const unitsStr = units ? formUtils.localizeString(units.label, this.props.locale) : "(Invalid)";
                    if (q.unitsPosition === "prefix") {
                        return R("div", null, R("em", null, unitsStr), " ", valueStr);
                    }
                    else {
                        return R("div", null, valueStr, " ", R("em", null, unitsStr));
                    }
                }
                break;
            case "boolean":
                if (answer.value) {
                    return this.props.T("True");
                }
                else {
                    return this.props.T("False");
                }
            case "location":
                return this.renderLocation(answer.value);
            case "image":
                if (answer.value) {
                    return R(ImageDisplayComponent_1.default, {
                        image: answer.value,
                        imageManager: this.props.formCtx.imageManager,
                        T: this.props.T
                    });
                }
                break;
            case "images":
                return lodash_1.default.map(answer.value, (img) => {
                    return R(ImageDisplayComponent_1.default, {
                        image: img,
                        imageManager: this.props.formCtx.imageManager,
                        T: this.props.T
                    });
                });
            case "texts":
                return lodash_1.default.map(answer.value, (txt) => {
                    return R("div", null, txt);
                });
            case "site":
                var code = answer.value;
                // TODO Eventually always go to code parameter. Legacy responses used code directly as value.
                if (lodash_1.default.isObject(code)) {
                    ;
                    ({ code } = code);
                }
                // Convert to new entity type
                var siteType = (q.siteTypes ? q.siteTypes[0] : undefined) || "water_point";
                // Site column question have siteType
                if (q._type === "SiteColumnQuestion") {
                    siteType = q.siteType || "water_point";
                }
                var entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_");
                return R(EntityDisplayComponent_1.default, {
                    entityCode: code,
                    entityType,
                    getEntityByCode: this.props.formCtx.getEntityByCode,
                    renderEntityView: this.props.formCtx.renderEntitySummaryView,
                    T: this.props.T
                });
            case "entity":
                return R(EntityDisplayComponent_1.default, {
                    entityId: answer.value,
                    entityType: q.entityType,
                    getEntityById: this.props.formCtx.getEntityById,
                    renderEntityView: this.props.formCtx.renderEntitySummaryView,
                    T: this.props.T
                });
            case "admin_region":
                return R(AdminRegionDisplayComponent_1.default, {
                    getAdminRegionPath: this.props.formCtx.getAdminRegionPath,
                    value: answer.value,
                    T: this.props.T
                });
            case "items_choices":
                for (let item of q.items) {
                    const choiceId = answer.value[item.id];
                    if (choiceId != null) {
                        choice = lodash_1.default.findWhere(q.choices, { id: choiceId });
                        if (choice != null) {
                            return R("div", null, formUtils.localizeString(choice.label, this.props.locale));
                        }
                        else {
                            return R("span", { className: "label label-danger" }, "Invalid Choice");
                        }
                    }
                }
            case "aquagenx_cbt":
                return R(AquagenxCBTDisplayComponent_1.default, {
                    value: answer.value,
                    questionId: q._id,
                    imageManager: this.props.formCtx.imageManager
                });
            case "cascading_list":
                return R(CascadingListDisplayComponent_1.CascadingListDisplayComponent, {
                    question: q,
                    value: answer.value,
                    locale: this.props.locale
                });
            case "cascading_ref":
                return R(CascadingRefDisplayComponent_1.CascadingRefDisplayComponent, {
                    question: q,
                    value: answer.value,
                    locale: this.props.locale,
                    schema: this.props.schema,
                    getCustomTableRow: this.props.formCtx.getCustomTableRow
                });
        }
    }
    // Special render on multiple rows
    renderLikertAnswer(q, answer, prevAnswer) {
        if (!answer) {
            return null;
        }
        if (answer.alternate) {
            return null;
        }
        if (answer.value == null) {
            return null;
        }
        if (formUtils.getAnswerType(q) === "items_choices") {
            const contents = [];
            for (let item of q.items) {
                const itemTd = R("td", { style: { textAlign: "center" } }, formUtils.localizeString(item.label, this.props.locale));
                let choiceId = answer.value[item.id];
                if (choiceId != null) {
                    let choice = lodash_1.default.findWhere(q.choices, { id: choiceId });
                    if (choice != null) {
                        contents.push(R("tr", null, itemTd, R("td", null, formUtils.localizeString(choice.label, this.props.locale))));
                    }
                    else {
                        contents.push(R("tr", null, itemTd, R("td", null, R("span", { className: "label label-danger" }, "Invalid Choice"))));
                    }
                    if (this.props.showPrevAnswers && prevAnswer) {
                        choiceId = prevAnswer.value[item.id];
                        if (choiceId != null) {
                            choice = lodash_1.default.findWhere(q.choices, { id: choiceId });
                            if (choice != null) {
                                contents.push(R("tr", null, itemTd, R("td", null, formUtils.localizeString(choice.label, this.props.locale))));
                            }
                            else {
                                contents.push(R("tr", null, itemTd, R("td", null, R("span", { className: "label label-danger" }, "Invalid Choice"))));
                            }
                        }
                    }
                }
            }
            return contents;
        }
        else {
            return null;
        }
    }
    renderQuestion(q, dataId) {
        var _a, _b;
        // Get answer
        let answer;
        const dataIds = dataId.split(".");
        if (dataIds.length === 1) {
            answer = this.props.data[dataId];
        }
        else {
            let rosterData = this.props.data[dataIds[0]];
            if (rosterData.value != null) {
                rosterData = rosterData.value;
                answer = rosterData[dataIds[1]][dataIds[2]];
            }
            else {
                answer = rosterData[dataIds[1]].data[dataIds[2]];
            }
        }
        // Do not display if empty and hide empty true
        if (this.props.hideEmptyAnswers && (answer === null || answer === void 0 ? void 0 : answer.value) == null && !(answer === null || answer === void 0 ? void 0 : answer.alternate)) {
            return null;
        }
        let prevAnswer = null;
        const trProps = { key: dataId };
        if (this.props.prevData) {
            if (dataIds.length === 1) {
                prevAnswer = this.props.prevData.data[dataId];
            }
            else {
                let prevRosterData = this.props.prevData.data[dataIds[0]];
                if (prevRosterData != null) {
                    if (prevRosterData.value != null) {
                        prevRosterData = prevRosterData.value;
                        prevAnswer = (_a = prevRosterData[dataIds[1]]) === null || _a === void 0 ? void 0 : _a[dataIds[2]];
                    }
                    else {
                        prevAnswer = (_b = prevRosterData[dataIds[1]]) === null || _b === void 0 ? void 0 : _b.data[dataIds[2]];
                    }
                }
            }
        }
        const likertAnswer = this.renderLikertAnswer(q, answer, prevAnswer);
        // If both answer and previous answer are falsy
        if (!prevAnswer && (answer === null || answer === void 0 ? void 0 : answer.value) == null && this.props.hideUnchangedAnswers) {
            return null;
        }
        if (!lodash_1.default.isEqual(prevAnswer === null || prevAnswer === void 0 ? void 0 : prevAnswer.value, answer === null || answer === void 0 ? void 0 : answer.value) || !lodash_1.default.isEqual(prevAnswer === null || prevAnswer === void 0 ? void 0 : prevAnswer.specify, answer === null || answer === void 0 ? void 0 : answer.specify)) {
            if (this.props.highlightChanges) {
                trProps["style"] = { background: "#ffd" };
            }
        }
        else {
            if (this.props.hideUnchangedAnswers) {
                return null;
            }
        }
        return [
            R("tr", trProps, R("td", { key: "name", style: { width: "50%" } }, formUtils.localizeString(q.text, this.props.locale)), R("td", { key: "value" }, R("div", null, likertAnswer == null ? this.renderAnswer(q, answer, dataId) : undefined, (() => {
                if (answer && answer.timestamp) {
                    this.props.T("Answered");
                    (": ");
                    return moment_1.default(answer.timestamp).format("llll");
                }
            })(), answer && answer.location ? this.renderLocation(answer.location) : undefined, answer && answer.comments ? R("div", { className: "text-muted" }, answer.comments) : undefined, prevAnswer != null && !lodash_1.default.isEqual(prevAnswer.value, answer === null || answer === void 0 ? void 0 : answer.value) && this.props.showChangedLink
                ? R("a", {
                    style: { float: "right", display: "inline-block", cursor: "pointer", fontSize: 9 },
                    onClick: this.props.onChangedLinkClick,
                    key: "view_change"
                }, R(ui.Icon, { id: "glyphicon-pencil" }), " ", this.props.T("Edited"))
                : undefined)), this.props.showPrevAnswers && this.props.prevData
                ? R("td", { key: "prevValue" }, prevAnswer != null && !lodash_1.default.isEqual(prevAnswer.value, answer === null || answer === void 0 ? void 0 : answer.value) && this.props.onCompleteHistoryLinkClick
                    ? R("a", {
                        style: { float: "right", display: "inline-block", cursor: "pointer", fontSize: 9 },
                        onClick: this.props.onCompleteHistoryLinkClick,
                        key: "view_history"
                    }, this.props.T("Show Changes"))
                    : undefined, typeof prevMatrixAnswer === "undefined" || prevMatrixAnswer === null
                    ? this.renderAnswer(q, prevAnswer)
                    : undefined, prevAnswer && prevAnswer.timestamp
                    ? R("div", null, this.props.T("Answered"), ": ", moment_1.default(prevAnswer.timestamp).format("llll"))
                    : undefined, prevAnswer && prevAnswer.location ? this.renderLocation(prevAnswer.location) : undefined)
                : undefined),
            likertAnswer
        ];
    }
    // Add all the items with the proper rosterId to items array
    // Looks inside groups and sections
    collectItemsReferencingRoster(items, contents, rosterId) {
        // Get the contents of all the other question that are referencing this roster
        return (() => {
            const result = [];
            for (let otherItem of contents) {
                if (otherItem._type === "Group" || otherItem._type === "Section") {
                    this.collectItemsReferencingRoster(items, otherItem.contents, rosterId);
                }
                if (otherItem.rosterId === rosterId) {
                    result.push(items.push.apply(items, otherItem.contents));
                }
                else {
                    result.push(undefined);
                }
            }
            return result;
        })();
    }
    // dataId is the key used for looking up the data + testing visibility
    // dataId is simply item._id except for rosters children
    renderItem(item, visibilityStructure, dataId) {
        let data, items;
        var contents, dataId;
        if (!visibilityStructure[dataId]) {
            return;
        }
        const colspan = this.props.showPrevAnswers && this.props.prevData ? 3 : 2;
        // Sections and Groups behave the same
        if (item._type === "Section" || item._type === "Group") {
            contents = lodash_1.default.map(item.contents, (item) => {
                let id = item._id;
                if (dataId) {
                    // The group is inside a roster
                    const parts = dataId.split(".");
                    parts.pop();
                    parts.push(item._id);
                    id = parts.join(".");
                }
                return this.renderItem(item, visibilityStructure, id);
            });
            // Remove nulls
            contents = lodash_1.default.compact(contents);
            // Do not display if empty
            if (contents.length === 0) {
                return null;
            }
            return [
                R("tr", { key: item._id }, R("td", { colSpan: colspan, style: { fontWeight: "bold" } }, formUtils.localizeString(item.name, this.props.locale))),
                contents
            ];
        }
        // RosterMatrices and RosterGroups behave the same
        // Only the one storing the data will display it
        // The rosters referencing another one will display a simple text to say so
        if (item._type === "RosterMatrix" || item._type === "RosterGroup") {
            items = [];
            // Simply display a text referencing the other roster if a reference
            if (item.rosterId != null) {
                // Unless hiding empty, in which case blank
                if (this.props.hideEmptyAnswers) {
                    return null;
                }
                const referencedRoster = formUtils.findItem(this.props.formDesign, item.rosterId);
                return R("tr", null, R("td", { style: { fontWeight: "bold" } }, formUtils.localizeString(item.name, this.props.locale)), R("td", { colSpan: colspan - 1 }, R("span", { style: { fontStyle: "italic" } }, this.props.T("Data is stored in {0}", formUtils.localizeString(referencedRoster.name, this.props.locale)))));
            }
            // Get the data for that roster
            data = this.props.data[item._id];
            if ((!data || data.length === 0) && this.props.hideEmptyAnswers) {
                return null;
            }
            // Get the questions of the other rosters referencing this one
            items = lodash_1.default.clone(item.contents);
            this.collectItemsReferencingRoster(items, this.props.formDesign.contents, item._id);
            return [
                R("tr", { key: item._id }, R("td", { colSpan: colspan, style: { fontWeight: "bold" } }, formUtils.localizeString(item.name, this.props.locale))),
                data != null
                    ? // For each entry in data
                        (() => {
                            const result = [];
                            for (var index = 0; index < data.length; index++) {
                                const entry = data[index];
                                contents = lodash_1.default.map(items, (childItem) => {
                                    dataId = `${item._id}.${index}.${childItem._id}`;
                                    return this.renderItem(childItem, visibilityStructure, dataId);
                                });
                                // Remove nulls
                                contents = lodash_1.default.compact(contents);
                                // Do not display if empty
                                if (contents.length === 0) {
                                    result.push(null);
                                }
                                else {
                                    result.push([
                                        // Display the index of the answer
                                        R("tr", null, R("td", { colSpan: colspan, style: { fontWeight: "bold" } }, `${index + 1}.`)),
                                        // And the answer for each question
                                        contents
                                    ]);
                                }
                            }
                            return result;
                        })()
                    : undefined
            ];
        }
        if (item._type === "MatrixQuestion") {
            const answer = this.props.data[dataId];
            if ((answer === null || answer === void 0 ? void 0 : answer.value) != null) {
                const rows = [];
                rows.push(R("tr", { key: item._id }, R("td", { colSpan: colspan, style: { fontWeight: "bold" } }, formUtils.localizeString(item.text, this.props.locale))));
                for (let rowItem of item.items) {
                    const itemValue = answer.value[rowItem.id];
                    if (itemValue) {
                        rows.push(R("tr", null, R("td", { colSpan: colspan, style: { fontStyle: "italic" } }, formUtils.localizeString(rowItem.label, this.props.locale))));
                        for (let column of item.columns) {
                            if (itemValue[column._id]) {
                                dataId = `${item._id}.${rowItem.id}.${column._id}`;
                                rows.push(this.renderItem(column, visibilityStructure, dataId));
                            }
                        }
                    }
                }
                return rows;
            }
            else {
                return null;
            }
        }
        if (formUtils.isQuestion(item)) {
            return this.renderQuestion(item, dataId);
        }
        if (formUtils.isExpression(item)) {
            return this.renderExpression(item, dataId);
        }
    }
    renderExpression(q, dataId) {
        return [
            R("tr", { key: dataId }, R("td", { key: "name", style: { width: "50%" } }, formUtils.localizeString(q.text, this.props.locale)), R("td", { key: "value" }, R("div", null, this.renderExpressionAnswer(q, dataId))), this.props.showPrevAnswers && this.props.prevData ? R("td", { key: "prevValue" }, null) : undefined)
        ];
    }
    renderExpressionAnswer(q, dataId) {
        let rosterId = null;
        let rosterEntryIndex = undefined;
        if (dataId != null) {
            const dataIds = dataId.split(".");
            rosterId = dataIds[0];
            rosterEntryIndex = dataIds[1];
        }
        return R(TextExprsComponent_1.default, {
            localizedStr: q._type === "TextColumn" ? q.cellText : { _base: "en", en: "{0}" },
            exprs: q._type === "TextColumn" ? q.cellTextExprs : [q.expr],
            schema: this.props.schema,
            format: q.format,
            responseRow: new ResponseRow_1.default({
                responseData: this.props.data,
                schema: this.props.schema,
                formDesign: this.props.formDesign,
                rosterId,
                rosterEntryIndex,
                getEntityById: this.props.formCtx.getEntityById,
                getEntityByCode: this.props.formCtx.getEntityByCode
            }),
            locale: this.props.locale
        });
    }
    render() {
        if (this.state.error) {
            return R("div", { className: "alert alert-danger" }, this.state.error.message);
        }
        if (!this.state.visibilityStructure) {
            return R("div", null, "Loading...");
        }
        return R("div", null, R("table", { className: "table table-bordered table-condensed", style: { marginBottom: 0 } }, R("thead", null, R("tr", null, R("th", null, "Question"), R("th", null, "Answer"), this.props.showPrevAnswers ? R("th", null, "Original Answer") : undefined)), R("tbody", null, lodash_1.default.map(this.props.formDesign.contents, (item) => {
            return this.renderItem(item, this.state.visibilityStructure, item._id);
        }))), this.props.formDesign.calculations &&
            this.props.formDesign.calculations.length > 0 &&
            this.state.responseRow &&
            !this.props.hideCalculations
            ? R("div", { key: "calculations" }, R("h4", null, this.props.T("Calculations")), R(CalculationsDisplayComponent_1.CalculationsDisplayComponent, {
                formDesign: this.props.formDesign,
                schema: this.props.schema,
                responseRow: this.state.responseRow,
                locale: this.props.locale
            }))
            : undefined);
    }
}
exports.default = ResponseAnswersComponent;
