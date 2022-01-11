import { CascadingListAnswerValue } from "../response";
import React from "react";
import { CascadingListRow, CascadingListColumn } from "../formDesign";
/** Localizes strings. Must be called as T("some string") or someThing.T("some string") */
declare type LocalizeString = (str: string, ...args: any[]) => string;
export interface Props {
    /** Rows in the list to choose from */
    rows: CascadingListRow[];
    /** Columns in the table that are displayed also as dropdowns to choose the row */
    columns: CascadingListColumn[];
    value?: CascadingListAnswerValue;
    onValueChange: (value?: CascadingListAnswerValue) => void;
    /** True to sort options alphabetically */
    sortOptions?: boolean;
    /** Localizer to use */
    T: LocalizeString;
    /** Locale to use */
    locale: string;
    /** True if an alternate is selected. Resets editing mode */
    alternateSelected?: boolean;
}
interface State {
    /** Values of columns as they are selected */
    columnValues: (string | null)[];
    /** True if editing the value. Ignores changes to the value and prevents saving */
    editing: boolean;
}
export declare class CascadingListAnswerComponent extends React.Component<Props, State> {
    constructor(props: Props);
    /** Validate the component */
    validate(): string | boolean | null;
    componentDidUpdate(): void;
    /** Handle change to a dropdown */
    handleChange: (index: number, value: string | null) => void;
    /** Reset control */
    handleReset: () => void;
    /** Find values of a particular dropdown filtering by all previous selections */
    findValues(index: number, columnValues: Array<string | null>): string[];
    renderDropdown(index: number): JSX.Element;
    render(): JSX.Element;
}
export {};
