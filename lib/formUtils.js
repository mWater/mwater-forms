"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomTablesReferenced = exports.getSiteEntityType = exports.extractEntityReferences = exports.findEntityQuestion = exports.hasLocalizations = exports.updateLocalizations = exports.extractLocalizedStrings = exports.duplicateItem = exports.isSectioned = exports.getAnswerType = exports.changeQuestionType = exports.prepareQuestion = exports.allItems = exports.findItem = exports.getRosterIds = exports.priorQuestions = exports.localizeString = exports.isExpression = exports.isQuestion = exports.createBase32TimeCode = exports.createMediumUid = exports.createShortUid = exports.createUid = void 0;
const lodash_1 = __importDefault(require("lodash"));
const localizations_json_1 = __importDefault(require("../localizations.json"));
const uuid_1 = __importDefault(require("uuid"));
/** Create ~ 128-bit uid without dashes */
function createUid() {
    return uuid_1.default().replace(/-/g, "");
}
exports.createUid = createUid;
/** Create short unique id, with ~42 bits randomness to keep unique amoung a few choices */
function createShortUid() {
    const chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    let id = "";
    for (let i = 1; i <= 7; i++) {
        id = id + chrs[lodash_1.default.random(0, chrs.length - 1)];
    }
    return id;
}
exports.createShortUid = createShortUid;
/** Create medium unique id, with ~58 bits randomness to keep unique amoung a 1,000,000 choices */
function createMediumUid() {
    const chrs = "abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";
    let id = "";
    for (let i = 1; i <= 10; i++) {
        id = id + chrs[lodash_1.default.random(0, chrs.length - 1)];
    }
    return id;
}
exports.createMediumUid = createMediumUid;
// Create a base32 time code to write on forms
function createBase32TimeCode(date) {
    // Characters to use (skip 1, I, 0, O)
    const chars = "23456789ABCDEFGHJLKMNPQRSTUVWXYZ";
    // Subtract date from July 1, 2013
    const base = new Date(2013, 6, 1, 0, 0, 0, 0);
    // Get seconds since
    let diff = Math.floor((date.getTime() - base.getTime()) / 1000);
    // Convert to array of base 32 characters
    let code = "";
    while (diff >= 1) {
        const num = diff % 32;
        diff = Math.floor(diff / 32);
        code = chars[num] + code;
    }
    return code;
}
exports.createBase32TimeCode = createBase32TimeCode;
/** Determine if item is a question */
function isQuestion(item) {
    return item._type != null && item._type.match(/Question$/) != null;
}
exports.isQuestion = isQuestion;
/** Determine if item is an expression */
function isExpression(item) {
    return item._type != null && ["TextColumn", "Calculation"].includes(item._type);
}
exports.isExpression = isExpression;
/** Localize a localized string */
function localizeString(str, locale) {
    // If null, return empty string
    if (str == null) {
        return "";
    }
    // Return for locale if present
    if (locale && str[locale]) {
        return str[locale];
    }
    // Return base if present
    if (str._base && str[str._base]) {
        return str[str._base] || "";
    }
    // Return english
    if (str.en) {
        return str.en;
    }
    return "";
}
exports.localizeString = localizeString;
// Gets all questions in form before reference item specified
// refItem can be null for all questions
// rosterId is the rosterId to use. null for only top-level
function priorQuestions(formDesign, refItem = null, rosterId = null) {
    const questions = [];
    // Append all child items
    function appendChildren(parentItem, currentRosterId) {
        for (let child of parentItem.contents) {
            // If ids match, abort
            if (refItem != null && child._id === refItem._id) {
                return true;
            }
            if (currentRosterId === rosterId && exports.isQuestion(child)) {
                questions.push(child);
            }
            if (child.contents) {
                if (["RosterGroup", "RosterMatrix"].includes(child._type)) {
                    if (appendChildren(child, child.rosterId || child._id)) {
                        return true;
                    }
                }
                else {
                    if (appendChildren(child, currentRosterId)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    appendChildren(formDesign, null);
    return questions;
}
exports.priorQuestions = priorQuestions;
function getRosterIds(formDesign) {
    const rosterIds = [];
    function recurse(item) {
        if (["RosterGroup", "RosterMatrix"].includes(item._type)) {
            rosterIds.push(item.rosterId || item._id);
        }
        if (item.contents) {
            return item.contents.map((subitem) => recurse(subitem));
        }
    }
    recurse(formDesign);
    return lodash_1.default.uniq(rosterIds);
}
exports.getRosterIds = getRosterIds;
// Finds an item by id in a form
function findItem(formDesign, itemId) {
    for (let item of formDesign.contents) {
        // If ids match
        if (item._id === itemId) {
            return item;
        }
        if (item.contents) {
            const found = exports.findItem(item, itemId);
            if (found) {
                return found;
            }
        }
    }
    return;
}
exports.findItem = findItem;
// All items under an item including self
function allItems(rootItem) {
    let items = [];
    items.push(rootItem);
    if (rootItem.contents) {
        for (let item of rootItem.contents) {
            items = items.concat(exports.allItems(item));
        }
    }
    return items;
}
exports.allItems = allItems;
// Fills question with default values and removes extraneous fields
function prepareQuestion(q) {
    lodash_1.default.defaults(q, {
        _id: exports.createUid(),
        text: {},
        conditions: [],
        validations: [],
        required: false
    });
    switch (q._type) {
        case "TextQuestion":
            lodash_1.default.defaults(q, { format: "singleline" });
            break;
        case "NumberQuestion":
        case "NumberColumnQuestion":
            lodash_1.default.defaults(q, { decimal: true });
            break;
        case "DropdownQuestion":
        case "RadioQuestion":
        case "MulticheckQuestion":
        case "DropdownColumnQuestion":
            lodash_1.default.defaults(q, { choices: [] });
            break;
        case "SiteColumnQuestion":
            lodash_1.default.defaults(q, { siteType: "water_point" });
            break;
        case "LikertQuestion":
            lodash_1.default.defaults(q, { items: [], choices: [] });
            break;
        case "DateQuestion": // , "DateTimeQuestion"??
            lodash_1.default.defaults(q, { format: "YYYY-MM-DD" });
            break;
        case "UnitsQuestion":
        case "UnitsColumnQuestion":
            lodash_1.default.defaults(q, { units: [], defaultUnits: null, unitsPosition: "suffix", decimal: true });
            break;
        case "LocationQuestion":
            lodash_1.default.defaults(q, { calculateAdminRegion: true });
            break;
        case "CheckQuestion":
            lodash_1.default.defaults(q, { label: {} });
            break;
        case "EntityQuestion":
            lodash_1.default.defaults(q, {
                entityFilter: {},
                displayProperties: [],
                selectionMode: "external",
                selectProperties: [],
                selectText: { _base: "en", en: "Select" },
                propertyLinks: []
            });
            break;
        case "LikertQuestion":
            lodash_1.default.defaults(q, { items: [], choices: [] });
            break;
        case "MatrixQuestion":
            lodash_1.default.defaults(q, { items: [], columns: [] });
            break;
        case "AquagenxCBTQuestion":
            lodash_1.default.defaults(q, {});
            break;
        case "CascadingListQuestion":
            lodash_1.default.defaults(q, { rows: [], columns: [] });
            break;
        case "CascadingRefQuestion":
            lodash_1.default.defaults(q, { dropdowns: [] });
            break;
        case "RankedQuestion":
            lodash_1.default.defaults(q, { choices: [] });
            break;
    }
    // Get known fields
    const knownFields = [
        "_id",
        "_type",
        "text",
        "textExprs",
        "conditions",
        "conditionExpr",
        "validations",
        "required",
        "code",
        "hint",
        "help",
        "alternates",
        "commentsField",
        "recordLocation",
        "recordTimestamp",
        "sticky",
        "exportId",
        "disabled"
    ];
    switch (q._type) {
        case "TextQuestion":
            knownFields.push("format");
            break;
        case "DateQuestion":
        case "DateColumnQuestion":
            knownFields.push("format");
            knownFields.push("defaultNow");
            break;
        case "NumberQuestion":
        case "NumberColumnQuestion":
            knownFields.push("decimal");
            break;
        case "RadioQuestion":
            knownFields.push("choices");
            knownFields.push("displayMode");
            break;
        case "DropdownQuestion":
        case "MulticheckQuestion":
        case "DropdownColumnQuestion":
            knownFields.push("choices");
            break;
        case "LikertQuestion":
            knownFields.push("items");
            knownFields.push("choices");
            break;
        case "UnitsQuestion":
        case "UnitsColumnQuestion":
            knownFields.push("decimal");
            knownFields.push("units");
            knownFields.push("defaultUnits");
            knownFields.push("unitsPosition");
            break;
        case "CheckQuestion":
            knownFields.push("label");
            break;
        case "SiteQuestion":
            knownFields.push("siteTypes");
            break;
        case "SiteColumnQuestion":
            knownFields.push("siteType");
            break;
        case "ImageQuestion":
        case "ImagesQuestion":
            knownFields.push("consentPrompt");
            break;
        case "EntityQuestion":
            knownFields.push("entityType");
            knownFields.push("entityFilter");
            knownFields.push("displayProperties");
            knownFields.push("selectionMode");
            knownFields.push("selectProperties");
            knownFields.push("mapProperty");
            knownFields.push("selectText");
            knownFields.push("propertyLinks");
            knownFields.push("hidden");
            knownFields.push("createEntity");
            break;
        case "AdminRegionQuestion":
            knownFields.push("defaultValue");
            break;
        case "MatrixQuestion":
            knownFields.push("items");
            knownFields.push("columns");
            break;
        case "LocationQuestion":
            knownFields.push("calculateAdminRegion");
            knownFields.push("disableSetByMap");
            knownFields.push("disableManualLatLng");
            break;
        case "CascadingListQuestion":
            knownFields.push("rows");
            knownFields.push("columns");
            break;
        case "CascadingRefQuestion":
            knownFields.push("tableId");
            knownFields.push("dropdowns");
            break;
    }
    // Strip unknown fields
    for (let key of lodash_1.default.keys(q)) {
        if (!lodash_1.default.contains(knownFields, key)) {
            delete q[key];
        }
    }
    return q;
}
exports.prepareQuestion = prepareQuestion;
function changeQuestionType(question, newType) {
    // Clear validations (they are type specific)
    question.validations = [];
    // Clear format (type specific)
    delete question.format;
    // Set type
    question._type = newType;
    // Prepare question to ensure correct fields
    exports.prepareQuestion(question);
    return question;
}
exports.changeQuestionType = changeQuestionType;
// Gets type of the answer: text, number, choice, choices, date, units, boolean, location, image, images, texts, site, entity, admin_region, items_choices, matrix, aquagenx_cbt, cascading_list, cascading_ref
function getAnswerType(q) {
    switch (q._type) {
        case "TextQuestion":
        case "TextColumnQuestion":
            return "text";
        case "NumberQuestion":
        case "NumberColumnQuestion":
        case "StopwatchQuestion":
            return "number";
        case "DropdownQuestion":
        case "RadioQuestion":
        case "DropdownColumnQuestion":
            return "choice";
        case "MulticheckQuestion":
            return "choices";
        case "DateQuestion":
        case "DateColumnQuestion":
            return "date";
        case "UnitsQuestion":
        case "UnitsColumnQuestion":
            return "units";
        case "CheckQuestion":
        case "CheckColumnQuestion":
            return "boolean";
        case "LocationQuestion":
            return "location";
        case "ImageQuestion":
            return "image";
        case "ImagesQuestion":
            return "images";
        case "TextListQuestion":
            return "texts";
        case "SiteQuestion":
        case "SiteColumnQuestion":
            return "site";
        case "BarcodeQuestion":
            return "text";
        case "EntityQuestion":
            return "entity";
        case "AdminRegionQuestion":
            return "admin_region";
        case "MatrixQuestion":
            return "matrix";
        case "LikertQuestion":
            return "items_choices";
        case "AquagenxCBTQuestion":
            return "aquagenx_cbt";
        case "CascadingListQuestion":
            return "cascading_list";
        case "CascadingRefQuestion":
            return "cascading_ref";
        case "TextColumn":
        case "Calculation":
            return "expr";
        case "RankedQuestion":
            return "ranked";
        default:
            throw new Error(`Unknown question type ${q._type}`);
    }
}
exports.getAnswerType = getAnswerType;
// Check if a form is all sections
function isSectioned(form) {
    return form.contents.length > 0 && lodash_1.default.every(form.contents, (item) => item._type === "Section");
}
exports.isSectioned = isSectioned;
// Duplicates an item (form design, section or question)
// idMap is a map of old _ids to new _ids. If any not present, new uid will be used
function duplicateItem(item, idMap) {
    // If form or section and ids not mapped, map ids
    let question;
    if (!idMap) {
        idMap = {};
    }
    if (["Form", "Section"].includes(item._type)) {
        for (question of exports.priorQuestions(item)) {
            // Map non-mapped ones
            if (!idMap[question._id]) {
                idMap[question._id] = exports.createUid();
            }
        }
    }
    else if (item._id) {
        idMap[item._id] = exports.createUid();
    }
    const dup = lodash_1.default.cloneDeep(item);
    delete dup.confidential;
    delete dup.confidentialRadius;
    // Set up id
    if (dup._id) {
        dup._basedOn = dup._id;
        if (idMap && idMap[dup._id]) {
            dup._id = idMap[dup._id];
        }
        else {
            dup._id = exports.createUid();
        }
    }
    // Fix condition references, or remove conditions
    if (dup.conditions) {
        dup.conditions = lodash_1.default.filter(dup.conditions, (cond) => {
            if (cond.lhs && cond.lhs.question) {
                // Check if in id
                if (idMap && idMap[cond.lhs.question]) {
                    // Map id
                    cond.lhs.question = idMap[cond.lhs.question];
                    return true;
                }
                // Could not be mapped
                return false;
            }
            // For future AND and OR TODO
            return true;
        });
    }
    // Duplicate contents
    if (dup.contents) {
        dup.contents = lodash_1.default.map(dup.contents, (item) => {
            return exports.duplicateItem(item, idMap);
        });
    }
    if (dup.calculations) {
        let calculations = lodash_1.default.map(dup.calculations, (item) => {
            return exports.duplicateItem(item, idMap);
        });
        calculations = JSON.stringify(calculations);
        // Replace each part of idMap
        for (let key in idMap) {
            const value = idMap[key];
            calculations = calculations.replace(new RegExp(lodash_1.default.escapeRegExp(key), "g"), value);
        }
        calculations = JSON.parse(calculations);
        dup.calculations = calculations;
    }
    return dup;
}
exports.duplicateItem = duplicateItem;
// Finds all localized strings in an object
function extractLocalizedStrings(obj) {
    if (obj == null) {
        return [];
    }
    // Return self if string
    if (obj._base != null) {
        return [obj];
    }
    let strs = [];
    // If array, concat each
    if (lodash_1.default.isArray(obj)) {
        for (let item of obj) {
            strs = strs.concat(this.extractLocalizedStrings(item));
        }
    }
    else if (lodash_1.default.isObject(obj)) {
        for (let key in obj) {
            const value = obj[key];
            strs = strs.concat(this.extractLocalizedStrings(value));
        }
    }
    return strs;
}
exports.extractLocalizedStrings = extractLocalizedStrings;
function updateLocalizations(formDesign) {
    let str;
    formDesign.localizedStrings = formDesign.localizedStrings || [];
    // Map existing ones in form
    const existing = {};
    for (str of formDesign.localizedStrings) {
        if (str.en) {
            existing[str.en] = true;
        }
    }
    // Add new localizations
    return (() => {
        const result = [];
        for (str of localizations_json_1.default.strings) {
            if (str.en && !existing[str.en] && !str._unused) {
                formDesign.localizedStrings.push(str);
                result.push((existing[str.en] = true));
            }
            else {
                result.push(undefined);
            }
        }
        return result;
    })();
}
exports.updateLocalizations = updateLocalizations;
// Determines if has at least one localization in locale
function hasLocalizations(obj, locale) {
    const strs = exports.extractLocalizedStrings(obj);
    return lodash_1.default.any(strs, (str) => str[locale]);
}
exports.hasLocalizations = hasLocalizations;
// Finds an entity question of the specified type, or a legacy site question
function findEntityQuestion(formDesign, entityType) {
    let question = lodash_1.default.find(exports.priorQuestions(formDesign), function (q) {
        if (q._type === "EntityQuestion" && q.entityType === entityType) {
            return true;
        }
        if (q._type === "SiteQuestion") {
            const questionEntityType = exports.getSiteEntityType(q);
            if (questionEntityType === entityType) {
                return true;
            }
        }
        return false;
    });
    if (question) {
        return question;
    }
    for (let rosterId of exports.getRosterIds(formDesign)) {
        question = lodash_1.default.find(exports.priorQuestions(formDesign, null, rosterId), function (q) {
            if (q._type === "EntityQuestion" && q.entityType === entityType) {
                return true;
            }
            if (q._type === "SiteColumnQuestion" && q.siteType === entityType) {
                return true;
            }
            if (q._type === "SiteQuestion") {
                const questionEntityType = exports.getSiteEntityType(q);
                if (questionEntityType === entityType) {
                    return true;
                }
            }
            return false;
        });
        if (question) {
            return question;
        }
    }
    return null;
}
exports.findEntityQuestion = findEntityQuestion;
// Finds all references to entities in a response. Returns array of:
// {
//   question: _id of question
//   roster: _id of roster entry, null if not in roster
//   entityType: e.g. "water_point"
//   property: property code (e.g "_id" or "code") of entity that is referenced in value
//   value: value of entity property that is referenced
// }
function extractEntityReferences(formDesign, responseData) {
    var _a, _b, _c, _d, _e, _f;
    let code, entityType, question, value;
    const results = [];
    // Handle non-roster
    for (question of exports.priorQuestions(formDesign)) {
        switch (exports.getAnswerType(question)) {
            case "site":
                code = (_b = (_a = responseData[question._id]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.code;
                entityType = exports.getSiteEntityType(question);
                if (code) {
                    results.push({ question: question._id, entityType, property: "code", value: code });
                }
                break;
            case "entity":
                value = (_c = responseData[question._id]) === null || _c === void 0 ? void 0 : _c.value;
                if (value) {
                    results.push({ question: question._id, entityType: question.entityType, property: "_id", value });
                }
                break;
        }
    }
    for (let rosterId of exports.getRosterIds(formDesign)) {
        for (question of exports.priorQuestions(formDesign, null, rosterId)) {
            var rosterEntry;
            switch (exports.getAnswerType(question)) {
                case "site":
                    for (rosterEntry of responseData[rosterId] || []) {
                        code = (_e = (_d = rosterEntry.data[question._id]) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.code;
                        entityType = exports.getSiteEntityType(question);
                        if (code) {
                            results.push({
                                question: question._id,
                                roster: rosterEntry._id,
                                entityType,
                                property: "code",
                                value: code
                            });
                        }
                    }
                    break;
                case "entity":
                    for (rosterEntry of responseData[rosterId] || []) {
                        value = (_f = rosterEntry.data[question._id]) === null || _f === void 0 ? void 0 : _f.value;
                        if (value) {
                            results.push({
                                question: question._id,
                                roster: rosterEntry._id,
                                entityType: question.entityType,
                                property: "_id",
                                value
                            });
                        }
                    }
                    break;
            }
        }
    }
    return results;
}
exports.extractEntityReferences = extractEntityReferences;
// Gets the entity type (e.g. "water_point") for a site question
function getSiteEntityType(question) {
    const entityType = question.siteTypes && question.siteTypes[0]
        ? lodash_1.default.first(question.siteTypes).toLowerCase().replace(new RegExp(" ", "g"), "_")
        : "water_point";
    return entityType;
}
exports.getSiteEntityType = getSiteEntityType;
/** Get list of custom table ids referenced by a form (cascading ref questions) */
function getCustomTablesReferenced(formDesign) {
    const items = exports.allItems(formDesign);
    const crqs = lodash_1.default.filter(items, (item) => item._type === "CascadingRefQuestion");
    const tableIds = lodash_1.default.uniq(lodash_1.default.pluck(crqs, "tableId"));
    return tableIds;
}
exports.getCustomTablesReferenced = getCustomTablesReferenced;
