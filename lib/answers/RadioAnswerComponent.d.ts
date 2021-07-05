import PropTypes from "prop-types";
import React from "react";
interface RadioAnswerComponentProps {
    choices: any;
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
}
export default class RadioAnswerComponent extends React.Component<RadioAnswerComponentProps> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    focus(): null;
    handleValueChange: (choice: any) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    renderSpecify(choice: any): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement>;
    areConditionsValid(choice: any): boolean;
    renderGeneralSpecify(): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement> | undefined;
    renderVerticalChoice(choice: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    renderAsVertical(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    renderAsToggle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | null;
}
export {};
