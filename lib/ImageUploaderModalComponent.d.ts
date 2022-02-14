import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
export interface ImageUploaderModalComponentProps {
    apiUrl: string;
    client?: string;
    onCancel: any;
    /** Called with id of image */
    onSuccess: (id: string) => void;
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
    static show: (apiUrl: string, client: string | null | undefined, T: any, success: (id: string) => void, forceCamera?: boolean | undefined) => void | Element | React.Component<any, any, any>;
    constructor(props: any);
    handleUploadProgress: (evt: any) => void;
    handleUploadComplete: (evt: any) => any;
    handleUploadFailed: (evt: any) => any;
    handleUploadCanceled: (evt: any) => any;
    handleCancel: () => any;
    handleFileSelected: (ev: any) => void;
    renderContents(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent>;
}
export {};
