import React from "react";
import ui from "react-library/lib/bootstrap";
interface NumberAnswerComponentProps {
    decimal: boolean;
    value?: number;
    onChange?: any;
    /** Will be merged with style of input box */
    style?: any;
    /** True to render with input-sm */
    small?: boolean;
    onNextOrComments?: any;
}
export default class NumberAnswerComponent extends React.Component<NumberAnswerComponentProps> {
    focus(): any;
    validate(): "Invalid number" | null;
    render(): React.CElement<{
        decimal: boolean;
        value?: number | null | undefined;
        onChange?: ((value: number | null) => void) | undefined;
        style?: object | undefined;
        size?: "sm" | "lg" | undefined;
        onTab?: (() => void) | undefined;
        onEnter?: (() => void) | undefined;
        decimalPlaces?: number | undefined;
        placeholder?: string | undefined;
    }, ui.NumberInput>;
}
export {};
