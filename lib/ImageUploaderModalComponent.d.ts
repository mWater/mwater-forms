import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
export interface ImageUploaderModalComponentProps {
    apiUrl: string;
    client: string | null;
    onCancel: () => void;
    /** Called with id of image */
    onSuccess: (id: string) => void;
    /** Localizer to use */
    T: (str: string, ...args: any[]) => string;
    /** True to force use of camera */
    forceCamera?: boolean;
}
interface ImageUploaderModalComponentState {
    id: any;
    xhr: any;
    percentComplete: any;
}
export default class ImageUploaderModalComponent extends React.Component<ImageUploaderModalComponentProps, ImageUploaderModalComponentState> {
    /** Static function to show modal easily */
    static show(apiUrl: string, client: string | null, T: (str: string, ...args: any[]) => string, success: (id: string) => void, forceCamera?: boolean): void;
    constructor(props: ImageUploaderModalComponentProps);
    handleUploadProgress: (evt: any) => void;
    handleUploadComplete: (evt: any) => void;
    handleUploadFailed: (evt: any) => void;
    handleUploadCanceled: (evt: any) => void;
    handleCancel: () => any;
    handleFileSelected: (ev: any) => void;
    renderContents(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    render(): React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent>;
}
export {};
