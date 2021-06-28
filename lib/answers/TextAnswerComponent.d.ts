import React from "react";
interface TextAnswerComponentProps {
    value?: string;
    format: string;
    readOnly?: boolean;
    onValueChange: any;
    onNextOrComments?: any;
}
interface TextAnswerComponentState {
    text: any;
}
export default class TextAnswerComponent extends React.Component<TextAnswerComponentProps, TextAnswerComponentState> {
    static initClass(): void;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    focus(): any;
    handleKeyDown: (ev: any) => any;
    handleBlur: (ev: any) => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        id: string;
        ref: (c: HTMLElement | null) => HTMLElement | null;
        value: any;
        rows: string;
        readOnly: boolean | undefined;
        onBlur: (ev: any) => any;
        onChange: (ev: React.FormEvent<HTMLElement>) => void;
    }, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
        id: string;
        ref: (c: HTMLElement | null) => HTMLElement | null;
        type: string;
        value: any;
        readOnly: boolean | undefined;
        onKeyDown: (ev: any) => any;
        onBlur: (ev: any) => any;
        onChange: (ev: React.FormEvent<HTMLElement>) => void;
    }, HTMLElement>;
}
export {};
