import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
export interface ImagePopupComponentProps {
    imageManager: any;
    /** The image object */
    image: any;
    onRemove?: any;
    onSetCover?: any;
    onRotate?: any;
    onClose: any;
    T: any;
}
export default class ImagePopupComponent extends AsyncLoadComponent<ImagePopupComponentProps, {
    loading: boolean;
    url?: string;
    error?: boolean;
}> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent>;
}
