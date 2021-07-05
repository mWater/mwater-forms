import PropTypes from "prop-types";
import React from "react";
interface MatrixColumnCellComponentProps {
    /** Column. See designSchema */
    column: any;
    /** Current data of response (for roster entry if in roster) */
    data?: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: any;
    /** Answer of the cell */
    answer?: any;
    /** Called with new answer of cell */
    onAnswerChange: any;
    /** True if invalid */
    invalid?: boolean;
    /** Schema to use, including form */
    schema: any;
}
export default class MatrixColumnCellComponent extends React.Component<MatrixColumnCellComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    handleValueChange: (value: any) => any;
    areConditionsValid(choice: any): boolean;
    render(): React.DetailedReactHTMLElement<{
        className: string | undefined;
    }, HTMLElement>;
}
export {};
