import React from "react";
interface RosterGroupComponentProps {
    /** Design of roster group. See schema */
    rosterGroup: any;
    /** Current data of response. */
    data?: any;
    /** Called when data changes */
    onDataChange: any;
    /** (id) tells if an item is visible or not */
    isVisible: any;
    /** ResponseRow object (for roster entry if in roster) */
    responseRow?: any;
    schema: any;
}
export default class RosterGroupComponent extends React.Component<RosterGroupComponentProps> {
    static initClass(): void;
    getAnswerId(): any;
    getAnswer(): any;
    handleAnswerChange: (answer: any) => any;
    handleEntryDataChange: (index: any, data: any) => any;
    handleAdd: () => any;
    handleRemove: (index: any) => any;
    validate(scrollToFirstInvalid: any): Promise<boolean>;
    isChildVisible: (index: any, id: any) => any;
    renderName(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    renderEntryTitle(entry: any, index: any): React.CElement<any, {
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
    renderEntry(entry: any, index: any): any;
    renderAdd(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> | undefined;
    renderEmptyPrompt(): React.DetailedReactHTMLElement<{
        style: {
            fontStyle: "italic";
        };
    }, HTMLElement>;
    render(): any;
}
export {};
