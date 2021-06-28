import React from "react";
interface BarcodeAnswerComponentProps {
    value?: string;
    onValueChange: any;
}
export default class BarcodeAnswerComponent extends React.Component<BarcodeAnswerComponentProps> {
    static initClass(): void;
    focus(): null;
    handleValueChange: () => any;
    handleScanClick: () => any;
    handleClearClick: () => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
