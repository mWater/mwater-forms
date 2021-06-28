import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface RotationAwareImageComponentProps {
    image: any;
    imageManager: any;
    thumbnail?: boolean;
    height?: number;
    onClick?: any;
}
export default class RotationAwareImageComponent extends AsyncLoadComponent<RotationAwareImageComponentProps> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): any;
    render(): React.ReactElement<{
        ref: (c: Element | null) => Element | null;
        className: any;
        style: {};
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> | null;
}
export {};
