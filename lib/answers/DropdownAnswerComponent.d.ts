import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
import { Schema } from "mwater-expressions";
import ResponseRow from "../ResponseRow";
export interface DropdownAnswerComponentProps {
    choices: Choice[];
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
    schema: Schema;
    responseRow: ResponseRow;
}
export interface DropdownAnswerComponentState {
    /** Status of visibility of choices */
    choiceVisibility: {
        [choiceId: string]: boolean;
    };
}
export default class DropdownAnswerComponent extends React.Component<DropdownAnswerComponentProps, DropdownAnswerComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    select: HTMLSelectElement | null;
    constructor(props: DropdownAnswerComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: DropdownAnswerComponentProps): void;
    calculateChoiceVisibility(): Promise<void>;
    focus(): void | undefined;
    handleValueChange: (ev: any) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    renderSpecify(): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
