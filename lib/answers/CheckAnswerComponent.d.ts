import React from "react";
export interface CheckAnswerComponentProps {
    value?: boolean;
    onValueChange: any;
}
export default class CheckAnswerComponent extends React.Component<CheckAnswerComponentProps> {
    static defaultProps: {
        value: boolean;
    };
    checkbox: HTMLElement | null;
    focus(): void | undefined;
    handleValueChange: () => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        onClick: () => any;
        ref: (c: HTMLElement | null) => void;
    }, HTMLElement>;
}
