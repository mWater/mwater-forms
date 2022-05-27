/// <reference types="jquery" />
import React from "react";
import ezlocalize from "ez-localize";
import ModalPopupComponent from "react-library/lib/ModalPopupComponent";
import { Form } from "./form";
import { Response } from "./response";
import { Schema } from "mwater-expressions";
import { FormContext } from "./formContext";
export interface ResponseDisplayComponentProps {
    form: Form;
    response: Response;
    /** Schema including the form */
    schema: Schema;
    formCtx: FormContext;
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
    loadingHistory: boolean;
}
export default class ResponseDisplayComponent extends React.Component<ResponseDisplayComponentProps, ResponseDisplayComponentState> {
    static childContextTypes: {};
    constructor(props: ResponseDisplayComponentProps);
    componentWillMount(): void;
    componentDidMount(): JQuery.jqXHR<any>;
    loadHistory(props: ResponseDisplayComponentProps): JQuery.jqXHR<any>;
    loadEventUsernames(events: any): void;
    componentWillReceiveProps(nextProps: any): import("./response").ResponseEvent[];
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
