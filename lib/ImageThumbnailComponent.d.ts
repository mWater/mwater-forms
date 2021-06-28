import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface ImageThumbnailComponentProps {
    imageManager: any;
    imageId: string;
    onClick?: any;
}
export default class ImageThumbnailComponent extends AsyncLoadComponent<ImageThumbnailComponentProps> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    handleError: () => any;
    render(): React.DetailedReactHTMLElement<{
        src: any;
        style: {
            maxHeight: number;
        };
        className: string;
        onClick: any;
        onError: () => any;
    }, HTMLElement>;
}
export {};
