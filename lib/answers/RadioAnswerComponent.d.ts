import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
import { Schema } from "mwater-expressions";
import ResponseRow from "../ResponseRow";
export interface RadioAnswerComponentProps {
    choices: Choice[];
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
    displayMode?: "vertical" | "toggle";
    schema: Schema;
    responseRow: ResponseRow;
}
export interface RadioAnswerComponentState {
    /** Status of visibility of choices */
    choiceVisibility: {
        [choiceId: string]: boolean;
    };
}
export default class RadioAnswerComponent extends React.Component<RadioAnswerComponentProps, RadioAnswerComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    constructor(props: RadioAnswerComponentProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: RadioAnswerComponentProps): void;
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
    renderGeneralSpecify(): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement> | null;
    renderVerticalChoice(choice: Choice): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    renderAsVertical(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    renderAsToggle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | null;
}
