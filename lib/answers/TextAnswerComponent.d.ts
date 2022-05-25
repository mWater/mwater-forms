import React from "react";
export interface TextAnswerComponentProps {
    value?: string;
    format: string;
    readOnly?: boolean;
    onValueChange: any;
    onNextOrComments?: (ev: any) => void;
}
interface TextAnswerComponentState {
    text: any;
}
export default class TextAnswerComponent extends React.Component<TextAnswerComponentProps, TextAnswerComponentState> {
    static defaultProps: {
        readOnly: boolean;
    };
    input: HTMLTextAreaElement | HTMLInputElement | null;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    focus(): void;
    handleKeyDown: (ev: any) => any;
    handleBlur: (ev: any) => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        id: string;
        ref: (c: HTMLTextAreaElement | null) => void;
        value: any;
        rows: string;
        readOnly: boolean | undefined;
        onBlur: (ev: any) => any;
        onChange: (ev: any) => void;
    }, HTMLTextAreaElement> | React.DetailedReactHTMLElement<{
        className: string;
        id: string;
        ref: (c: HTMLInputElement | null) => void;
        type: string;
        value: any;
        readOnly: boolean | undefined;
        onKeyDown: (ev: any) => any;
        onBlur: (ev: any) => any;
        onChange: (ev: any) => void;
    }, HTMLInputElement>;
}
export {};
