"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAnswerComponent = void 0;
const react_1 = __importDefault(require("react"));
/** Answer component that allows selecting an asset */
function AssetAnswerComponent(props) {
    function handleSelect() {
        const filter = {};
        if (props.question.assetTypes && props.question.assetTypes.length > 0) {
            filter.type = { $in: props.question.assetTypes };
        }
        props.selectAsset(props.question.assetSystemId, filter, (assetId) => {
            props.onValueChange(assetId);
        });
    }
    function handleClear() {
        props.onValueChange(null);
    }
    return react_1.default.createElement("div", null,
        props.answer && props.renderAssetSummaryView(props.question.assetSystemId, props.answer),
        react_1.default.createElement("div", null,
            !props.answer &&
                react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", onClick: handleSelect }, props.T("Select Asset")),
            props.answer &&
                react_1.default.createElement("div", null,
                    react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", onClick: handleSelect }, props.T("Change")),
                    "\u00A0",
                    react_1.default.createElement("button", { type: "button", className: "btn btn-secondary", onClick: handleClear }, props.T("Clear")))));
}
exports.AssetAnswerComponent = AssetAnswerComponent;
