import React from "react";
interface SiteAnswerComponentProps {
    value?: any;
    onValueChange: any;
    siteTypes?: any;
}
interface SiteAnswerComponentState {
    text: any;
}
export default class SiteAnswerComponent extends React.Component<SiteAnswerComponentProps, SiteAnswerComponentState> {
    static initClass(): void;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    focus(): any;
    handleKeyDown: (ev: any) => any;
    getEntityType(): any;
    handleSelectClick: () => any;
    handleChange: (ev: any) => void;
    handleBlur: (ev: any) => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
