import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
import { Schema } from "mwater-expressions";
import ResponseRow from "../ResponseRow";
export interface MulticheckAnswerComponentProps {
    choices: Choice[];
    /** See answer format */
    answer: any;
    onAnswerChange: any;
    data: any;
    schema: Schema;
    responseRow: ResponseRow;
}
export interface MulticheckAnswerComponentState {
    /** Status of visibility of choices */
    choiceVisibility: {
        [choiceId: string]: boolean;
    };
}
export default class MulticheckAnswerComponent extends React.Component<MulticheckAnswerComponentProps, MulticheckAnswerComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    constructor(props: MulticheckAnswerComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: MulticheckAnswerComponentProps): void;
    calculateChoiceVisibility(): Promise<void>;
    focus(): null;
    handleValueChange: (choice: Choice) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    renderSpecify(choice: Choice): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement>;
    renderChoice(choice: Choice): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
