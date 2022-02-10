import PropTypes from "prop-types";
import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
export interface AquagenxCBTPopupComponentProps {
    value?: any;
    questionId: string;
    onSave: any;
    onClose: any;
}
interface AquagenxCBTPopupComponentState {
    value: any;
}
export default class AquagenxCBTPopupComponent extends React.Component<AquagenxCBTPopupComponentProps, AquagenxCBTPopupComponentState> {
    static contextTypes: {
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    componentDidMount(): any;
    handleCompartmentClick(compartmentField: any): void;
    handleSaveClick: () => any;
    renderStyle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderInfo(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent>;
}
export {};
