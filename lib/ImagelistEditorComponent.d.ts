import React from "react";
import ImagesAnswerComponent from "./answers/ImagesAnswerComponent";
interface ImagelistEditorComponentProps {
    imageManager: any;
    imageAcquirer?: any;
    /** e.g. [{ id: someid, caption: caption }] */
    imagelist?: any;
    /** Called when image list changed */
    onImagelistChange?: any;
    /** Localizer to use */
    T: any;
    /** Question to prompt for consent */
    consentPrompt?: string;
}
export default class ImagelistEditorComponent extends React.Component<ImagelistEditorComponentProps> {
    static initClass(): void;
    getChildContext(): {
        imageManager: any;
        imageAcquirer: any;
        T: any;
    };
    render(): React.CElement<any, ImagesAnswerComponent>;
}
export {};
