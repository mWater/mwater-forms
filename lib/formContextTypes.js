"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAssetSummaryView = exports.selectAsset = exports.getAssetById = exports.getCustomTableRow = exports.getCustomTableRows = exports.imageAcquirer = exports.imageManager = exports.scanBarcode = exports.stickyStorage = exports.displayMap = exports.locationFinder = exports.getEntityByCode = exports.getEntityById = exports.canEditEntity = exports.renderEntityListItemView = exports.renderEntitySummaryView = exports.editEntity = exports.selectEntity = void 0;
const prop_types_1 = __importDefault(require("prop-types"));
// Context types for forms. See formContext.d.ts for details
exports.selectEntity = prop_types_1.default.func;
exports.editEntity = prop_types_1.default.func;
exports.renderEntitySummaryView = prop_types_1.default.func.isRequired;
exports.renderEntityListItemView = prop_types_1.default.func.isRequired;
exports.canEditEntity = prop_types_1.default.func;
exports.getEntityById = prop_types_1.default.func;
exports.getEntityByCode = prop_types_1.default.func;
exports.locationFinder = prop_types_1.default.object;
exports.displayMap = prop_types_1.default.func;
exports.stickyStorage = prop_types_1.default.object;
exports.scanBarcode = prop_types_1.default.func;
exports.imageManager = prop_types_1.default.object.isRequired;
exports.imageAcquirer = prop_types_1.default.object;
exports.getCustomTableRows = prop_types_1.default.func.isRequired;
exports.getCustomTableRow = prop_types_1.default.func.isRequired;
exports.getAssetById = prop_types_1.default.func.isRequired;
exports.selectAsset = prop_types_1.default.func;
exports.renderAssetSummaryView = prop_types_1.default.func;
