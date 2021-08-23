import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
interface ImageUploaderModalComponentProps {
    apiUrl: string;
    client?: string;
    onCancel: any;
    /** Called with id of image */
    onSuccess: any;
    /** Localizer to use */
    T: any;
    forceCamera?: boolean;
}
interface ImageUploaderModalComponentState {
    id: any;
    xhr: any;
    percentComplete: any;
}
export default class ImageUploaderModalComponent extends React.Component<ImageUploaderModalComponentProps, ImageUploaderModalComponentState> {
    static show: (apiUrl: any, client: any, T: any, success: any, forceCamera: any) => Element;
    constructor(props: any);
    handleUploadProgress: (evt: any) => void;
    handleUploadComplete: (evt: any) => any;
    handleUploadFailed: (evt: any) => any;
    handleUploadCanceled: (evt: any) => any;
    handleCancel: () => any;
    handleFileSelected: (ev: any) => void;
    renderContents(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.CElement<any, ModalPopupComponent>;
}
export {};
