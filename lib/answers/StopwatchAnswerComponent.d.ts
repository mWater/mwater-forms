import React from "react";
interface StopwatchAnswerComponentProps {
    onValueChange: any;
    value?: number;
    T: any;
}
interface StopwatchAnswerComponentState {
    timerId: any;
    elapsedTicks: any;
}
export default class StopwatchAnswerComponent extends React.Component<StopwatchAnswerComponentProps, StopwatchAnswerComponentState> {
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handleStartClick: () => any;
    persistValue(ticks: any): any;
    handleStopClick: () => any;
    handleResetClick: () => any;
    render(): React.DetailedReactHTMLElement<{}, HTMLElement>;
}
export {};
