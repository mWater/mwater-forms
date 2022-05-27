import PropTypes from "prop-types";
import React from "react";
import MatrixColumnCellComponent from "../MatrixColumnCellComponent";
import { ResponseData } from "../response";
import ResponseRow from "../ResponseRow";
export interface MatrixAnswerComponentProps {
    items: any;
    /** Array of matrix columns */
    columns: any;
    /** See answer format */
    value?: any;
    onValueChange: any;
    /** Alternate value if selected */
    alternate?: string;
    /** Current data of response (for roster entry if in roster) */
    data: ResponseData;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    schema: any;
}
interface MatrixAnswerComponentState {
    validationErrors: any;
}
export default class MatrixAnswerComponent extends React.Component<MatrixAnswerComponentProps, MatrixAnswerComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    constructor(props: any);
    focus(): null;
    validate(): boolean;
    handleCellChange: (item: any, column: any, answer: any) => any;
    renderColumnHeader(column: any, index: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderHeader(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderCell(item: any, itemIndex: any, column: any, columnIndex: any): React.CElement<import("../MatrixColumnCellComponent").MatrixColumnCellComponentProps, MatrixColumnCellComponent>;
    renderItem(item: any, index: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
