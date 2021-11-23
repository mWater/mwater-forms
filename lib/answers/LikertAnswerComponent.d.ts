import PropTypes from "prop-types";
import React from "react";
export interface LikertAnswerComponentProps {
    choices: any;
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
    handleValueChange: (choice: any, item: any) => any;
    renderChoice(item: any, choice: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderItem(item: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        style: {
            width: string;
        };
    }, HTMLElement>;
}
