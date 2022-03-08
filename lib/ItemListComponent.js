"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const formRenderUtils = __importStar(require("./formRenderUtils"));
// Display a list of items
class ItemListComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.renderItem = (item, index) => {
            if (this.props.isVisible(item._id) && !item.disabled) {
                return formRenderUtils.renderItem(item, this.props.data, this.props.responseRow, this.props.schema, this.props.onDataChange, this.props.isVisible, this.handleNext.bind(this, index), (c) => {
                    return (this.itemRefs[item._id] = c);
                });
            }
        };
        // Refs of all items
        this.itemRefs = {};
    }
    validate(scrollToFirstInvalid) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let foundInvalid = false;
            for (let item of this.props.contents) {
                // Only if validation is possible
                if ((_a = this.itemRefs[item._id]) === null || _a === void 0 ? void 0 : _a.validate) {
                    const result = yield ((_b = this.itemRefs[item._id]) === null || _b === void 0 ? void 0 : _b.validate(scrollToFirstInvalid && !foundInvalid));
                    // DO NOT BREAK, it's important to call validate on each item
                    if (result) {
                        foundInvalid = true;
                    }
                }
            }
            return foundInvalid;
        });
    }
    handleNext(index) {
        var _a, _b, _c, _d;
        index++;
        if (index >= this.props.contents.length) {
            return (_b = (_a = this.props).onNext) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        else {
            return (_d = (_c = this.itemRefs[this.props.contents[index]._id]) === null || _c === void 0 ? void 0 : _c.focus) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
    }
    render() {
        return R("div", null, lodash_1.default.map(this.props.contents, this.renderItem));
    }
}
exports.default = ItemListComponent;
