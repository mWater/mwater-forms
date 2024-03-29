import React from "react";
import { CascadingRefAnswerValue } from "../response";
import { CascadingRefQuestion } from "../formDesign";
import { Row, Schema } from "mwater-expressions";
/** Localizes strings. Must be called as T("some string") or someThing.T("some string") */
declare type LocalizeString = (str: string, ...args: any[]) => string;
export interface Props {
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
    /** True if an alternate is selected. Resets editing mode */
    alternateSelected?: boolean;
}
interface State {
    /** Rows of the table */
    rows?: Row[];
    /** Values of dropdowns as they are selected */
    dropdownValues?: (string | null)[];
    /** True if editing the value. Ignores changes to the value and prevents saving */
    editing: boolean;
    /** Error object if problem loading the rows */
    error?: string;
}
/** Cascading selection of a row from a table.
 * Special handling of null (arrives as undefined) values in table: they are converted to ""
 */
export declare class CascadingRefAnswerComponent extends React.Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
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
