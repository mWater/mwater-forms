import { LocalizeString } from "ez-localize";
import PropTypes from "prop-types";
import React from "react";
export interface SiteAnswerComponentProps {
    value?: any;
    onValueChange: any;
    siteTypes?: any;
    onNextOrComments?: (ev: any) => void;
    T: LocalizeString;
}
interface SiteAnswerComponentState {
    text: any;
}
export default class SiteAnswerComponent extends React.Component<SiteAnswerComponentProps, SiteAnswerComponentState> {
    static contextTypes: {
        selectEntity: PropTypes.Requireable<(...args: any[]) => any>;
        getEntityById: PropTypes.Validator<(...args: any[]) => any>;
        getEntityByCode: PropTypes.Validator<(...args: any[]) => any>;
        renderEntitySummaryView: PropTypes.Validator<(...args: any[]) => any>;
        T: PropTypes.Validator<(...args: any[]) => any>;
    };
    input: HTMLInputElement | null;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    focus(): void;
    handleKeyDown: (ev: any) => any;
    getEntityType(): any;
    handleSelectClick: () => any;
    handleChange: (ev: any) => void;
    handleBlur: (ev: any) => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
