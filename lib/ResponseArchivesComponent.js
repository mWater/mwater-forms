"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ResponseAnswersComponent_1 = __importDefault(require("./ResponseAnswersComponent"));
const moment_1 = __importDefault(require("moment"));
// Show complete change history of response
class ResponseArchivesComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.renderRecord = (record, previousRecord) => {
            var _a;
            return R("div", { key: record._rev, style: { marginTop: 10 } }, R("p", { key: "summary" }, "Changes made by ", R("b", null, record.modified.by ? (_a = this.props.eventsUsernames[record.modified.by]) === null || _a === void 0 ? void 0 : _a.username : "Anonymous"), " on ", (0, moment_1.default)(record.modified.on).format("lll")), R("div", { key: "detail" }, R(ResponseAnswersComponent_1.default, {
                formDesign: this.props.formDesign,
                data: record.data,
                schema: this.props.schema,
                locale: this.props.locale,
                T: this.props.T,
                formCtx: this.props.formCtx,
                prevData: previousRecord,
                showPrevAnswers: true,
                showChangedLink: false,
                highlightChanges: true,
                hideUnchangedAnswers: true,
                deployment: record.deployment
            })));
        };
    }
    render() {
        if (this.props.history.length === 0) {
            return R("div", null, R("i", null, "No changes made since submission"));
        }
        return R("div", null, lodash_1.default.map(this.props.history, (record, index) => {
            if (index === 0) {
                return this.renderRecord(this.props.response, record);
            }
            else {
                return this.renderRecord(this.props.history[index - 1], record);
            }
        }));
    }
}
exports.default = ResponseArchivesComponent;
