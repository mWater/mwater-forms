import React from "react";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
import { Image } from "./RotationAwareImageComponent";
import { ImageManager } from "./formContext";
import { LocalizeString } from "ez-localize";
export interface ImagePopupComponentProps {
    imageManager: ImageManager;
    /** The image object */
    image: Image;
    onRemove?: any;
    onSetCover?: any;
    onRotate?: any;
    onClose: any;
    T: LocalizeString;
}
/** Displays an image in a popup and allows removing or setting as cover image */
export default class ImagePopupComponent extends AsyncLoadComponent<ImagePopupComponentProps, {
    loading: boolean;
    url?: string;
    error?: boolean;
}> {
    isLoadNeeded(newProps: ImagePopupComponentProps, oldProps: ImagePopupComponentProps): boolean;
    load(props: ImagePopupComponentProps, prevProps: ImagePopupComponentProps, callback: any): void;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement> | React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent>;
}
