import React from "react";
interface ResponseArchivesComponentProps {
    formDesign: any;
    response: any;
    /** Schema of the */
    schema: any;
    /** Defaults to english */
    locale?: string;
    /** Localizer to use */
    T: any;
    /** Form context to use */
    formCtx: any;
    /** The archives */
    history: any;
    eventsUsernames: any;
}
export default class ResponseArchivesComponent extends React.Component<ResponseArchivesComponentProps> {
    renderRecord: (record: any, previousRecord: any) => React.DetailedReactHTMLElement<{
        key: any;
        style: {
            marginTop: number;
        };
    }, HTMLElement>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
