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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationsDisplayComponent = void 0;
const react_1 = __importStar(require("react"));
const formUtils_1 = require("./formUtils");
const mwater_expressions_1 = require("mwater-expressions");
/** Displays calculation values for a response. Only displays root level calculations, not roster ones. */
exports.CalculationsDisplayComponent = (props) => {
    const [values, setValues] = react_1.useState([]);
    // Create evaluator
    const exprEvaluator = react_1.useMemo(() => {
        return new mwater_expressions_1.PromiseExprEvaluator({
            schema: props.schema,
            locale: props.locale
        });
    }, [props.schema, props.locale]);
    // Evaluate calculation values
    react_1.useEffect(() => {
        (function performCalcs() {
            return __awaiter(this, void 0, void 0, function* () {
                const vs = [];
                for (const calc of props.formDesign.calculations.filter(c => !c.roster)) {
                    vs.push(yield exprEvaluator.evaluate(calc.expr, { row: props.responseRow }));
                }
                setValues(vs);
            });
        })();
    }, [exprEvaluator, props.formDesign, props.responseRow]);
    const renderCalc = (calc, index) => {
        return react_1.default.createElement("tr", { key: calc._id },
            react_1.default.createElement("td", { style: { width: "50%" } },
                formUtils_1.localizeString(calc.name, props.locale),
                calc.desc ? react_1.default.createElement("span", { className: "text-muted" },
                    " - ",
                    formUtils_1.localizeString(calc.desc, props.locale)) : null),
            react_1.default.createElement("td", null, values.length > 0 ? values[index] : null));
    };
    return react_1.default.createElement("table", { className: "table table-bordered table-condensed" },
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("th", null, "Calculation"),
                react_1.default.createElement("th", null, "Value"))),
        react_1.default.createElement("tbody", null, props.formDesign.calculations.filter(calc => !calc.roster).map((calc, index) => renderCalc(calc, index))));
};
