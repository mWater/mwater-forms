import PropTypes from "prop-types";
export declare let selectEntity: PropTypes.Requireable<(...args: any[]) => any>;
export declare let editEntity: PropTypes.Requireable<(...args: any[]) => any>;
export declare let renderEntitySummaryView: PropTypes.Validator<(...args: any[]) => any>;
export declare let renderEntityListItemView: PropTypes.Validator<(...args: any[]) => any>;
export declare let canEditEntity: PropTypes.Requireable<(...args: any[]) => any>;
export declare let getEntityById: PropTypes.Requireable<(...args: any[]) => any>;
export declare let getEntityByCode: PropTypes.Requireable<(...args: any[]) => any>;
export declare let locationFinder: PropTypes.Requireable<object>;
export declare let displayMap: PropTypes.Requireable<(...args: any[]) => any>;
export declare let stickyStorage: PropTypes.Requireable<object>;
export declare let scanBarcode: PropTypes.Requireable<(...args: any[]) => any>;
export declare let imageManager: PropTypes.Validator<object>;
export declare let imageAcquirer: PropTypes.Requireable<object>;
export declare let getCustomTableRows: PropTypes.Validator<(...args: any[]) => any>;
export declare let getCustomTableRow: PropTypes.Validator<(...args: any[]) => any>;
export declare let getAssetById: PropTypes.Validator<(...args: any[]) => any>;
export declare let selectAsset: PropTypes.Requireable<(...args: any[]) => any>;
export declare let renderAssetSummaryView: PropTypes.Requireable<(...args: any[]) => any>;
