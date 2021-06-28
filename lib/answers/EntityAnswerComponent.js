"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const EntityDisplayComponent_1 = __importDefault(require("../EntityDisplayComponent"));
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
// Allows user to select an entity
// State is needed for canEditEntity which requires entire entity
class EntityAnswerComponent extends AsyncLoadComponent_1.default {
    constructor() {
        super(...arguments);
        // Called to select an entity using an external mechanism (calls @ctx.selectEntity)
        this.handleSelectEntity = () => {
            if (!this.context.selectEntity) {
                return alert(this.context.T("Not supported on this platform"));
            }
            return this.context.selectEntity({
                entityType: this.props.entityType,
                callback: (value) => {
                    return this.props.onValueChange(value);
                }
            });
        };
        this.handleClearEntity = () => {
            return this.props.onValueChange(null);
        };
        this.handleEditEntity = () => {
            if (!this.context.editEntity) {
                return alert(this.context.T("Not supported on this platform"));
            }
            return this.context.editEntity(this.props.entityType, this.props.value, () => {
                this.props.onValueChange(this.props.value);
                return this.forceLoad();
            });
        };
    }
    static initClass() {
        this.contextTypes = {
            selectEntity: prop_types_1.default.func,
            editEntity: prop_types_1.default.func,
            renderEntitySummaryView: prop_types_1.default.func.isRequired,
            getEntityById: prop_types_1.default.func.isRequired,
            canEditEntity: prop_types_1.default.func,
            T: prop_types_1.default.func.isRequired // Localizer to use
        };
    }
    focus() {
        // Nothing to focus
        return false;
    }
    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
        return newProps.entityType !== oldProps.entityType || newProps.value !== oldProps.value;
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        if (!props.value) {
            callback({ entity: null });
            return;
        }
        return this.context.getEntityById(props.entityType, props.value, (entity) => {
            return callback({ entity });
        });
    }
    renderEntityButtons() {
        return R("div", null, R("button", { type: "button", className: "btn btn-link btn-sm", onClick: this.handleSelectEntity }, R("span", { className: "glyphicon glyphicon-ok" }), " ", this.context.T("Change Selection")), R("button", { type: "button", className: "btn btn-link btn-sm", onClick: this.handleClearEntity }, R("span", { className: "glyphicon glyphicon-remove" }), " ", this.context.T("Clear Selection")), this.context.editEntity != null && this.context.canEditEntity(this.props.entityType, this.state.entity)
            ? R("button", { type: "button", className: "btn btn-link btn-sm", onClick: this.handleEditEntity }, R("span", { className: "glyphicon glyphicon-pencil" }), " ", this.context.T("Edit Selection"))
            : undefined);
    }
    render() {
        if (this.state.loading) {
            return R("div", { className: "alert alert-info" }, this.context.T("Loading..."));
        }
        if (!this.props.value) {
            // Render select button
            return R("button", { type: "button", className: "btn btn-default btn-sm", onClick: this.handleSelectEntity }, R("span", { className: "glyphicon glyphicon-ok" }), " ", this.context.T("Select"));
        }
        if (!this.state.entity) {
            return R("div", { className: "alert alert-danger" }, this.context.T("Not found"));
        }
        return R("div", null, this.renderEntityButtons(), R(EntityDisplayComponent_1.default, {
            entityType: this.props.entityType,
            displayInWell: true,
            entityId: this.props.value,
            getEntityById: this.context.getEntityById,
            renderEntityView: this.context.renderEntitySummaryView,
            T: this.context.T
        }));
    }
}
exports.default = EntityAnswerComponent;
;
EntityAnswerComponent.initClass();
