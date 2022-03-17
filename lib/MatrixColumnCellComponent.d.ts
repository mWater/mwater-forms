import PropTypes from "prop-types";
import React from "react";
import { MatrixColumn } from "./formDesign";
import { Schema } from "mwater-expressions";
import ResponseRow from "./ResponseRow";
export interface MatrixColumnCellComponentProps {
    /** Column. See designSchema */
    column: MatrixColumn;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow: ResponseRow;
    /** Answer of the cell */
    answer?: any;
    /** Called with new answer of cell */
    onAnswerChange: any;
    /** True if invalid */
    invalid?: boolean;
    /** Validation message */
    invalidMessage?: string;
    /** Schema to use, including form */
    schema: Schema;
}
export interface MatrixColumnCellComponentState {
    /** Status of visibility of choices */
    choiceVisibility: {
        [choiceId: string]: boolean;
    };
}
export default class MatrixColumnCellComponent extends React.Component<MatrixColumnCellComponentProps, MatrixColumnCellComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    constructor(props: MatrixColumnCellComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: MatrixColumnCellComponentProps): void;
    calculateChoiceVisibility(): Promise<void>;
    handleValueChange: (value: any) => any;
    render(): React.DetailedReactHTMLElement<{
        className: string | undefined;
    }, HTMLElement>;
}
