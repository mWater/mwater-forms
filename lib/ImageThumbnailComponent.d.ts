import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
import { ImageManager } from "./formContext";
export interface ImageThumbnailComponentProps {
    imageManager: ImageManager;
    imageId: string;
    onClick?: () => void;
}
export default class ImageThumbnailComponent extends AsyncLoadComponent<ImageThumbnailComponentProps, {
    loading: boolean;
    error?: boolean;
    url?: string;
}> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    handleError: () => void;
    render(): React.DetailedReactHTMLElement<{
        src: string | undefined;
        style: {
            maxHeight: number;
        };
        className: string;
        onClick: (() => void) | undefined;
        onError: () => void;
    }, HTMLElement>;
}
