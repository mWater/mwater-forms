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
const prop_types_1 = __importDefault(require("prop-types"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const jquery_1 = __importDefault(require("jquery"));
const moment_1 = __importDefault(require("moment"));
const ez_localize_1 = __importDefault(require("ez-localize"));
const ResponseAnswersComponent_1 = __importDefault(require("./ResponseAnswersComponent"));
const ResponseArchivesComponent_1 = __importDefault(require("./ResponseArchivesComponent"));
const ModalPopupComponent_1 = __importDefault(require("react-library/lib/ModalPopupComponent"));
const formContextTypes = __importStar(require("./formContextTypes"));
// Static view of a response
class ResponseDisplayComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleHideHistory = () => {
            return this.setState({ showCompleteHistory: false });
        };
        this.handleShowHistory = () => {
            return this.setState({ showCompleteHistory: true });
        };
        this.state = {
            eventsUsernames: null,
            loadingUsernames: false,
            showCompleteHistory: this.props.forceCompleteHistory || false,
            T: this.createLocalizer(this.props.form.design, this.props.formCtx.locale),
            history: null,
            loadingHistory: false,
            showArchive: false,
            showPrevAnswers: false
        };
    }
    static initClass() {
        this.childContextTypes = lodash_1.default.extend({}, formContextTypes, {
            T: prop_types_1.default.func.isRequired,
            locale: prop_types_1.default.string // e.g. "fr"
        });
    }
    componentWillMount() {
        return this.loadEventUsernames(this.props.response.events);
    }
    componentDidMount() {
        return this.loadHistory(this.props);
    }
    loadHistory(props) {
        var _a;
        const url = props.apiUrl + "archives/responses/" + props.response._id + "?client=" + (((_a = props.login) === null || _a === void 0 ? void 0 : _a.client) || "");
        this.setState({ loadingHistory: true });
        return jquery_1.default.ajax({ dataType: "json", url })
            .done((history) => {
            // Get only ones since first submission
            const index = lodash_1.default.findIndex(history, (rev) => ["pending", "final"].includes(rev.status));
            history = history.slice(0, index + 1);
            // Remove history where there was no change to data
            const compactHistory = [];
            for (let i = 0; i < history.length; i++) {
                const entry = history[i];
                const prevEntry = i === 0 ? this.props.response : history[i - 1];
                if (!lodash_1.default.isEqual(entry.data, prevEntry.data)) {
                    compactHistory.push(entry);
                }
            }
            return this.setState({ loadingHistory: false, history: compactHistory });
        })
            .fail((xhr) => {
            return this.setState({ loadingHistory: false, history: null });
        });
    }
    // Load user names related to events
    loadEventUsernames(events) {
        events = this.props.response.events || [];
        const byArray = lodash_1.default.compact(lodash_1.default.pluck(events, "by"));
        if (byArray.length > 0 && this.props.apiUrl != null) {
            const filter = { _id: { $in: byArray } };
            const url = this.props.apiUrl + "users_public_data?filter=" + JSON.stringify(filter);
            this.setState({ loadingUsernames: true });
            return jquery_1.default.ajax({ dataType: "json", url })
                .done((rows) => {
                // eventsUsernames is an object with a key for each _id value
                return this.setState({ loadingUsernames: false, eventsUsernames: lodash_1.default.indexBy(rows, "_id") });
            })
                .fail((xhr) => {
                return this.setState({ loadingUsernames: false, eventsUsernames: null });
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        let events;
        if (this.props.form.design !== nextProps.form.design || this.props.locale !== nextProps.locale) {
            this.setState({ T: this.createLocalizer(nextProps.form.design, nextProps.locale) });
        }
        if (!lodash_1.default.isEqual(this.props.response.response, nextProps.response.response)) {
            this.loadHistory(nextProps);
        }
        if (!lodash_1.default.isEqual(this.props.response.events, nextProps.response.events)) {
            this.loadEventUsernames(nextProps.response.events);
        }
        return (events = this.props.response.events || []);
    }
    getChildContext() {
        return lodash_1.default.extend({}, this.props.formCtx, {
            T: this.state.T,
            locale: this.props.locale
        });
    }
    // Creates a localizer for the form design
    createLocalizer(design, locale) {
        // Create localizer
        const localizedStrings = design.localizedStrings || [];
        const localizerData = {
            locales: design.locales,
            strings: localizedStrings
        };
        const { T } = new ez_localize_1.default.Localizer(localizerData, locale);
        return T;
    }
    renderEvent(ev) {
        var _a;
        if (this.state.eventsUsernames == null) {
            return null;
        }
        const eventType = (() => {
            switch (ev.type) {
                case "draft":
                    return this.state.T("Drafted");
                case "submit":
                    return this.state.T("Submitted");
                case "approve":
                    return this.state.T("Approved");
                case "reject":
                    return this.state.T("Rejected");
                case "edit":
                    return this.state.T("Edited");
            }
        })();
        return R("div", null, eventType, " ", this.state.T("by"), " ", ev.by ? (_a = this.state.eventsUsernames[ev.by]) === null || _a === void 0 ? void 0 : _a.username : "Anonymous", " ", this.state.T("on"), " ", moment_1.default(ev.on).format("lll"), ev.message ? [": ", R("i", null, ev.message)] : undefined, ev.override ? R("span", { className: "label label-warning" }, this.state.T("Admin Override")) : undefined);
    }
    // History of events
    renderHistory() {
        if (this.state.loadingUsernames) {
            return R("div", { key: "history" }, R("label", null, this.state.T("Loading History...")));
        }
        const contents = [];
        const events = this.props.response.events || [];
        if (this.state.showCompleteHistory) {
            for (let ev of lodash_1.default.initial(events)) {
                contents.push(this.renderEvent(ev));
            }
        }
        const lastEvent = lodash_1.default.last(events);
        if (lastEvent) {
            contents.push(this.renderEvent(lastEvent));
        }
        if (events.length > 1 && !this.props.forceCompleteHistory) {
            if (this.state.showCompleteHistory) {
                contents.push(R("div", null, R("a", { style: { cursor: "pointer" }, onClick: this.handleHideHistory }, this.state.T("Hide History"))));
                contents.push(R("div", null, R("a", { style: { cursor: "pointer" }, onClick: () => this.setState({ showArchive: true }) }, this.state.T("Show Complete History of Changes"))));
            }
            else {
                contents.push(R("div", null, R("a", { style: { cursor: "pointer" }, onClick: this.handleShowHistory }, this.state.T("Show History"))));
            }
        }
        return R("div", { key: "history" }, contents);
    }
    renderStatus() {
        const status = (() => {
            switch (this.props.response.status) {
                case "draft":
                    return this.state.T("Draft");
                case "rejected":
                    return this.state.T("Rejected");
                case "pending":
                    return this.state.T("Pending");
                case "final":
                    return this.state.T("Final");
            }
        })();
        return R("div", { key: "status" }, this.state.T("Status"), ": ", R("b", null, status));
    }
    renderArchives() {
        if (!this.state.history || !this.state.showArchive) {
            return null;
        }
        return R(ModalPopupComponent_1.default, {
            header: "Change history",
            size: "large",
            showCloseX: true,
            onClose: () => this.setState({ showArchive: false })
        }, R(ResponseArchivesComponent_1.default, {
            formDesign: this.props.form.design,
            response: this.props.response,
            schema: this.props.schema,
            locale: this.props.locale,
            T: this.state.T,
            formCtx: this.props.formCtx,
            history: this.state.history,
            eventsUsernames: this.state.eventsUsernames
        }));
    }
    // Header which includes basics
    renderHeader() {
        return R("div", { style: { paddingBottom: 10 } }, R("div", { key: "user" }, this.state.T("User"), ": ", R("b", null, this.props.response.username || "Anonymous")), R("div", { key: "code" }, this.state.T("Response Id"), ": ", R("b", null, this.props.response.code)), this.props.response && this.props.response.submittedOn
            ? R("div", { key: "submittedOn" }, this.state.T("Submitted"), ": ", R("b", null, moment_1.default(this.props.response.submittedOn).format("lll")))
            : undefined, this.props.response.ipAddress
            ? R("div", { key: "ipAddress" }, this.state.T("IP Address"), ": ", R("b", null, this.props.response.ipAddress))
            : undefined, this.renderStatus(), this.renderHistory(), this.renderArchives());
    }
    render() {
        return R("div", null, this.renderHeader(), react_1.default.createElement(ResponseAnswersComponent_1.default, {
            formDesign: this.props.form.design,
            data: this.props.response.data,
            deployment: this.props.response.deployment,
            schema: this.props.schema,
            locale: this.props.locale,
            T: this.state.T,
            formCtx: this.props.formCtx,
            prevData: this.state.history ? lodash_1.default.last(this.state.history) : null,
            showPrevAnswers: this.state.history != null && this.state.showPrevAnswers,
            highlightChanges: this.state.showPrevAnswers,
            showChangedLink: this.state.history != null,
            onChangedLinkClick: () => {
                return this.setState({ showPrevAnswers: !this.state.showPrevAnswers });
            },
            onCompleteHistoryLinkClick: () => {
                return this.setState({ showArchive: true });
            }
        }));
    }
}
exports.default = ResponseDisplayComponent;
ResponseDisplayComponent.initClass();
