import React from "react";
export interface TextListAnswerComponentProps {
    value?: any;
    onValueChange: any;
    onNextOrComments?: (ev: any) => void;
}
export default class TextListAnswerComponent extends React.Component<TextListAnswerComponentProps> {
    newLine: HTMLInputElement | null;
    focus(): void | undefined;
    handleChange: (index: any, ev: any) => any;
    handleNewLineChange: (ev: any) => any;
    handleKeydown: (index: any, ev: any) => any;
    handleRemoveClick: (index: any, ev: any) => any;
    render(): React.DetailedReactHTMLElement<{
        style: {
            width: string;
        };
    }, HTMLElement>;
}
