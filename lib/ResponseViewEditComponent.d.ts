import React from "react";
import ResponseModel from "./ResponseModel";
import { Response } from './response';
import { Schema } from "mwater-expressions";
import { Form } from "./form";
import { FormContext } from "./formContext";
import { LocalizeString } from "ez-localize";
interface ResponseViewEditComponentProps {
    /** Form to use */
    form: Form;
    /** FormContext */
    formCtx: FormContext;
    /** Response object */
    response: Response;
    /** Current login (contains user, username, groups) */
    login?: {
        client: string;
        user: string;
        username: string;
        groups: string[];
    };
    /** api url to use e.g. https://api.mwater.co/v3/ */
    apiUrl: string;
    /** Called when response is updated with new response */
    onUpdateResponse: (response: Response) => void;
    /** Called when response is removed */
    onDeleteResponse: () => void;
    /** Schema, including the form */
    schema: Schema;
    /** The locale to display the response in */
    locale?: string;
    /** Localizer to use */
    T: LocalizeString;
}
interface ResponseViewEditComponentState {
    locale: string;
    unsavedData: any;
    editMode: boolean;
}
export default class ResponseViewEditComponent extends React.Component<ResponseViewEditComponentProps, ResponseViewEditComponentState> {
    constructor(props: any);
    createResponseModel(response: any): ResponseModel;
    handleApprove: () => void;
    handleReject: () => void;
    handleUnreject: () => void;
    handleDelete: () => void;
    handleDataChange: (data: any) => void;
    handleDiscard: () => void;
    handleSaveLater: () => void;
    handleEdit: () => void;
    handleLocaleChange: (ev: any) => void;
    handleSubmit: () => void;
    renderLocales(): React.DetailedReactHTMLElement<{
        className: string;
        style: {
            width: string;
            float: "right";
            margin: number;
        };
        onChange: (ev: any) => void;
        value: string;
    }, HTMLElement> | null;
    renderOperations(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
