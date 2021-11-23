import React from "react";
export interface ImageDisplayComponentProps {
    /** Image object to display */
    image: any;
    imageManager: any;
    T: any;
}
interface ImageDisplayComponentState {
    error: any;
    url: any;
    popup: any;
}
export default class ImageDisplayComponent extends React.Component<ImageDisplayComponentProps, ImageDisplayComponentState> {
    constructor(props: any);
    componentDidMount(): any;
    componentWillReceiveProps(newProps: any): any;
    update(props: any): any;
    handleImgError: () => void;
    handleImgClick: () => void;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
