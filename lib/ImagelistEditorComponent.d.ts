import PropTypes from "prop-types";
import React from "react";
import ImagesAnswerComponent from "./answers/ImagesAnswerComponent";
import { ImageAcquirer, ImageManager } from "./formContext";
import { ImageAnswerValue } from "./response";
export interface ImagelistEditorComponentProps {
    imageManager: ImageManager;
    imageAcquirer?: ImageAcquirer;
    imagelist?: ImageAnswerValue[] | null;
    /** Called when image changed */
    onImagelistChange?: (image: ImageAnswerValue[] | null) => void;
    /** Localizer to use */
    T: (str: string, ...args: any[]) => string;
    /** Question to prompt for consent */
    consentPrompt?: string;
}
export default class ImagelistEditorComponent extends React.Component<ImagelistEditorComponentProps> {
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
    render(): React.CElement<any, ImagesAnswerComponent>;
}
