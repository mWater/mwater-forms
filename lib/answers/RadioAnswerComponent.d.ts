import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
export interface RadioAnswerComponentProps {
    choices: Choice[];
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
    displayMode?: "vertical" | "toggle";
}
export default class RadioAnswerComponent extends React.Component<RadioAnswerComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    focus(): null;
    handleValueChange: (choice: Choice) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    renderSpecify(choice: Choice): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement>;
    isChoiceVisible(choice: Choice): boolean;
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
