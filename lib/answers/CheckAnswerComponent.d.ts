import React from "react";
export interface CheckAnswerComponentProps {
    value?: boolean;
    onValueChange: any;
    label: any;
}
export default class CheckAnswerComponent extends React.Component<CheckAnswerComponentProps> {
    static defaultProps: {
        value: boolean;
    };
    focus(): any;
    handleValueChange: () => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        onClick: () => any;
        ref: (c: HTMLElement | null) => HTMLElement | null;
    }, HTMLElement>;
}
