"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AsyncLoadComponent_1 = __importDefault(require("react-library/lib/AsyncLoadComponent"));
// Loads and displays an entity
class EntityDisplayComponent extends AsyncLoadComponent_1.default {
    // Override to determine if a load is needed. Not called on mounting
    isLoadNeeded(newProps, oldProps) {
        return (newProps.entityType !== oldProps.entityType ||
            newProps.entityId !== oldProps.entityId ||
            newProps.entityCode !== oldProps.entityCode);
    }
    // Call callback with state changes
    load(props, prevProps, callback) {
        if (!props.entityId && !props.entityCode) {
            callback({ entity: null });
            return;
        }
        if (props.entityId) {
            return this.props.getEntityById(props.entityType, props.entityId, (entity) => {
                return callback({ entity });
            });
        }
        else {
            return this.props.getEntityByCode(props.entityType, props.entityCode, (entity) => {
                return callback({ entity });
            });
        }
    }
    render() {
        if (this.state.loading) {
            return R("div", { className: "alert alert-info" }, this.props.T("Loading..."));
        }
        if (!this.props.entityId && !this.props.entityCode) {
            return null;
        }
        if (!this.state.entity) {
            return R("div", { className: "alert alert-danger" }, this.props.T("Either site has been deleted or you do not have permission to view it"));
        }
        return R("div", { className: this.props.displayInWell ? "well well-sm" : undefined }, this.props.renderEntityView(this.props.entityType, this.state.entity));
    }
}
exports.default = EntityDisplayComponent;
