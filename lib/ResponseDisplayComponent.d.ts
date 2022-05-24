/// <reference types="jquery" />
import React from "react";
import ezlocalize from "ez-localize";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
export interface ResponseDisplayComponentProps {
    form: any;
    response: any;
    /** Schema including the form */
    schema: any;
    formCtx: any;
    apiUrl?: string;
    /** Defaults to english */
    locale?: string;
    /** Current login (contains user, username, groups) */
    login?: any;
    /** True to display complete history always */
    forceCompleteHistory?: boolean;
}
interface ResponseDisplayComponentState {
    T: any;
    eventsUsernames: any;
    loadingUsernames: any;
    showCompleteHistory: any;
    history: any;
    showArchive: any;
    showPrevAnswers: any;
}
export default class ResponseDisplayComponent extends React.Component<ResponseDisplayComponentProps, ResponseDisplayComponentState> {
    static childContextTypes: {};
    constructor(props: any);
    componentWillMount(): JQuery.jqXHR<any> | undefined;
    componentDidMount(): JQuery.jqXHR<any>;
    loadHistory(props: any): JQuery.jqXHR<any>;
    loadEventUsernames(events: any): JQuery.jqXHR<any> | undefined;
    componentWillReceiveProps(nextProps: any): any;
    getChildContext(): {};
    createLocalizer(design: any, locale: any): ezlocalize.LocalizeString;
    handleHideHistory: () => void;
    handleShowHistory: () => void;
    renderEvent(ev: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | null;
    renderHistory(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderStatus(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderArchives(): React.CElement<import("react-library/lib/ModalPopupComponent").ModalPopupComponentProps, ModalPopupComponent> | null;
    renderHeader(): React.DetailedReactHTMLElement<{
        style: {
            paddingBottom: number;
        };
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
