import PropTypes from "prop-types";
import React from "react";
import * as ui from "react-library/lib/bootstrap";
export interface UnitsAnswerComponentProps {
    answer: any;
    onValueChange: any;
    units: any;
    defaultUnits?: string;
    prefix: boolean;
    decimal: boolean;
    onNextOrComments?: (ev: any) => void;
}
interface UnitsAnswerComponentState {
    selectedUnits: any;
    quantity: any;
}
export default class UnitsAnswerComponent extends React.Component<UnitsAnswerComponentProps, UnitsAnswerComponentState> {
    static contextTypes: {
        locale: PropTypes.Requireable<string>;
    };
    units: HTMLSelectElement | null;
    quantity: ui.NumberInput | null;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    focus(): void;
    handleKeyDown: (ev: any) => any;
    handleInternalNext: (ev: any) => any;
    handleValueChange: (val: any) => any;
    handleUnitChange: (val: any) => any;
    changed(quantity: any, unit: any): any;
    getSelectedUnit(answer: any): any;
    getSelectedQuantity(answer: any): any;
    createNumberInput(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
