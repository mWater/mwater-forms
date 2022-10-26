"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const R = react_1.default.createElement;
require("./index");
const FormComponent_1 = __importDefault(require("./FormComponent"));
const sampleForm2_1 = __importDefault(require("./sampleForm2"));
const ResponseViewEditComponent_1 = __importDefault(require("./ResponseViewEditComponent"));
const mwater_expressions_1 = require("mwater-expressions");
const FormSchemaBuilder_1 = __importDefault(require("./FormSchemaBuilder"));
const react_dnd_html5_backend_1 = __importDefault(require("react-dnd-html5-backend"));
const react_dnd_1 = require("react-dnd");
const LocationEditorComponent_1 = __importDefault(require("./LocationEditorComponent"));
const LocationFinder_1 = __importDefault(require("./LocationFinder"));
const CustomTablesetSchemaBuilder_1 = require("./CustomTablesetSchemaBuilder");
const lodash_1 = __importDefault(require("lodash"));
// Setup mock localizer
window["T"] = function (str) {
    if (arguments.length > 1) {
        const iterable = Array.from(arguments).slice(1);
        for (let index = 0; index < iterable.length; index++) {
            const subValue = iterable[index];
            const tag = `{${index}}`;
            str = str.replace(tag, subValue);
        }
    }
    return str;
};
const canada = { id: "canada", level: 0, name: "Canada", type: "Country" };
const manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" };
const ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" };
const testStickyStorage = {
    d0dcfce3a697453ba16cc8baa8e384e7: "Testing sticky value"
};
const formCtx = {
    locale: "en",
    renderEntitySummaryView(entityType, entity) {
        return JSON.stringify(entity);
    },
    renderEntityListItemView(entityType, entity) {
        return JSON.stringify(entity);
    },
    imageManager: {
        getImageUrl(id, success, error) {
            return error("Not implemented");
        },
        getThumbnailImageUrl(id, success, error) {
            return error("Not implemented");
        }
    },
    stickyStorage: {
        get(questionId) {
            return testStickyStorage[questionId];
        },
        set(questionId, value) {
            return (testStickyStorage[questionId] = value);
        }
    },
    selectEntity: (options) => {
        return options.callback("1234");
    },
    getEntityById: (entityType, entityId, callback) => {
        if (entityId === "1234") {
            return callback({ _id: "1234", code: "10007", name: "Test" });
        }
        else {
            return callback(null);
        }
    },
    getEntityByCode: (entityType, entityCode, callback) => {
        if (entityCode === "10007") {
            return callback({ _id: "1234", code: "10007", name: "Test" });
        }
        else {
            return callback(null);
        }
    },
    getCustomTableRows: (tableId) => {
        if (tableId === "custom.ts.cities") {
            return new Promise((resolve, reject) => {
                return setTimeout(() => resolve(cascadingRefRows), 2000);
            });
        }
        return null;
    },
    getCustomTableRow: (tableId, rowId) => {
        if (tableId === "custom.ts.cities") {
            return Promise.resolve(lodash_1.default.findWhere(cascadingRefRows, { _id: rowId }));
        }
        throw new Error("Not implemented");
    },
    displayMap: (location, onSet) => {
        return alert("Map");
    },
    /** Select an asset with optional filter
     * @param assetSystemId id of the asset system
     * @param assetId currently selected asset
     * @param filter MongoDB-style filter on assets
     * @param callback called with _id of asset selected or null. Never called if cancelled
     */
    selectAsset: (assetSystemId, assetId, filter, callback) => {
        callback("12345");
    },
    /** Renders an asset as a React element for summary (small box) */
    renderAssetSummaryView: (assetSystemId, assetId) => {
        return react_1.default.createElement("div", null, `${assetSystemId}:${assetId}`);
    }
};
const groupDesign = {
    _id: "761114a3940e4063951387155e112486",
    _rev: 13,
    deployments: [
        {
            _id: "2c5943376fa148eca8640f43878e98b8",
            name: "Depl1",
            active: true,
            admins: [],
            public: false,
            viewers: [],
            enumerators: ["user:14de12d6532c4aca8c959856055966f8"],
            approvalStages: []
        }
    ],
    state: "active",
    design: {
        name: { en: "Question Group", _base: "en" },
        _type: "Form",
        _schema: 21,
        locales: [{ code: "en", name: "English" }],
        contents: [
            {
                _id: "837e7861ee754b65989278ece222c443",
                name: { en: "Untitled Section", _base: "en" },
                _type: "Section",
                contents: [
                    {
                        _id: "65fb7d592b3c465ca4b1359a982818c0",
                        name: { en: "ddfg", _base: "en" },
                        _type: "RosterGroup",
                        allowAdd: true,
                        contents: [
                            {
                                _id: "368e4c91c15a4853b62d3d9f9d1fde13",
                                name: { en: "Personal", _base: "en" },
                                _type: "Group",
                                contents: [
                                    {
                                        _id: "4204f6bbb41747908bcb31bd514bff44",
                                        text: { en: "Name?", _base: "en" },
                                        _type: "TextQuestion",
                                        format: "singleline",
                                        required: false,
                                        textExprs: [],
                                        conditions: [],
                                        validations: []
                                    },
                                    {
                                        _id: "f639c8309f1440f1b5f65bd71d777343",
                                        text: { en: "Age?", _base: "en" },
                                        _type: "NumberQuestion",
                                        decimal: false,
                                        required: false,
                                        textExprs: [],
                                        conditions: [],
                                        validations: []
                                    }
                                ],
                                conditions: []
                            }
                        ],
                        conditions: [],
                        entryTitle: { en: "", _base: "en" },
                        allowRemove: true,
                        entryTitleExprs: []
                    }
                ],
                conditions: []
            }
        ]
    },
    roles: [
        { id: "user:broncha", role: "admin" },
        { id: "user:mike", role: "admin" },
        { id: "user:14de12d6532c4aca8c959856055966f8", role: "view" }
    ],
    created: { on: "2019-09-16T10:28:20.195Z", by: "broncha" },
    modified: { on: "2019-09-16T10:31:05.027Z", by: "broncha" },
    _viewable: true,
    _editable: true,
    _deployable: true,
    _deployed_to_me: false
};
const response = {
    _id: "b35def73cc67423283fde8aaddd8d7a1",
    _rev: 3,
    code: "bronchatest-7UXVSC",
    form: "761114a3940e4063951387155e112486",
    formRev: 13,
    deployment: "2c5943376fa148eca8640f43878e98b8",
    approvals: [],
    user: "14de12d6532c4aca8c959856055966f8",
    status: "final",
    data: {
        "65fb7d592b3c465ca4b1359a982818c0": [
            {
                _id: "65ab66de59ca4037997083e4a16d0a78",
                data: {
                    "4204f6bbb41747908bcb31bd514bff44": { value: "Bbdhd", alternate: null },
                    f639c8309f1440f1b5f65bd71d777343: { value: 39, alternate: null }
                }
            },
            {
                _id: "5dc76fee9bcf40aea71df5826c4aecfa",
                data: {
                    "4204f6bbb41747908bcb31bd514bff44": { value: "Dyshsjs", alternate: null },
                    f639c8309f1440f1b5f65bd71d777343: { value: 85, alternate: null }
                }
            },
            {
                _id: "71fb47426c4c4c9895d9caac8a940520",
                data: {
                    "4204f6bbb41747908bcb31bd514bff44": { value: "Gafqgkd", alternate: null },
                    f639c8309f1440f1b5f65bd71d777343: { value: 52, alternate: null }
                }
            }
        ]
    },
    startedOn: "2019-09-16T10:32:14.484Z",
    submittedOn: "2019-09-16T10:32:33.768Z",
    entities: [],
    events: [
        { by: "14de12d6532c4aca8c959856055966f8", on: "2019-09-16T10:32:14.486Z", type: "draft" },
        { by: "14de12d6532c4aca8c959856055966f8", on: "2019-09-16T10:32:33.768Z", type: "submit" }
    ],
    roles: [
        { id: "user:broncha", role: "admin" },
        { id: "user:mike", role: "admin" },
        { id: "user:14de12d6532c4aca8c959856055966f8", role: "view" }
    ],
    created: { on: "2019-09-16T10:32:18.721Z", by: "14de12d6532c4aca8c959856055966f8" },
    modified: { on: "2019-09-16T10:32:52.914Z", by: "14de12d6532c4aca8c959856055966f8" },
    username: "bronchatest",
    ipAddress: "27.34.109.198"
};
const exprFormDesign = {
    _id: "7072b6924b6e491b903770cac4a82ae9",
    _rev: 14,
    deployments: [
        {
            _id: "746a449d2bbd40f8b96055db4201610f",
            name: "depl1",
            active: true,
            admins: [],
            public: false,
            viewers: [],
            enumerators: ["user:14de12d6532c4aca8c959856055966f8"],
            approvalStages: []
        }
    ],
    state: "active",
    design: {
        name: { en: "Roster Matrix Survey", _base: "en" },
        _type: "Form",
        _schema: 21,
        locales: [
            { code: "en", name: "English" },
            { code: "ne", name: "नेपाली" }
        ],
        contents: [
            {
                _id: "c3064394529a40c9832e87b950147615",
                name: { en: "Untitled Section", ne: "title navako section", _base: "en" },
                _type: "Section",
                contents: [
                    {
                        _id: "aa331b86fb5d40ffbf6600e8357e2b0a",
                        name: { en: "test", ne: "kjhkjhkj", _base: "en" },
                        _type: "RosterMatrix",
                        allowAdd: true,
                        contents: [
                            {
                                _id: "9b567415c7d84fc3a2803a9c8b45a087",
                                text: { en: "Name", ne: "Naam k ho?", _base: "en" },
                                _type: "TextColumnQuestion",
                                required: false,
                                validations: []
                            },
                            {
                                _id: "0e38e0e24e9948d9a8fc133d4e3da4ff",
                                text: { en: "Age", _base: "en" },
                                _type: "NumberColumnQuestion",
                                decimal: true,
                                required: false,
                                validations: []
                            },
                            {
                                _id: "20bef3d0d36d4cf8876f7fb6b2bab339",
                                text: { en: "result", _base: "en" },
                                _type: "Calculation",
                                required: false,
                                validations: [],
                                format: "$.2f",
                                expr: {
                                    type: "field",
                                    table: "responses:7072b6924b6e491b903770cac4a82ae9:roster:aa331b86fb5d40ffbf6600e8357e2b0a",
                                    column: "data:0e38e0e24e9948d9a8fc133d4e3da4ff:value"
                                }
                            }
                        ],
                        conditions: [],
                        allowRemove: true
                    },
                    {
                        _id: "35926207ee444e1e8051967b5b46f3bd",
                        name: { en: "sghfh", _base: "en" },
                        _type: "RosterGroup",
                        allowAdd: true,
                        contents: [
                            {
                                _id: "c905bfc528dd4dd1b9e5cdb199ff62b2",
                                text: { en: "asdasdasd", _base: "en" },
                                _type: "TextQuestion",
                                format: "singleline",
                                required: false,
                                textExprs: [],
                                conditions: [],
                                validations: []
                            },
                            {
                                _id: "8cd524b0f8d749f79dd0667f54a65ef3",
                                text: { en: "Ages sdf", _base: "en" },
                                _type: "NumberQuestion",
                                textExprs: [],
                                conditions: [],
                                validations: []
                            }
                        ],
                        conditions: [],
                        allowRemove: true
                    }
                ],
                conditions: []
            }
        ],
        localizedStrings: [
            { en: "Add", _base: "en" },
            { en: "Admin Override", _base: "en" },
            { en: "Answered", _base: "en" },
            { en: "Approved", _base: "en" },
            { en: "Back", _base: "en" },
            { en: "Barcode scanning not supported on this platform", _base: "en" },
            { en: "Cancel", _base: "en" },
            { en: "Cancel GPS", _base: "en" },
            { en: "Change Selection", _base: "en" },
            { en: "Clear", _base: "en" },
            { en: "Clear Selection", _base: "en" },
            { en: "Click +Add to add an item", _base: "en" },
            { en: "Click on the compartments to change color", _base: "en" },
            { en: "Close", _base: "en" },
            { en: "Comments", _base: "en" },
            { en: "Confidential answers may not be edited.", _base: "en" },
            { en: "Data is stored in {0}", _base: "en" },
            { en: "Discard", _base: "en" },
            { en: "Don't Know", _base: "en" },
            { en: "Draft", _base: "en" },
            { en: "Drafted", _base: "en" },
            { en: "E", _base: "en" },
            { en: "Edit", _base: "en" },
            { en: "Edit Selection", _base: "en" },
            { en: "Edited", _base: "en" },
            { en: "Either site has been deleted or you do not have permission to view it", _base: "en" },
            { en: "Error", _base: "en" },
            { en: "Error saving data", _base: "en" },
            {
                en: "Error uploading file. You must be connected to the Internet for image upload to work from a web browser.",
                _base: "en"
            },
            { en: "False", _base: "en" },
            { en: "Final", _base: "en" },
            { en: "Good GPS Signal ±{0}m", _base: "en" },
            { en: "Health Risk Category Based on MPN and Confidence Interval", _base: "en" },
            { en: "Hide History", _base: "en" },
            { en: "High Risk/Possibly Unsafe", _base: "en" },
            { en: "High Risk/Probably Unsafe", _base: "en" },
            { en: "IP Address", _base: "en" },
            { en: "Image must be a jpeg file", _base: "en" },
            { en: "Intermediate Risk/Possibly Safe", _base: "en" },
            { en: "Intermediate Risk/Probably Safe", _base: "en" },
            { en: "Loading History...", _base: "en" },
            { en: "Loading...", _base: "en" },
            { en: "Low GPS Signal ±{0}m", _base: "en" },
            { en: "Low Risk/Safe", _base: "en" },
            { en: "MPN/100ml", _base: "en" },
            { en: "N", _base: "en" },
            { en: "NE", _base: "en" },
            { en: "NW", _base: "en" },
            { en: "Next", _base: "en" },
            { en: "No images present", _base: "en" },
            { en: "None", _base: "en" },
            { en: "Not Applicable", _base: "en" },
            { en: "Not found", _base: "en" },
            { en: "Not supported on this platform", _base: "en" },
            { en: "Pending", _base: "en" },
            { en: "Record", _base: "en" },
            { en: "Redacted", _base: "en" },
            { en: "Rejected", _base: "en" },
            { en: "Remove", _base: "en" },
            { en: "Reset", _base: "en" },
            { en: "Response Id", _base: "en" },
            { en: "Rotate", _base: "en" },
            { en: "S", _base: "en" },
            { en: "SE", _base: "en" },
            { en: "SW", _base: "en" },
            { en: "Save", _base: "en" },
            { en: "Save for Later", _base: "en" },
            { en: "Scan", _base: "en" },
            { en: "Select", _base: "en" },
            { en: "Select...", _base: "en" },
            { en: "Set Using GPS", _base: "en" },
            { en: "Set Using Map", _base: "en" },
            { en: "Set as Cover Image", _base: "en" },
            { en: "Show Changes", _base: "en" },
            { en: "Show Complete History of Changes", _base: "en" },
            { en: "Show History", _base: "en" },
            { en: "Start", _base: "en" },
            { en: "Status", _base: "en" },
            { en: "Stop", _base: "en" },
            { en: "Submit", _base: "en" },
            { en: "Submitted", _base: "en" },
            { en: "True", _base: "en" },
            { en: "Unable to connect to server", _base: "en" },
            { en: "Unable to get location", _base: "en" },
            { en: "Unable to lookup location", _base: "en" },
            {
                en: "Unable to select that site as it does not have an mWater ID. Please synchronize first with the server.",
                _base: "en"
            },
            { en: "Unsafe", _base: "en" },
            { en: "Upload Image", _base: "en" },
            { en: "Upload cancelled", _base: "en" },
            { en: "Upload failed: {0}", _base: "en" },
            { en: "Uploading Image...", _base: "en" },
            { en: "Upper 95% Confidence Interval/100ml", _base: "en" },
            { en: "User", _base: "en" },
            { en: "Very Low GPS Signal ±{0}m", _base: "en" },
            { en: "W", _base: "en" },
            { en: "Waiting for GPS...", _base: "en" },
            { en: "by", _base: "en" },
            { en: "km", _base: "en" },
            { en: "m", _base: "en" },
            { en: "mWater ID of Site", _base: "en" },
            { en: "on", _base: "en" }
        ]
    },
    roles: [
        { id: "user:14de12d6532c4aca8c959856055966f8", role: "view" },
        { id: "user:broncha", role: "admin" },
        { id: "user:mike", role: "admin" }
    ],
    created: { on: "2019-09-18T11:15:32.215Z", by: "broncha" },
    modified: { on: "2019-09-29T09:51:17.619Z", by: "broncha" },
    _viewable: true,
    _editable: true,
    _deployable: true,
    _deployed_to_me: false
};
const exprResponse = {
    _id: "4fb961b47ae94472bb95123c1ad96123",
    _rev: 3,
    code: "bronchatest-7W24AB",
    form: "7072b6924b6e491b903770cac4a82ae9",
    formRev: 14,
    deployment: "746a449d2bbd40f8b96055db4201610f",
    approvals: [],
    user: "14de12d6532c4aca8c959856055966f8",
    status: "final",
    data: {
        "35926207ee444e1e8051967b5b46f3bd": [
            {
                _id: "86d025292d56498c8306bb38854e1830",
                data: {
                    "8cd524b0f8d749f79dd0667f54a65ef3": { value: 358, alternate: null },
                    c905bfc528dd4dd1b9e5cdb199ff62b2: { value: "Jff", alternate: null }
                }
            }
        ],
        aa331b86fb5d40ffbf6600e8357e2b0a: [
            {
                _id: "edf250e8a49e4bfc82abe8ca727f2b91",
                data: {
                    "0e38e0e24e9948d9a8fc133d4e3da4ff": { value: 30 },
                    "9b567415c7d84fc3a2803a9c8b45a087": { value: "Gfh" }
                }
            },
            {
                _id: "4319369f35e44d989aefd62ef2437095",
                data: {
                    "0e38e0e24e9948d9a8fc133d4e3da4ff": { value: 60 },
                    "9b567415c7d84fc3a2803a9c8b45a087": { value: "Kgc" }
                }
            }
        ]
    },
    startedOn: "2019-09-29T09:51:41.596Z",
    submittedOn: "2019-09-29T09:52:08.425Z",
    entities: [],
    events: [
        { by: "14de12d6532c4aca8c959856055966f8", on: "2019-09-29T09:51:41.598Z", type: "draft" },
        { by: "14de12d6532c4aca8c959856055966f8", on: "2019-09-29T09:52:08.426Z", type: "submit" }
    ],
    roles: [
        { id: "user:broncha", role: "admin" },
        { id: "user:mike", role: "admin" },
        { id: "user:14de12d6532c4aca8c959856055966f8", role: "view" }
    ],
    created: { on: "2019-09-29T09:51:46.790Z", by: "14de12d6532c4aca8c959856055966f8" },
    modified: { on: "2019-09-29T09:52:18.691Z", by: "14de12d6532c4aca8c959856055966f8" },
    username: "bronchatest",
    ipAddress: "27.34.111.61"
};
class DemoLocationEditorComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleLocationChange = (location) => {
            console.log(location);
            return this.setState({ location });
        };
        this.state = { location: null };
    }
    render() {
        return R(LocationEditorComponent_1.default, {
            locationFinder: new LocationFinder_1.default(),
            location: this.state.location,
            onLocationChange: (location) => this.setState({ location }),
            onUseMap: () => this.setState({
                location: { latitude: 46, longitude: -73, altitude: 240, accuracy: 12, altitudeAccuracy: 30, depth: 3 }
            }),
            T: window["T"]
        });
    }
}
const cascadingListFormDesign = {
    _id: "7072b6924b6e491b903770cac4a82ae9",
    design: {
        name: { en: "Cascading List Form", _base: "en" },
        _type: "Form",
        _schema: 21,
        locales: [{ code: "en", name: "English" }],
        contents: [
            {
                _type: "CascadingListQuestion",
                _id: "aa331b86fb5d40ffbf6600e8357e2b0a",
                text: { en: "Cascade", _base: "en" },
                rows: [
                    { id: "wpg", c0: "manitoba", c1: "winnipeg" },
                    { id: "wloo", c0: "ontario", c1: "waterloo" },
                    { id: "tor", c0: "ontario", c1: "toronto" }
                ],
                columns: [
                    {
                        id: "c0",
                        name: { en: "Province" },
                        type: "enum",
                        enumValues: [
                            { id: "manitoba", name: { en: "Manitoba" } },
                            { id: "ontario", name: { en: "Ontario" } }
                        ]
                    },
                    {
                        id: "c1",
                        name: { en: "City" },
                        type: "enum",
                        enumValues: [
                            { id: "winnipeg", name: { en: "Winnipeg" } },
                            { id: "toronto", name: { en: "Toronto" } },
                            { id: "waterloo", name: { en: "Waterloo" } }
                        ]
                    }
                ]
            }
        ]
    }
};
const cascadingRefFormDesign = {
    _id: "7072b6924b6e491b903770cac4a82aec",
    design: {
        name: { en: "Cascading Ref Form", _base: "en" },
        _type: "Form",
        _schema: 21,
        locales: [{ code: "en", name: "English" }],
        contents: [
            {
                _type: "CascadingRefQuestion",
                _id: "aa331b86fb5d40ffbf6600e8357e2b0a",
                text: { en: "Cascade", _base: "en" },
                tableId: "custom.ts.cities",
                dropdowns: [
                    {
                        columnId: "c0",
                        name: { en: "Province" }
                    },
                    {
                        columnId: "c1",
                        name: { en: "City" }
                    }
                ]
            }
        ]
    }
};
var cascadingRefRows = [
    { id: "wpg", c0: "manitoba", c1: "winnipeg" },
    { id: "wloo", c0: "ontario", c1: "waterloo" },
    { id: "tor", c0: "ontario", c1: "toronto" },
    { id: "kat", c0: "bagmati", c1: "kathmandu" },
];
const cascadingRefCustomTableset = {
    _id: "1234",
    code: "ts",
    design: {
        name: { en: "Custom table", _base: "en" },
        tables: [
            {
                id: "cities",
                name: { _base: "en", en: "Cities" },
                properties: [
                    {
                        id: "c0",
                        name: { en: "Province", _base: 'en' },
                        type: "enum",
                        enumValues: [
                            { id: "manitoba", name: { en: "Manitoba", _base: 'en' } },
                            { id: "ontario", name: { en: "Ontario", _base: 'en' } },
                            { id: "bagmati", name: { en: "Bagmati", _base: 'en' } },
                        ]
                    },
                    {
                        id: "c1",
                        name: { en: "City", _base: 'en' },
                        type: "enum",
                        enumValues: [
                            { id: "winnipeg", name: { en: "Winnipeg", _base: 'en' } },
                            { id: "toronto", name: { en: "Toronto", _base: 'en' } },
                            { id: "waterloo", name: { en: "Waterloo", _base: 'en' } },
                            { id: "kathmandu", name: { en: "Kathmandu", _base: 'en' } }
                        ]
                    }
                ]
            }
        ]
    }
};
const rankedDesign = {
    _id: 'asdasdasd',
    design: {
        _type: "Form",
        _schema: 11,
        locales: [{ code: "en", name: "English" }],
        name: {
            _base: "en",
            en: "Sample Form"
        },
        contents: [
            {
                _id: "02",
                _type: "Section",
                name: {
                    _base: "en",
                    en: "Introduction and informed consent"
                },
                contents: [
                    {
                        _type: "RankedQuestion",
                        _id: "dd7ffa2f8cf9423fbf814d710a3e55a4",
                        text: {
                            _base: "en",
                            en: "Rank the following in order of importance?"
                        },
                        conditions: [],
                        validations: [],
                        required: false,
                        choices: [
                            {
                                label: {
                                    _base: "en",
                                    en: "Ranked Option 1"
                                },
                                id: "ChFvwt8"
                            },
                            {
                                label: {
                                    _base: "en",
                                    en: "Ranked Option 2"
                                },
                                id: "AK51bEJ"
                            },
                            {
                                label: {
                                    _base: "en",
                                    en: "Ranked Option 3"
                                },
                                id: "AK51bEH"
                            },
                            {
                                label: {
                                    _base: "en",
                                    en: "Ranked Option 4"
                                },
                                id: "AK51bEPP"
                            },
                            {
                                label: {
                                    _base: "en",
                                    en: "Ranked Option 5"
                                },
                                id: "AK51bEOP"
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
class DemoComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleDataChange = (data) => {
            console.log(data);
            return this.setState({ data });
        };
        // data = { site01: { value: { code: "10007"}, confidential: true}}
        // data = { d0dcfce3a697453ba16cc8baa8e384e: { value: null, confidential: true}}
        const data = {
            dd7ffa2f8cf9423fbf814d710a3e55a4: {
                value: {
                    AK51bEJ: 3,
                    AK51bEH: 1,
                    ChFvwt8: 2
                }
            },
            f12aada1e2fd4ad8af06b3be00f23a93: {
                value: "2022-06-09"
            }
        }; //exprResponse
        this.state = { data };
    }
    render() {
        // R ItemListComponent,
        //   contents: sampleFormDesign.contents[0].contents
        //   data: @state.data
        //   onDataChange: (data) => @setState(data: data)
        let schema = new mwater_expressions_1.Schema();
        // design = rosterFormDesign
        // design = matrixFormDesign
        // design = rosterFormDesign
        // design = exprFormDesign
        // const design = cascadingRefFormDesign  as unknown as Form
        // design = sampleFormAdvancedValidations
        // design = require('./sampleFormRM')
        // design = randomAskFormDesign
        // const design = rankedDesign as unknown as Form
        const design = sampleForm2_1.default;
        schema = new FormSchemaBuilder_1.default().addForm(schema, design);
        schema = new CustomTablesetSchemaBuilder_1.CustomTablesetSchemaBuilder().addTableset(schema, cascadingRefCustomTableset);
        return R("div", { className: "row" }, R("div", { className: "col-md-6" }, R(FormComponent_1.default, {
            formCtx,
            // locale: PropTypes.string            # Locale. Defaults to English (en)
            design: design.design,
            data: this.state.data,
            schema,
            onDataChange: this.handleDataChange,
            onSubmit: () => alert("Submit"),
            onSaveLater: () => alert("SaveLater"),
            onDiscard: () => alert("Discard"),
            deployment: "dep"
            // submitLabel: PropTypes.string           # Label for submit button
            // discardLabel: PropTypes.string           # Label for discard button
            // entity: PropTypes.object            # Form-level entity to load
            // entityType: PropTypes.string        # Type of form-level entity to load      
            //   onChange: onChange
            //   value: value
            // })
        })), 
        // console.log design
        R("div", { className: "col-md-6" }, R(ResponseViewEditComponent_1.default, {
            apiUrl: "https://portal.mwater.co/",
            form: design,
            schema,
            response: { data: this.state.data, _id: "abc" },
            formCtx,
            T: window["T"],
            login: {
                client: "2a8c5e2e959a53a9609dc5330aa4c4a9",
                user: "broncha",
                username: "broncha"
            },
            onUpdateResponse: console.log,
            onDeleteResponse: console.log
        })));
    }
}
const DemoComponentWrapped = (0, react_dnd_1.DragDropContext)(react_dnd_html5_backend_1.default)(DemoComponent);
// class ImageUploaderTestComponent extends React.Component
//   render: ->
//     R ImageUploaderModalComponent,
//       T: window.T
//       apiUrl: "http://localhost:1234/v3/"
//       onSuccess: (id) => console.log(id)
//       onCancel: => console.log "Cancel"
react_dom_1.default.render(R(DemoComponentWrapped), document.getElementById("main"));
// ReactDOM.render(R(DemoLocationEditorComponent), document.getElementById("main"))
// ImageUploaderModalComponent.show("http://localhost:1234/v3/", null, window.T, (id) -> alert(id))
// ReactDOM.render(R(ImageUploaderTestComponent), document.getElementById("main"))
const rosterFormDesign = {
    _type: "Form",
    _id: "form123",
    _schema: 11,
    name: {
        _base: "en",
        en: "Sample Form"
    },
    localizedStrings: [],
    contents: [
        {
            _id: "site01",
            _type: "SiteQuestion",
            text: {
                _base: "en",
                en: "Site?"
            },
            siteTypes: ["water_point"]
        },
        {
            _id: "text01",
            _type: "TextQuestion",
            text: {
                _base: "en",
                en: "Text {0}"
            },
            textExprs: [
                {
                    type: "scalar",
                    table: "responses:form123",
                    joins: ["data:site01:value"],
                    expr: { type: "field", table: "entities.water_point", column: "code" }
                }
            ],
            siteTypes: ["water_point"],
            conditionExpr: {
                type: "op",
                table: "responses:form123",
                op: "is not null",
                exprs: [
                    {
                        type: "scalar",
                        table: "responses:form123",
                        joins: ["data:site01:value"],
                        expr: { type: "field", table: "entities.water_point", column: "code" }
                    }
                ]
            }
        },
        {
            _id: "matrix01",
            _type: "RosterMatrix",
            name: {
                _base: "en",
                en: "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
                { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true },
                { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false },
                { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
                {
                    _id: "d",
                    _type: "DropdownColumnQuestion",
                    text: { en: "Gender" },
                    choices: [
                        { label: { en: "Male" }, id: "male" },
                        { label: { en: "Female" }, id: "female" }
                    ]
                },
                { _id: "e", _type: "DateColumnQuestion", text: { en: "Date" }, format: "YYYY-MM-DD", required: false }
            ]
        },
        {
            _id: "matrix02",
            _type: "RosterMatrix",
            name: {
                _base: "en",
                en: "Roster Matrix 2"
            },
            rosterId: "matrix01",
            contents: [
                {
                    _id: "a2",
                    _type: "TextColumn",
                    text: { en: "Text Column" },
                    cellText: { en: "Cell Text {0}" },
                    cellTextExprs: [{ type: "field", table: "responses:form123:roster:matrix01", column: "data:a:value" }]
                },
                {
                    _id: "b2",
                    _type: "UnitsColumnQuestion",
                    text: { en: "Units" },
                    decimal: true,
                    defaultUnits: "wtdAQZ3",
                    units: [
                        {
                            id: "gVQSSfG",
                            label: {
                                en: "cm",
                                _base: "en"
                            }
                        },
                        {
                            id: "wtdAQZ3",
                            label: {
                                en: "inch",
                                _base: "en"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
const matrixFormDesign = {
    _type: "Form",
    _id: "form123",
    _schema: 11,
    name: {
        _base: "en",
        en: "Sample Form"
    },
    contents: [
        {
            _id: "matrix01",
            _type: "MatrixQuestion",
            name: {
                _base: "en",
                en: "Matrix"
            },
            items: [
                { id: "item1", label: { en: "First", _base: "en" } },
                { id: "item2", label: { en: "Second", _base: "en" } },
                { id: "item3", label: { en: "Third", _base: "en" }, hint: { en: "Some hint" } }
            ],
            columns: [
                {
                    _id: "a",
                    _type: "TextColumnQuestion",
                    text: { en: "Name" },
                    required: true,
                    validations: [
                        {
                            op: "lengthRange",
                            rhs: {
                                literal: {
                                    max: 10
                                }
                            },
                            message: {
                                en: "String is too long",
                                _base: "en"
                            }
                        }
                    ]
                },
                { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false },
                { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } },
                {
                    _id: "d",
                    _type: "DropdownColumnQuestion",
                    text: { en: "Gender" },
                    choices: [
                        { label: { en: "Male" }, id: "male" },
                        { label: { en: "Female" }, id: "female" }
                    ]
                },
                {
                    _id: "e",
                    _type: "UnitsColumnQuestion",
                    text: { en: "Unit" },
                    decimal: true,
                    units: [
                        { label: { en: "CM" }, id: "cm" },
                        { label: { en: "INCH" }, id: "inch" }
                    ]
                }
            ],
            alternates: { na: 1 }
        }
    ]
};
const randomAskFormDesign = {
    name: {
        en: "Visualization Test",
        _base: "en"
    },
    _type: "Form",
    locales: [
        {
            code: "en",
            name: "English"
        }
    ],
    contents: [
        {
            _id: "textid",
            text: {
                en: "Random Question",
                _base: "en"
            },
            _type: "TextQuestion",
            randomAskProbability: 0.2
        }
    ]
};
