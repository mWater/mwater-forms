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
const MWaterDataSource_1 = __importDefault(require("mwater-expressions/lib/MWaterDataSource"));
const react_1 = __importStar(require("react"));
const LocationQuestionAdminRegionComponent = ({ apiUrl, login, location }) => {
    const [adminRegion, setAdminRegion] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (apiUrl && login) {
            const jsonql = generateJsonql(location);
            (() => __awaiter(void 0, void 0, void 0, function* () {
                const datasource = new MWaterDataSource_1.default(apiUrl, login.client);
                try {
                    const rows = yield datasource.performQuery(jsonql);
                    if (rows.length > 0) {
                        setAdminRegion(rows[0].fullname);
                    }
                }
                catch (error) { }
            }))();
        }
    }, []);
    if (!adminRegion)
        return null;
    return react_1.default.createElement("p", null, adminRegion);
};
exports.default = LocationQuestionAdminRegionComponent;
const generateJsonql = (location) => ({
    type: "query",
    selects: [{ type: "select", expr: { type: "field", tableAlias: "main", column: "full_name" }, alias: "fullname" }],
    from: { type: "table", table: "admin_regions", alias: "main" },
    where: {
        type: "op",
        op: "and",
        exprs: [
            {
                type: "field",
                tableAlias: "main",
                column: "leaf"
            },
            {
                type: "op",
                op: "&&",
                exprs: [
                    {
                        type: "op",
                        op: "ST_Transform",
                        exprs: [
                            {
                                type: "op",
                                op: "ST_Intersection",
                                exprs: [
                                    {
                                        type: "op",
                                        op: "ST_SetSRID",
                                        exprs: [
                                            {
                                                type: "op",
                                                op: "ST_MakePoint",
                                                exprs: [location.longitude, location.latitude]
                                            },
                                            4326
                                        ]
                                    },
                                    {
                                        type: "op",
                                        op: "ST_MakeEnvelope",
                                        exprs: [-180, -85, 180, 85, 4326]
                                    }
                                ]
                            },
                            3857
                        ]
                    },
                    {
                        type: "field",
                        tableAlias: "main",
                        column: "shape"
                    }
                ]
            },
            {
                type: "op",
                op: "ST_Intersects",
                exprs: [
                    {
                        type: "op",
                        op: "ST_Transform",
                        exprs: [
                            {
                                type: "op",
                                op: "ST_Intersection",
                                exprs: [
                                    {
                                        type: "op",
                                        op: "ST_SetSRID",
                                        exprs: [
                                            {
                                                type: "op",
                                                op: "ST_MakePoint",
                                                exprs: [location.longitude, location.latitude]
                                            },
                                            4326
                                        ]
                                    },
                                    {
                                        type: "op",
                                        op: "ST_MakeEnvelope",
                                        exprs: [-180, -85, 180, 85, 4326]
                                    }
                                ]
                            },
                            3857
                        ]
                    },
                    {
                        type: "field",
                        tableAlias: "main",
                        column: "shape"
                    }
                ]
            }
        ]
    }
});
