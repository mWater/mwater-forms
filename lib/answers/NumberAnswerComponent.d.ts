import React from "react";
import * as ui from "react-library/lib/bootstrap";
export interface NumberAnswerComponentProps {
    decimal: boolean;
    value?: number;
    onChange?: any;
    /** Will be merged with style of input box */
    style?: any;
    /** True to render with input-sm */
    small?: boolean;
    onNextOrComments?: (ev: any) => void;
}
export default class NumberAnswerComponent extends React.Component<NumberAnswerComponentProps> {
    input: ui.NumberInput | null;
    focus(): void | undefined;
    validate(): "Invalid number" | null;
    render(): React.CElement<ui.NumberInputProps, ui.NumberInput>;
}
