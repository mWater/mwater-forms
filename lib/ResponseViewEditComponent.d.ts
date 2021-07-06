import React from "react";
import ResponseModel from "./ResponseModel";
interface ResponseViewEditComponentProps {
    /** Form to use */
    form: any;
    /** FormContext */
    formCtx: any;
    /** Response object */
    response: any;
    /** Current login (contains user, username, groups) */
    login?: any;
    /** api url to use e.g. https://api.mwater.co/v3/ */
    apiUrl: string;
    /** Called when response is updated with new response */
    onUpdateResponse: any;
    /** Called when response is removed */
    onDeleteResponse: any;
    /** Schema, including the form */
    schema: any;
    /** The locale to display the response in */
    locale?: string;
    T: any;
}
interface ResponseViewEditComponentState {
    locale: any;
    unsavedData: any;
    editMode: any;
}
export default class ResponseViewEditComponent extends React.Component<ResponseViewEditComponentProps, ResponseViewEditComponentState> {
    constructor(props: any);
    createResponseModel(response: any): ResponseModel;
    handleApprove: () => any;
    handleReject: () => any;
    handleUnreject: () => any;
    handleDelete: () => any;
    handleDataChange: (data: any) => void;
    handleDiscard: () => void;
    handleSaveLater: () => void;
    handleEdit: () => void;
    handleLocaleChange: (ev: any) => void;
    handleSubmit: () => any;
    renderLocales(): React.DetailedReactHTMLElement<{
        className: string;
        style: {
            width: string;
            float: "right";
            margin: number;
        };
        onChange: (ev: any) => void;
        value: any;
    }, HTMLElement> | null;
    renderOperations(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
