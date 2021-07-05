import PropTypes from "prop-types";
import React from "react";
import ImageAnswerComponent from "./answers/ImageAnswerComponent";
interface ImageEditorComponentProps {
    imageManager: any;
    imageAcquirer?: any;
    /** e.g. { id: someid, caption: caption } */
    image?: any;
    /** Called when image changed */
    onImageChange?: any;
    /** Localizer to use */
    T: any;
    /** Question to prompt for consent */
    consentPrompt?: string;
}
export default class ImageEditorComponent extends React.Component<ImageEditorComponentProps> {
    static childContextTypes: {
        imageManager: PropTypes.Validator<object>;
        imageAcquirer: PropTypes.Requireable<object>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    getChildContext(): {
        imageManager: any;
        imageAcquirer: any;
        T: any;
    };
    render(): React.CElement<any, ImageAnswerComponent>;
}
export {};
