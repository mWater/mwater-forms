"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const AquagenxCBTDisplaySVG_1 = __importDefault(require("./AquagenxCBTDisplaySVG"));
const aquagenxCBTUtils_1 = require("./aquagenxCBTUtils");
const ImageDisplayComponent_1 = __importDefault(require("../ImageDisplayComponent"));
class AquagenxCBTDisplayComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleClick = () => {
            if (this.props.onEdit) {
                return this.props.onEdit();
            }
        };
    }
    renderStyle() {
        const mainId = `#cbtDisplay${this.props.questionId}`;
        const cbtValues = this.props.value.cbt;
        const compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
        const compartmentColors = lodash_1.default.map(compartmentValues, function (c) {
            if (c) {
                return "#32a89b";
            }
            else {
                return "#ebe7c2";
            }
        });
        return R("style", null, `\
${mainId} #compartment1 rect { \
fill: ${compartmentColors[0]}; \
} \
${mainId} #compartment2 rect { \
fill: ${compartmentColors[1]}; \
} \
${mainId} #compartment3 rect { \
fill: ${compartmentColors[2]}; \
} \
${mainId} #compartment4 rect { \
fill: ${compartmentColors[3]}; \
} \
${mainId} #compartment5 rect { \
fill: ${compartmentColors[4]}; \
}\
`);
    }
    renderInfo() {
        const cbtValues = this.props.value.cbt;
        let { mpn } = cbtValues;
        if (mpn === 100) {
            mpn = ">100";
        }
        return R("div", null, R("div", null, this.context.T("MPN/100ml") + ": ", R("b", null, mpn)), R("div", null, this.context.T("Upper 95% Confidence Interval/100ml") + ": ", R("b", null, cbtValues.confidence)), R("div", null, this.context.T("Health Risk Category Based on MPN and Confidence Interval") + ": ", R("b", null, aquagenxCBTUtils_1.getHealthRiskString(cbtValues.healthRisk, this.context.T))));
    }
    renderPhoto() {
        // Displays an image
        if (this.props.value.image && this.props.imageManager) {
            return R("div", null, react_1.default.createElement(ImageDisplayComponent_1.default, {
                image: this.props.value.image,
                imageManager: this.props.imageManager,
                T: this.context.T
            }));
        }
    }
    render() {
        var _a;
        // Can't display if not set
        if (!((_a = this.props.value) === null || _a === void 0 ? void 0 : _a.cbt)) {
            return null;
        }
        return R("div", { id: `cbtDisplay${this.props.questionId}` }, this.renderStyle(), R("div", { dangerouslySetInnerHTML: { __html: AquagenxCBTDisplaySVG_1.default }, onClick: this.handleClick }), this.renderInfo(), this.renderPhoto());
    }
}
exports.default = AquagenxCBTDisplayComponent;
AquagenxCBTDisplayComponent.contextTypes = { T: prop_types_1.default.func.isRequired };
