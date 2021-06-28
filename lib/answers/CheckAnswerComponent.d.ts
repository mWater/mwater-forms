import React from "react";
interface CheckAnswerComponentProps {
    value?: boolean;
    onValueChange: any;
    label: any;
}
export default class CheckAnswerComponent extends React.Component<CheckAnswerComponentProps> {
    static initClass(): void;
    focus(): any;
    handleValueChange: () => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        onClick: () => any;
        ref: (c: HTMLElement | null) => HTMLElement | null;
    }, HTMLElement>;
}
export {};
