"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const EntityDisplayComponent_1 = __importDefault(require("../EntityDisplayComponent"));
// Displays a site answer in a cell. No direct code entering, but stores answer as a code.
class SiteColumnAnswerComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleSelectClick = () => {
            return this.context.selectEntity({
                entityType: this.props.siteType,
                callback: (entityId) => {
                    // Get entity
                    return this.context.getEntityById(this.props.siteType, entityId, (entity) => {
                        return this.props.onValueChange({ code: entity.code });
                    });
                }
            });
        };
        this.handleClearClick = () => {
            return this.props.onValueChange(null);
        };
    }
    render() {
        var _a, _b;
        if ((_a = this.props.value) === null || _a === void 0 ? void 0 : _a.code) {
            return R("div", null, R("button", { className: "btn btn-link btn-sm float-end", onClick: this.handleClearClick }, R("span", { className: "fas fa-times" })), R(EntityDisplayComponent_1.default, {
                entityType: this.props.siteType,
                entityCode: (_b = this.props.value) === null || _b === void 0 ? void 0 : _b.code,
                getEntityByCode: this.context.getEntityByCode,
                renderEntityView: this.context.renderEntityListItemView,
                T: this.context.T
            }));
        }
        else {
            return R("button", { className: "btn btn-link", onClick: this.handleSelectClick }, this.context.T("Select..."));
        }
    }
}
exports.default = SiteColumnAnswerComponent;
SiteColumnAnswerComponent.contextTypes = {
    selectEntity: prop_types_1.default.func,
    getEntityById: prop_types_1.default.func.isRequired,
    getEntityByCode: prop_types_1.default.func.isRequired,
    renderEntityListItemView: prop_types_1.default.func.isRequired,
    T: prop_types_1.default.func.isRequired // Localizer to use
};
