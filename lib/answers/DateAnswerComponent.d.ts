import React from "react";
import DateTimePickerComponent from "../DateTimePickerComponent";
export interface DateAnswerComponentProps {
    value?: string;
    onValueChange: any;
    format?: string;
    placeholder?: string;
    onNextOrComments?: (ev: any) => void;
}
interface DateAnswerComponentState {
    isoFormat: any;
    detailLevel: any;
    placeholder: any;
}
export default class DateAnswerComponent extends React.Component<DateAnswerComponentProps, DateAnswerComponentState> {
    static defaultProps: {
        format: string;
    };
    datetimepicker: DateTimePickerComponent | null;
    constructor(props: any);
    componentWillReceiveProps: (nextProps: any) => void;
    updateState: (props: any) => void;
    focus(): void;
    handleKeyDown: (ev: any) => any;
    handleChange: (date: any) => any;
    render(): React.DetailedReactHTMLElement<{
        style: {
            maxWidth: string;
        };
    }, HTMLElement>;
}
export {};
