import PropTypes from "prop-types";
import React from "react";
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent";
import MatrixColumnCellComponent from "./MatrixColumnCellComponent";
export default class RosterMatrixComponent extends React.Component {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    static propTypes: {
        rosterMatrix: PropTypes.Validator<object>;
        data: PropTypes.Requireable<object>;
        onDataChange: PropTypes.Validator<(...args: any[]) => any>;
        isVisible: PropTypes.Validator<(...args: any[]) => any>;
        schema: PropTypes.Validator<object>;
    };
    constructor(props: any);
    getAnswerId(): any;
    getAnswer(): any;
    validate(scrollToFirstInvalid: any): boolean;
    handleAnswerChange: (answer: any) => any;
    handleEntryDataChange: (index: any, data: any) => any;
    handleAdd: () => any;
    handleRemove: (index: any) => any;
    handleCellChange: (entryIndex: any, columnId: any, answer: any) => any;
    handleSort: (column: any, order: any) => any;
    renderName(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderColumnHeader(column: any, index: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderHeader(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderCell(entry: any, entryIndex: any, column: any, columnIndex: any): React.CElement<import("./MatrixColumnCellComponent").MatrixColumnCellComponentProps, MatrixColumnCellComponent>;
    renderEntry: (entry: any, index: any, connectDragSource: any, connectDragPreview: any, connectDropTarget: any) => any;
    renderAdd(): React.DetailedReactHTMLElement<{
        key: string;
        style: {
            marginTop: number;
        };
    }, HTMLElement> | undefined;
    renderBody(): React.CElement<any, ReorderableListComponent<unknown>>;
    renderEmptyPrompt(): React.DetailedReactHTMLElement<{
        style: {
            fontStyle: "italic";
        };
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<{
        style: {
            padding: number;
            marginBottom: number;
        };
    }, HTMLElement>;
}
