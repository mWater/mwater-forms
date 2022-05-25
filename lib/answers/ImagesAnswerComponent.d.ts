import PropTypes from "prop-types";
import React from "react";
import { Image } from "../RotationAwareImageComponent";
import ImagePopupComponent from "../ImagePopupComponent";
export interface ImagesAnswerComponentProps {
    /** array of { id: someid, caption: caption, cover: true/false } */
    imagelist?: Image[];
    /** Called when image list changed */
    onImagelistChange?: any;
    consentPrompt?: string;
}
interface ImagesAnswerComponentState {
    modalImageId: any;
}
export default class ImagesAnswerComponent extends React.Component<ImagesAnswerComponentProps, ImagesAnswerComponentState> {
    static contextTypes: {
        imageManager: PropTypes.Validator<object>;
        imageAcquirer: PropTypes.Requireable<object>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    focus(): null;
    handleAdd: () => any;
    handleClickImage: (id: any) => void;
    renderModal(): React.CElement<import("../ImagePopupComponent").ImagePopupComponentProps, ImagePopupComponent> | null;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
