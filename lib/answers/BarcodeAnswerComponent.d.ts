import PropTypes from "prop-types";
import React from "react";
export interface BarcodeAnswerComponentProps {
    value?: string;
    onValueChange: any;
}
export default class BarcodeAnswerComponent extends React.Component<BarcodeAnswerComponentProps> {
    static contextTypes: {
        scanBarcode: PropTypes.Requireable<(...args: any[]) => any>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    focus(): null;
    handleValueChange: () => any;
    handleScanClick: () => any;
    handleClearClick: () => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
