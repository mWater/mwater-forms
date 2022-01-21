import React from "react";
import { Moment } from "moment";
import { TempusDominus } from "@eonasdan/tempus-dominus";
import "@eonasdan/tempus-dominus/dist/css/tempus-dominus.css";
export interface DateTimePickerComponentProps {
    /** date format. */
    format?: string;
    /** True to show timepicker. Only if no format */
    timepicker?: boolean;
    /** Show the today button */
    showTodayButton?: boolean;
    /** Show the clear button */
    showClear: boolean;
    /** callback on date change (argument: moment date) */
    onChange: (date: Moment | null) => void;
    /** date as moment */
    date?: Moment | null;
    placeholder?: string;
}
export default class DateTimePickerComponent extends React.Component<DateTimePickerComponentProps> {
    static defaultProps: {
        timepicker: boolean;
    };
    control: TempusDominus;
    textRef: HTMLInputElement | null;
    getFormat(): string;
    componentDidUpdate(prevProps: DateTimePickerComponentProps): void;
    inputRef: (elem: HTMLDivElement | null) => void;
    render(): JSX.Element;
}
