import PropTypes from "prop-types";
import React from "react";
interface SiteColumnAnswerComponentProps {
    value?: any;
    onValueChange: any;
    siteType: string;
}
export default class SiteColumnAnswerComponent extends React.Component<SiteColumnAnswerComponentProps> {
    static contextTypes: {
        selectEntity: PropTypes.Requireable<(...args: any[]) => any>;
        getEntityById: PropTypes.Validator<(...args: any[]) => any>;
        getEntityByCode: PropTypes.Validator<(...args: any[]) => any>;
        renderEntityListItemView: PropTypes.Validator<(...args: any[]) => any>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    handleSelectClick: () => any;
    handleClearClick: () => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
        onClick: () => any;
    }, HTMLElement>;
}
export {};
