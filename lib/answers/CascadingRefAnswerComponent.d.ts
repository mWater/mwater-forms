import React from "react";
import { CascadingRefAnswerValue } from "../response";
import { CascadingRefQuestion } from "../formDesign";
import { Row, Schema } from "mwater-expressions";
/** Localizes strings. Must be called as T("some string") or someThing.T("some string") */
declare type LocalizeString = (str: string, ...args: any[]) => string;
interface Props {
    question: CascadingRefQuestion;
    value?: CascadingRefAnswerValue;
    onValueChange: (value?: CascadingRefAnswerValue) => void;
    /** Schema which includes the custom tableset */
    schema: Schema;
    /** Localizer to use */
    T: LocalizeString;
    /** Locale to use */
    locale: string;
    /** Get all rows of a custom table
     * @param tableId table id e.g. custom.abc.xyz
     */
    getCustomTableRows: (tableId: string) => Promise<Row[]>;
}
interface State {
    /** Rows of the table */
    rows?: Row[];
    /** Values of dropdowns as they are selected */
    dropdownValues?: (string | null)[];
    /** True if editing the value. Ignores changes to the value and prevents saving */
    editing: boolean;
}
export declare class CascadingRefAnswerComponent extends React.Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    /** Validate the component */
    validate(): string | boolean | null;
    /** Handle change to a dropdown */
    handleChange: (index: number, value: string | null) => void;
    /** Reset control */
    handleReset: () => void;
    /** Find values of a particular dropdown filtering by all previous selections */
    findValues(index: number, dropdownValues: Array<string | null>): string[];
    renderDropdown(index: number): JSX.Element;
    render(): JSX.Element;
}
export {};
