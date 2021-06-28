import React from "react";
import "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js";
import "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css";
interface DateTimePickerComponentProps {
    /** date format */
    format?: string;
    /** do we need time picker?  (Only useful if format is not set) */
    timepicker?: boolean;
    /** Show the today button */
    showTodayButton?: boolean;
    /** Show the clear button */
    showClear?: boolean;
    /** callback on date change (argument: moment date) */
    onChange?: any;
    /** date as moment */
    date?: any;
    /** default date as moment */
    defaultDate?: any;
}
export default class DateTimePickerComponent extends React.Component<DateTimePickerComponentProps> {
    static initClass(): void;
    onChange: (event: any) => any;
    componentDidMount(): any;
    componentWillUnmount(): any;
    destroyNativeComponent(): any;
    createNativeComponent(props: any): any;
    componentWillReceiveProps(nextProps: any): any;
    handleInputFocus: () => any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        ref: (c: HTMLElement | null) => HTMLElement | null;
    }, HTMLElement>;
}
export {};
