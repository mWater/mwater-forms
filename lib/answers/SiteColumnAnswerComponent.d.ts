import React from "react";
interface SiteColumnAnswerComponentProps {
    value?: any;
    onValueChange: any;
    siteType: string;
}
export default class SiteColumnAnswerComponent extends React.Component<SiteColumnAnswerComponentProps> {
    static initClass(): void;
    handleSelectClick: () => any;
    handleClearClick: () => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
        onClick: () => any;
    }, HTMLElement>;
}
export {};
