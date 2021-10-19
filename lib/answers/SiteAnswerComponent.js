"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const EntityDisplayComponent_1 = __importDefault(require("../EntityDisplayComponent"));
class SiteAnswerComponent extends react_1.default.Component {
    constructor(props) {
        var _a;
        super(props);
        this.handleKeyDown = (ev) => {
            if (this.props.onNextOrComments != null) {
                // When pressing ENTER or TAB
                if (ev.keyCode === 13 || ev.keyCode === 9) {
                    this.props.onNextOrComments(ev);
                    // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
                    return ev.preventDefault();
                }
            }
        };
        this.handleSelectClick = () => {
            const entityType = this.getEntityType();
            return this.context.selectEntity({
                entityType,
                callback: (entityId) => {
                    console.log(`Issue584:${new Date().toISOString()}: after selectEntity ${entityType} ${entityId}`);
                    // Get entity
                    return this.context.getEntityById(entityType, entityId, (entity) => {
                        console.log(`Issue584:${new Date().toISOString()}: after getEntityById ${entityType} ${entityId} ${JSON.stringify(entity)}`);
                        if (!entity) {
                            throw new Error(`Unable to lookup entity ${entityType}:${entityId}`);
                        }
                        if (!entity.code) {
                            alert(this.props.T("Unable to select that site as it does not have an mWater ID. Please synchronize first with the server."));
                            return;
                        }
                        return this.props.onValueChange({ code: entity.code });
                    });
                }
            });
        };
        this.handleChange = (ev) => {
            return this.setState({ text: ev.target.value });
        };
        this.handleBlur = (ev) => {
            if (ev.target.value) {
                return this.props.onValueChange({ code: ev.target.value });
            }
            else {
                return this.props.onValueChange(null);
            }
        };
        this.state = { text: ((_a = props.value) === null || _a === void 0 ? void 0 : _a.code) || "" };
    }
    componentWillReceiveProps(nextProps) {
        var _a, _b, _c, _d;
        // If different, override text
        if (((_a = nextProps.value) === null || _a === void 0 ? void 0 : _a.code) !== ((_b = this.props.value) === null || _b === void 0 ? void 0 : _b.code)) {
            return this.setState({ text: ((_c = nextProps.value) === null || _c === void 0 ? void 0 : _c.code) ? (_d = nextProps.value) === null || _d === void 0 ? void 0 : _d.code : "" });
        }
    }
    focus() {
        return this.input.focus();
    }
    getEntityType() {
        // Convert to new entity type (legacy sometimes had capital letter and spaces)
        const siteType = (this.props.siteTypes ? this.props.siteTypes[0] : undefined) || "water_point";
        const entityType = siteType.toLowerCase().replace(new RegExp(" ", "g"), "_");
        return entityType;
    }
    render() {
        var _a;
        return R("div", null, R("div", { className: "input-group" }, R("input", {
            type: "tel",
            className: "form-control",
            onKeyDown: this.handleKeyDown,
            ref: (c) => {
                return (this.input = c);
            },
            placeholder: this.context.T("mWater ID of Site"),
            style: { zIndex: "inherit" },
            value: this.state.text,
            onBlur: this.handleBlur,
            onChange: this.handleChange
        }), R("button", {
            className: "btn btn-secondary",
            disabled: this.context.selectEntity == null,
            type: "button",
            onClick: this.handleSelectClick,
            style: { zIndex: "inherit" }
        }, this.context.T("Select"))), R("br"), R(EntityDisplayComponent_1.default, {
            displayInWell: true,
            entityType: this.getEntityType(),
            entityCode: (_a = this.props.value) === null || _a === void 0 ? void 0 : _a.code,
            getEntityByCode: this.context.getEntityByCode,
            renderEntityView: this.context.renderEntitySummaryView,
            T: this.context.T
        }));
    }
}
exports.default = SiteAnswerComponent;
SiteAnswerComponent.contextTypes = {
    selectEntity: prop_types_1.default.func,
    getEntityById: prop_types_1.default.func.isRequired,
    getEntityByCode: prop_types_1.default.func.isRequired,
    renderEntitySummaryView: prop_types_1.default.func.isRequired,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
