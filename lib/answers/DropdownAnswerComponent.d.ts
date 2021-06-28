import React from "react";
interface DropdownAnswerComponentProps {
    choices: any;
    onAnswerChange: any;
    /** See answer format */
    answer: any;
    data: any;
}
export default class DropdownAnswerComponent extends React.Component<DropdownAnswerComponentProps> {
    static initClass(): void;
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
export {};
