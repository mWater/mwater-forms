import PropTypes from "prop-types";
import React from "react";
import { Choice } from "../formDesign";
export interface LikertAnswerComponentProps {
    choices: Choice[];
    items: Choice[];
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
}
export default class LikertAnswerComponent extends React.Component<LikertAnswerComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    focus(): null;
    handleValueChange: (choice: Choice, item: any) => any;
    renderChoice(item: Choice, choice: Choice): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderItem(item: Choice): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        style: {
            width: string;
        };
    }, HTMLElement>;
}
