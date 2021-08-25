import React from "react";
import { Expr, Schema } from "mwater-expressions";
import { LocalizedString } from "ez-localize";
import ResponseRow from "./ResponseRow";
interface TextExprsComponentProps {
    /** String to render (localized) */
    localizedStr?: LocalizedString;
    /** Array of mwater-expressions to insert at {0}, {1}, etc. */
    exprs?: Expr[];
    /** Schema that includes the current form */
    schema: Schema;
    /** response row to use */
    responseRow: ResponseRow;
    /** locale (e.g. "en") to use */
    locale?: string;
    /** True to render as markdown text */
    markdown?: boolean;
    /** Format to be used by d3 formatter */
    format?: string;
}
interface TextExprsComponentState {
    exprValueStrs: string[];
}
/** Displays a text string with optional expressions embedded in it that are computed */
export default class TextExprsComponent extends React.Component<TextExprsComponentProps, TextExprsComponentState> {
    constructor(props: TextExprsComponentProps);
    componentWillMount(): void;
    componentDidUpdate(): void;
    evaluateExprs(): void;
    render(): React.DetailedReactHTMLElement<{
        dangerouslySetInnerHTML: {
            __html: any;
        };
    }, HTMLElement> | React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
}
export {};
