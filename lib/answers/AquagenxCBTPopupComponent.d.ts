import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
interface AquagenxCBTPopupComponentProps {
    value?: any;
    questionId: string;
    onSave: any;
    onClose: any;
}
interface AquagenxCBTPopupComponentState {
    value: any;
}
export default class AquagenxCBTPopupComponent extends React.Component<AquagenxCBTPopupComponentProps, AquagenxCBTPopupComponentState> {
    static initClass(): void;
    constructor(props: any);
    componentDidMount(): any;
    handleCompartmentClick(compartmentField: any): void;
    handleSaveClick: () => any;
    renderStyle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderInfo(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.CElement<{
        header?: React.ReactNode;
        footer?: React.ReactNode;
        size?: "small" | "normal" | "full" | "large" | undefined;
        width?: number | undefined;
        showCloseX?: boolean | undefined;
        onClose?: (() => void) | undefined;
    }, ModalPopupComponent>;
}
export {};
