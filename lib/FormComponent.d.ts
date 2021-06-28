import React from "react";
import SectionsComponent from "./SectionsComponent";
import ezlocalize from "ez-localize";
import { default as ResponseRow } from "./ResponseRow";
interface FormComponentProps {
    /** Context to use for form. See docs/FormsContext.md */
    formCtx: any;
    /** Form design. See schema.coffee */
    design: any;
    /** Form response data. See docs/Answer Formats.md */
    data: any;
    /** Called when response data changes */
    onDataChange: any;
    /** Schema to use, including form */
    schema: any;
    /** The current deployment */
    deployment: string;
    /** e.g. "fr" */
    locale?: string;
    /** Called when submit is pressed */
    onSubmit?: any;
    /** Optional save for later */
    onSaveLater?: any;
    /** Called when discard is pressed */
    onDiscard?: any;
    /** To override submit label */
    submitLabel?: string;
    /** To override Save For Later label */
    saveLaterLabel?: string;
    /** To override Discard label */
    discardLabel?: string;
    /** Form-level entity to load */
    entity?: any;
    /** Type of form-level entity to load */
    entityType?: string;
    /** True to render as a single page, not divided into sections */
    singlePageMode?: boolean;
    /** True to disable the confidential fields, used during editing responses with confidential data */
    disableConfidentialFields?: boolean;
    /** Force all questions to be visible */
    forceAllVisible?: boolean;
}
interface FormComponentState {
    T: any;
    visibilityStructure: any;
}
export default class FormComponent extends React.Component<FormComponentProps, FormComponentState> {
    static initClass(): void;
    constructor(props: any);
    getChildContext(): {};
    componentWillReceiveProps(nextProps: any): void;
    componentDidUpdate(prevProps: any): void;
    componentWillMount(): void;
    createLocalizer(design: any, locale: any): ezlocalize.LocalizeString;
    handleSubmit: () => Promise<any>;
    isVisible: (itemId: any) => any;
    createResponseRow: (data: any) => ResponseRow;
    handleDataChange: (data: any) => void;
    handleNext: () => any;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.CElement<any, SectionsComponent>;
}
export {};
