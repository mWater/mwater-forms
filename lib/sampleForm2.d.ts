declare const _default: {
    _id: string;
    design: {
        name: {
            en: string;
            _base: string;
        };
        _type: string;
        _schema: number;
        locales: {
            code: string;
            name: string;
        }[];
        contents: ({
            _id: string;
            name: {
                en: string;
                _base: string;
            };
            _type: string;
            contents: ({
                _id: string;
                _type: string;
                text: {
                    en: string;
                    _base: string;
                };
                randomAskProbability: number;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                conditions?: undefined;
                validations?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                _type: string;
                text: {
                    en: string;
                    _base: string;
                };
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                conditions?: undefined;
                validations?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                _type: string;
                duration: number;
                text: {
                    en: string;
                    _base: string;
                };
                hint: {
                    en: string;
                    _base: string;
                };
                randomAskProbability?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                conditions?: undefined;
                validations?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                label: {
                    en: string;
                    _base: string;
                };
                choices: {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                }[];
                items: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    hint?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    hint: {
                        en: string;
                        _base: string;
                    };
                })[];
                required: boolean;
                conditions: never[];
                validations: never[];
                recordLocation: boolean;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                code: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                label: {
                    en: string;
                    _base: string;
                };
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: never[];
                recordLocation: boolean;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                choices?: undefined;
                items?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions: {
                        op: string;
                        lhs: {
                            question: string;
                        };
                    }[];
                })[];
                required: boolean;
                sticky: boolean;
                conditions: {
                    op: string;
                    lhs: {
                        question: string;
                    };
                }[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                sticky: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: {
                    op: string;
                    rhs: {
                        literal: {
                            max: number;
                        };
                    };
                    message: {
                        en: string;
                        _base: string;
                    };
                }[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                sticky: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                assetSystemId: number;
                assetTypes: string[];
                required: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                textExprs: {
                    type: string;
                    table: string;
                    column: string;
                }[];
                _type: string;
                decimal: boolean;
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: {
                    op: string;
                    lhs: {
                        question: string;
                    };
                }[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    hint: {
                        en: string;
                        _base: string;
                    };
                    specify?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    hint?: undefined;
                    specify?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    specify: boolean;
                    hint?: undefined;
                })[];
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions: {
                        op: string;
                        lhs: {
                            question: string;
                        };
                    }[];
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions?: undefined;
                })[];
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                commentsField: string;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                units: {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                }[];
                decimal: boolean;
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: never[];
                defaultUnits: string;
                unitsPosition: string;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                commentsField?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                required: boolean;
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                required: boolean;
                alternates: {
                    na?: undefined;
                    dontknow?: undefined;
                };
                entityType: string;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                }[];
                _basedOn: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                decimal: boolean;
                _basedOn: string;
                required: boolean;
                conditions: never[];
                validations: {
                    op: string;
                    rhs: {
                        literal: {
                            max: number;
                            min: number;
                        };
                    };
                    message: {
                        en: string;
                        _base: string;
                    };
                }[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    specify: boolean;
                    conditions?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions: {
                        op: string;
                        lhs: {
                            question: string;
                        };
                    }[];
                    specify?: undefined;
                })[];
                _basedOn: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                choices: ({
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    specify: boolean;
                    conditions?: undefined;
                } | {
                    id: string;
                    label: {
                        en: string;
                        _base: string;
                    };
                    conditions: {
                        op: string;
                        lhs: {
                            question: string;
                        };
                    }[];
                    specify?: undefined;
                })[];
                _basedOn: string;
                displayMode: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                help: {
                    en: string;
                    _base: string;
                };
                hint: {
                    en: string;
                    _base: string;
                };
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                commentsField: boolean;
                randomAskProbability?: undefined;
                duration?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                _type: string;
                format: string;
                required: boolean;
                conditions: never[];
                validations: never[];
                commentsField: boolean;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                name: {
                    en: string;
                    _base: string;
                };
                _type: string;
                allowAdd: boolean;
                required: boolean;
                conditions: never[];
                validations: never[];
                contents: {
                    _id: string;
                    text: {
                        en: string;
                        _base: string;
                    };
                    _type: string;
                    format: string;
                    required: boolean;
                    alternates: {
                        na: boolean;
                        dontknow: boolean;
                    };
                    conditions: {
                        op: string;
                        lhs: {
                            question: string;
                        };
                    }[];
                    validations: never[];
                }[];
                text?: undefined;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                rosterId: string;
                name: {
                    en: string;
                    _base: string;
                };
                _type: string;
                allowAdd: boolean;
                required: boolean;
                conditions: never[];
                validations: never[];
                entryTitle: {
                    en: string;
                };
                entryTitleExprs: {
                    type: string;
                    table: string;
                    column: string;
                }[];
                contents: {
                    _id: string;
                    text: {
                        en: string;
                        _base: string;
                    };
                    _type: string;
                    format: string;
                    required: boolean;
                    alternates: {
                        na: boolean;
                        dontknow: boolean;
                    };
                    conditions: never[];
                    validations: never[];
                }[];
                text?: undefined;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _id: string;
                _type: string;
                name: {
                    _base: string;
                    en: string;
                };
                allowAdd: boolean;
                allowRemove: boolean;
                contents: ({
                    _id: string;
                    _type: string;
                    text: {
                        en: string;
                    };
                    required: boolean;
                    validations?: undefined;
                    choices?: undefined;
                    format?: undefined;
                    defaultNow?: undefined;
                } | {
                    _id: string;
                    _type: string;
                    text: {
                        en: string;
                    };
                    validations: {
                        message: {
                            en: string;
                            _base: string;
                        };
                        op: string;
                        rhs: {
                            literal: {
                                max: number;
                                min: number;
                            };
                        };
                    }[];
                    required?: undefined;
                    choices?: undefined;
                    format?: undefined;
                    defaultNow?: undefined;
                } | {
                    _id: string;
                    _type: string;
                    text: {
                        en: string;
                    };
                    required?: undefined;
                    validations?: undefined;
                    choices?: undefined;
                    format?: undefined;
                    defaultNow?: undefined;
                } | {
                    _id: string;
                    _type: string;
                    text: {
                        en: string;
                    };
                    choices: ({
                        label: {
                            en: string;
                        };
                        id: string;
                        conditions?: undefined;
                    } | {
                        label: {
                            en: string;
                        };
                        id: string;
                        conditions: {
                            op: string;
                            lhs: {
                                question: string;
                            };
                        }[];
                    })[];
                    required?: undefined;
                    validations?: undefined;
                    format?: undefined;
                    defaultNow?: undefined;
                } | {
                    _id: string;
                    _type: string;
                    text: {
                        en: string;
                    };
                    format: string;
                    defaultNow: boolean;
                    required?: undefined;
                    validations?: undefined;
                    choices?: undefined;
                })[];
                text?: undefined;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                conditions?: undefined;
                validations?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                rows?: undefined;
                columns?: undefined;
            } | {
                _type: string;
                _id: string;
                text: {
                    en: string;
                    _base: string;
                };
                rows: {
                    id: string;
                    c0: string;
                    c1: string;
                }[];
                columns: {
                    id: string;
                    name: {
                        en: string;
                    };
                    type: string;
                    enumValues: {
                        id: string;
                        name: {
                            en: string;
                        };
                    }[];
                }[];
                alternates: {
                    na: boolean;
                    dontknow: boolean;
                };
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                conditions?: undefined;
                validations?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                name?: undefined;
                allowAdd?: undefined;
                contents?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
            } | {
                _id: string;
                name: {
                    en: string;
                    _base: string;
                };
                _type: string;
                conditions: never[];
                validations: never[];
                contents: {
                    _id: string;
                    text: {
                        en: string;
                        _base: string;
                    };
                    _type: string;
                    format: string;
                    required: boolean;
                    alternates: {
                        na: boolean;
                        dontknow: boolean;
                    };
                    conditions: never[];
                    validations: never[];
                }[];
                text?: undefined;
                randomAskProbability?: undefined;
                duration?: undefined;
                hint?: undefined;
                label?: undefined;
                choices?: undefined;
                items?: undefined;
                required?: undefined;
                recordLocation?: undefined;
                code?: undefined;
                alternates?: undefined;
                sticky?: undefined;
                format?: undefined;
                assetSystemId?: undefined;
                assetTypes?: undefined;
                textExprs?: undefined;
                decimal?: undefined;
                commentsField?: undefined;
                units?: undefined;
                defaultUnits?: undefined;
                unitsPosition?: undefined;
                entityType?: undefined;
                _basedOn?: undefined;
                displayMode?: undefined;
                help?: undefined;
                allowAdd?: undefined;
                rosterId?: undefined;
                entryTitle?: undefined;
                entryTitleExprs?: undefined;
                allowRemove?: undefined;
                rows?: undefined;
                columns?: undefined;
            })[];
            conditions: never[];
        } | {
            _id: string;
            name: {
                en: string;
                _base: string;
            };
            _type: string;
            contents: never[];
            conditions: {
                op: string;
                lhs: {
                    question: string;
                };
            }[];
        })[];
        draftNameRequired: boolean;
        calculations: {
            _id: string;
            name: {
                _base: string;
                en: string;
            };
            desc: {
                _base: string;
                en: string;
            };
            expr: {
                type: string;
                valueType: string;
                value: number;
            };
        }[];
    };
};
export default _default;
