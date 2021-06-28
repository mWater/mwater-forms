import React from "react";
import AsyncLoadComponent from "react-library/lib/AsyncLoadComponent";
interface ResponseAnswersComponentProps {
    formDesign: any;
    data: any;
    /** Schema of the */
    schema: any;
    /** Deployment id of the response */
    deployment?: string;
    /** True to hide empty answers */
    hideEmptyAnswers?: boolean;
    /** Defaults to english */
    locale?: string;
    /** Localizer to use */
    T: any;
    /** Form context to use */
    formCtx: any;
    /** Previous data */
    prevData?: any;
    showPrevAnswers?: boolean;
    highlightChanges?: boolean;
    hideUnchangedAnswers?: boolean;
    showChangedLink?: boolean;
    onChangedLinkClick?: any;
    onCompleteHistoryLinkClick?: any;
    hideCalculations?: boolean;
}
export default class ResponseAnswersComponent extends AsyncLoadComponent<ResponseAnswersComponentProps> {
    isLoadNeeded(newProps: any, oldProps: any): boolean;
    load(props: any, prevProps: any, callback: any): void;
    handleLocationClick(location: any): any;
    renderLocation(location: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    renderAnswer(q: any, answer: any): any;
    renderLikertAnswer(q: any, answer: any, prevAnswer: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderQuestion(q: any, dataId: any): (React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null)[] | null;
    collectItemsReferencingRoster(items: any, contents: any, rosterId: any): any[];
    renderItem(item: any, visibilityStructure: any, dataId: any): any;
    renderExpression(q: any, dataId: any): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[];
    renderExpressionAnswer(q: any, dataId: any): React.CElement<any, {
        componentWillMount(): void;
        componentDidUpdate(): void;
        evaluateExprs(): void;
        render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
            dangerouslySetInnerHTML: {
                __html: any;
            };
        }, HTMLElement>;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    }>;
    render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
