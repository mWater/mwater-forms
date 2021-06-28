import React from "react";
interface TimerComponentProps {
    timer: any;
}
interface TimerComponentState {
    timerId: any;
    elapsedTicks: any;
}
export default class TimerComponent extends React.Component<TimerComponentProps, TimerComponentState> {
    static initClass(): void;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handleStartClick: () => void;
    handleStopClick: () => void;
    handleResetClick: () => void;
    render(): React.DetailedReactHTMLElement<{
        className: string;
    }, HTMLElement>;
}
export {};
