"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var formUtils_1 = require("./formUtils");
var mwater_expressions_1 = require("mwater-expressions");
/** Displays calculation values for a response. Only displays root level calculations, not roster ones. */
exports.CalculationsDisplayComponent = function (props) {
    var _a = react_1.useState([]), values = _a[0], setValues = _a[1];
    // Create evaluator
    var exprEvaluator = react_1.useMemo(function () {
        return new mwater_expressions_1.PromiseExprEvaluator({
            schema: props.schema,
            locale: props.locale
        });
    }, [props.schema, props.locale]);
    // Evaluate calculation values
    react_1.useEffect(function () {
        (function performCalcs() {
            return __awaiter(this, void 0, void 0, function () {
                var vs, _i, _a, calc, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            vs = [];
                            _i = 0, _a = props.formDesign.calculations.filter(function (c) { return !c.roster; });
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            calc = _a[_i];
                            _c = (_b = vs).push;
                            return [4 /*yield*/, exprEvaluator.evaluate(calc.expr, { row: props.responseRow })];
                        case 2:
                            _c.apply(_b, [_d.sent()]);
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            setValues(vs);
                            return [2 /*return*/];
                    }
                });
            });
        })();
    }, [exprEvaluator, props.formDesign, props.responseRow]);
    var renderCalc = function (calc, index) {
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
        react_1.default.createElement("tbody", null, props.formDesign.calculations.filter(function (calc) { return !calc.roster; }).map(function (calc, index) { return renderCalc(calc, index); })));
};
