import React from "react";
export interface DateAnswerComponentProps {
    value?: string;
    onValueChange: any;
    format?: string;
    placeholder?: string;
    onNextOrComments?: any;
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
    constructor(props: any);
    componentWillReceiveProps: (nextProps: any) => void | {
        detailLevel: number;
        isoFormat: string | null;
        placeholder: any;
    };
    updateState: (props: any) => void | {
        detailLevel: number;
        isoFormat: string | null;
        placeholder: any;
    };
    focus(): any;
    handleKeyDown: (ev: any) => any;
    handleChange: (date: any) => any;
    render(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}
export {};
