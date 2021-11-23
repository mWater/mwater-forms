import PropTypes from "prop-types";
import React from "react";
import ImageAnswerComponent from "./answers/ImageAnswerComponent";
import { ImageAcquirer, ImageManager } from "./formContext";
import { ImageAnswerValue } from "./response";
export interface ImageEditorComponentProps {
    imageManager: ImageManager;
    imageAcquirer?: ImageAcquirer;
    image?: ImageAnswerValue | null;
    /** Called when image changed */
    onImageChange?: (image: ImageAnswerValue | null) => void;
    /** Localizer to use */
    T: (str: string, ...args: any[]) => string;
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
        imageManager: ImageManager;
        imageAcquirer: ImageAcquirer | undefined;
        T: (str: string, ...args: any[]) => string;
    };
    render(): React.CElement<any, ImageAnswerComponent>;
}
