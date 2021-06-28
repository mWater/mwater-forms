import React from "react";
interface MulticheckAnswerComponentProps {
    choices: any;
    /** See answer format */
    answer: any;
    onAnswerChange: any;
    data: any;
}
export default class MulticheckAnswerComponent extends React.Component<MulticheckAnswerComponentProps> {
    static initClass(): void;
    focus(): null;
    handleValueChange: (choice: any) => any;
    handleSpecifyChange: (id: any, ev: any) => any;
    areConditionsValid(choice: any): boolean;
    renderSpecify(choice: any): React.DetailedReactHTMLElement<{
        className: string;
        type: string;
        value: any;
        onChange: any;
    }, HTMLElement>;
    renderChoice(choice: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
