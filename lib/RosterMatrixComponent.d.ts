import PropTypes from "prop-types";
import React from "react";
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent";
import MatrixColumnCellComponent from "./MatrixColumnCellComponent";
import { RosterMatrix } from "./formDesign";
import { ResponseData, RosterData } from "./response";
import { Schema } from "mwater-expressions";
import ResponseRow from "./ResponseRow";
export interface RosterMatrixComponentProps {
    rosterMatrix: RosterMatrix;
    /** Current data of response */
    data: ResponseData;
    onDataChange: (data: ResponseData) => void;
    /** (id) tells if an item is visible or not */
    isVisible: (id: string) => boolean;
    schema: Schema;
    responseRow: ResponseRow;
}
interface RosterMatrixComponentState {
    /** Map of "<rowindex>_<columnid>" to validation error */
    validationErrors: {
        [id: string]: string | true;
    };
}
export default class RosterMatrixComponent extends React.Component<RosterMatrixComponentProps, RosterMatrixComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    prompt: HTMLHeadingElement | null;
    constructor(props: RosterMatrixComponentProps);
    getAnswerId(): string;
    getAnswer(): RosterData;
    validate(scrollToFirstInvalid: any): boolean;
    handleAnswerChange: (answer: any) => void;
    handleEntryDataChange: (index: any, data: any) => void;
    handleAdd: () => void;
    handleRemove: (index: any) => void;
    handleCellChange: (entryIndex: any, columnId: any, answer: any) => void;
    handleSort: (column: any, order: any) => void;
    renderName(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    renderColumnHeader(column: any, index: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderHeader(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderCell(entry: any, entryIndex: any, column: any, columnIndex: any): React.CElement<import("./MatrixColumnCellComponent").MatrixColumnCellComponentProps, MatrixColumnCellComponent>;
    renderEntry: (entry: any, index: any, connectDragSource: any, connectDragPreview: any, connectDropTarget: any) => any;
    renderAdd(): React.DetailedReactHTMLElement<{
        key: string;
        style: {
            marginTop: number;
        };
    }, HTMLElement> | null;
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
export {};
