import PropTypes from "prop-types";
import React from "react";
export interface DropdownAnswerComponentProps {
    choices: any;
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
}
export default class DropdownAnswerComponent extends React.Component<DropdownAnswerComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    focus(): any;
    handleValueChange: (ev: any) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    renderSpecify(): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement> | undefined;
    areConditionsValid(choice: any): boolean;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
