/// <reference types="react" />
import { CascadingRefAnswerValue } from "../response";
import { CascadingRefQuestion } from "../formDesign";
import { Row, Schema } from "mwater-expressions";
/** Displays a cascading list question answer */
export declare const CascadingRefDisplayComponent: (props: {
    question: any;
    value: CascadingRefAnswerValue;
    locale: string;
    schema: Schema;
    /** Get a specific row of a custom table */
    getCustomTableRow: (tableId: string, rowId: string) => Promise<Row | null>;
}) => JSX.Element | null;
