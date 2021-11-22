import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
import { ImageManager } from "./formContext";
export interface Image {
    /** UUID of image */
    id: string;
    /** Optional clockwise rotation (0, 90, 180, 270) */
    rotation?: number;
    /** Optional caption */
    caption?: string;
    /** If part of an image set, true if cover image */
    cover?: boolean;
}
interface RotationAwareImageComponentProps {
    image: Image;
    imageManager: ImageManager;
    /** True to use thumbnail (max 160 height) */
    thumbnail?: boolean;
    /** Optional width */
    width?: number;
    /** Optional height */
    height?: number;
    /** Called when clicked */
    onClick?: () => void;
}
/** Displays a single image rotated appropriately */
export default class RotationAwareImageComponent extends AsyncLoadComponent<RotationAwareImageComponentProps, {
    loading: boolean;
    url?: string;
    error: any;
}> {
    parent: HTMLElement | null;
    image: HTMLImageElement | null;
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    render(): React.DetailedReactHTMLElement<{
        ref: (c: HTMLElement | null) => void;
        className: any;
        style: React.CSSProperties;
    }, HTMLElement> | null;
}
export {};
