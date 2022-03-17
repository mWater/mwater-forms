import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
export interface MulticheckAnswerComponentProps {
    choices: Choice[];
    /** See answer format */
    answer: any;
    onAnswerChange: any;
    data: any;
}
export default class MulticheckAnswerComponent extends React.Component<MulticheckAnswerComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    focus(): null;
    handleValueChange: (choice: Choice) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    isChoiceVisible(choice: Choice): boolean;
    renderSpecify(choice: Choice): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement>;
    renderChoice(choice: Choice): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
