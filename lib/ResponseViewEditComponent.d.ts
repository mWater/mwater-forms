import React from "react";
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
    createResponseModel(response: any): {
        draft(deploymentId: any): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        redraft(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        listEnumeratorDeployments(): unknown[];
        saveForLater(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        submit(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        canSubmit(): boolean;
        approve(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        reject(message: any): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        recordEdit(): any;
        _finalize(): string;
        _unfinalize(): void;
        updateEntities(): ({
            question: any;
            entityType: any;
            property: string;
            value: any;
            roster?: undefined;
        } | {
            question: any;
            roster: any;
            entityType: any;
            property: string;
            value: any;
        })[];
        fixRoles(): any;
        canApprove(): boolean;
        amApprover(): boolean;
        canDelete(): boolean;
        canEdit(): boolean;
        canRedraft(): any;
        canReject(): boolean | undefined;
        _addEvent(type: any, attrs?: {}): any;
    };
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
