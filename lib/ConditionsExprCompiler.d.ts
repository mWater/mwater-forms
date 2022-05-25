import { Conditions, FormDesign, Item } from "./formDesign";
export default class ConditionsExprCompiler {
    formDesign: FormDesign;
    itemMap: {
        [id: string]: Item;
    };
    constructor(formDesign: FormDesign);
    compileConditions(conditions: Conditions, tableId: string): {
        table: string;
        type: string;
        op: string;
        exprs: ({
            table: string;
            type: string;
            op: string;
            exprs: {
                table: string;
                type: string;
                column: string;
            }[];
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
                valueType?: undefined;
                value?: undefined;
            } | {
                type: string;
                valueType: string;
                value: number;
                table?: undefined;
                op?: undefined;
                exprs?: undefined;
            })[];
        })[];
        column?: undefined;
    } | {
        table: string;
        type: string;
        op: string;
        exprs: ({
            table: string;
            type: string;
            column: string;
            valueType?: undefined;
            value?: undefined;
        } | {
            type: string;
            valueType: string;
            value: string;
            table?: undefined;
            column?: undefined;
        })[];
        column?: undefined;
    } | {
        table: string;
        type: string;
        op: string;
        exprs: ({
            table: string;
            type: string;
            column: string;
            valueType?: undefined;
            value?: undefined;
        } | {
            type: string;
            valueType: string;
            value: number;
            table?: undefined;
            column?: undefined;
        })[];
        column?: undefined;
    } | {
        table: string;
        type: string;
        op: string;
        exprs: ({
            table: string;
            type: string;
            column: string;
            valueType?: undefined;
            value?: undefined;
        } | {
            type: string;
            valueType: string;
            value: string[];
            table?: undefined;
            column?: undefined;
        })[];
        column?: undefined;
    } | {
        table: string;
        type: string;
        column: string;
        op?: undefined;
        exprs?: undefined;
    } | {
        table: string;
        type: string;
        op: string;
        exprs: ({
            table: string;
            type: string;
            op: string;
            exprs: {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    column: string;
                    valueType?: undefined;
                    value?: undefined;
                } | {
                    type: string;
                    valueType: string;
                    value: string;
                    table?: undefined;
                    column?: undefined;
                })[];
            }[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
            } | {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    op: string;
                    exprs: {
                        table: string;
                        type: string;
                        column: string;
                    }[];
                    valueType?: undefined;
                    value?: undefined;
                } | {
                    type: string;
                    valueType: string;
                    value: number;
                    table?: undefined;
                    op?: undefined;
                    exprs?: undefined;
                })[];
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                column: string;
                valueType?: undefined;
                value?: undefined;
            } | {
                type: string;
                valueType: string;
                value: string;
                table?: undefined;
                column?: undefined;
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
            } | {
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    op: string;
                    exprs: ({
                        table: string;
                        type: string;
                        column: string;
                        valueType?: undefined;
                        value?: undefined;
                    } | {
                        type: string;
                        valueType: string;
                        value: string;
                        table?: undefined;
                        column?: undefined;
                    })[];
                }[];
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                column: string;
                valueType?: undefined;
                value?: undefined;
            } | {
                type: string;
                valueType: string;
                value: number;
                table?: undefined;
                column?: undefined;
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    column: string;
                    valueType?: undefined;
                    value?: undefined;
                } | {
                    type: string;
                    valueType: string;
                    value: number;
                    table?: undefined;
                    column?: undefined;
                })[];
            }[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                column: string;
                valueType?: undefined;
                value?: undefined;
            } | {
                type: string;
                valueType: string;
                value: string[];
                table?: undefined;
                column?: undefined;
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
            } | {
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    op: string;
                    exprs: ({
                        table: string;
                        type: string;
                        column: string;
                        valueType?: undefined;
                        value?: undefined;
                    } | {
                        type: string;
                        valueType: string;
                        value: string[];
                        table?: undefined;
                        column?: undefined;
                    })[];
                }[];
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            column: string;
            op?: undefined;
            exprs?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    column: string;
                    valueType?: undefined;
                    value?: undefined;
                } | {
                    type: string;
                    valueType: string;
                    value: string[];
                    table?: undefined;
                    column?: undefined;
                })[];
            }[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
            } | {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    op: string;
                    exprs: {
                        table: string;
                        type: string;
                        column: string;
                    }[];
                } | {
                    table: string;
                    type: string;
                    op: string;
                    exprs: {
                        table: string;
                        type: string;
                        op: string;
                        exprs: ({
                            table: string;
                            type: string;
                            column: string;
                            valueType?: undefined;
                            value?: undefined;
                        } | {
                            type: string;
                            valueType: string;
                            value: string[];
                            table?: undefined;
                            column?: undefined;
                        })[];
                    }[];
                })[];
            })[];
            column?: undefined;
        } | {
            table: string;
            type: string;
            op: string;
            exprs: ({
                table: string;
                type: string;
                op: string;
                exprs: {
                    table: string;
                    type: string;
                    column: string;
                }[];
            } | {
                table: string;
                type: string;
                op: string;
                exprs: ({
                    table: string;
                    type: string;
                    op: string;
                    exprs: {
                        table: string;
                        type: string;
                        column: string;
                    }[];
                } | {
                    table: string;
                    type: string;
                    op: string;
                    exprs: {
                        table: string;
                        type: string;
                        op: string;
                        exprs: {
                            table: string;
                            type: string;
                            op: string;
                            exprs: ({
                                table: string;
                                type: string;
                                column: string;
                                valueType?: undefined;
                                value?: undefined;
                            } | {
                                type: string;
                                valueType: string;
                                value: string[];
                                table?: undefined;
                                column?: undefined;
                            })[];
                        }[];
                    }[];
                })[];
            })[];
            column?: undefined;
        })[];
        column?: undefined;
    } | null;
}
