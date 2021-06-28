import React from "react";
interface TextListAnswerComponentProps {
    value?: any;
    onValueChange: any;
    onNextOrComments?: any;
}
export default class TextListAnswerComponent extends React.Component<TextListAnswerComponentProps> {
    focus(): any;
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
export {};
