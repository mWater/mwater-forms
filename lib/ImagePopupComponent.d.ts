import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface ImagePopupComponentProps {
    imageManager: any;
    /** The image object */
    image: any;
    onRemove?: any;
    onSetCover?: any;
    onRotate?: any;
    onClose: any;
    T: any;
}
export default class ImagePopupComponent extends AsyncLoadComponent<ImagePopupComponentProps> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | React.CElement<{
        header?: React.ReactNode;
        footer?: React.ReactNode;
        size?: "small" | "normal" | "full" | "large" | undefined;
        width?: number | undefined;
        showCloseX?: boolean | undefined;
        onClose?: (() => void) | undefined;
    }, ModalPopupComponent>;
}
export {};
