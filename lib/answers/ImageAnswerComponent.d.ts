import PropTypes from "prop-types";
import React from "react";
import ImagePopupComponent from "../ImagePopupComponent";
export interface ImageAnswerComponentProps {
    /** e.g. { id: someid, caption: caption } */
    image?: any;
    /** Called when image changed */
    onImageChange?: any;
    consentPrompt?: string;
}
interface ImageAnswerComponentState {
    modalOpen: any;
}
export default class ImageAnswerComponent extends React.Component<ImageAnswerComponentProps, ImageAnswerComponentState> {
    static contextTypes: {
        imageManager: PropTypes.Validator<object>;
        imageAcquirer: PropTypes.Requireable<object>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    focus(): null;
    handleClickImage: () => void;
    handleAdd: () => any;
    renderModal(): React.CElement<import("../ImagePopupComponent").ImagePopupComponentProps, ImagePopupComponent> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
