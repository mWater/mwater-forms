declare const _default: {
    _type: string;
    _schema: number;
    name: {
        _base: string;
        en: string;
    };
    contents: ({
        _id: string;
        _type: string;
        name: {
            _base: string;
            en: string;
        };
        contents: ({
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            defaultValue: string;
            propertyLinks?: undefined;
            entityType?: undefined;
            choices?: undefined;
            hint?: undefined;
            help?: undefined;
            alternates?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            propertyLinks: {
                questionId: string;
                propertyId: null;
                direction: string;
                type: null;
            }[];
            required: boolean;
            entityType: string;
            defaultValue?: undefined;
            choices?: undefined;
            hint?: undefined;
            help?: undefined;
            alternates?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            choices: ({
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify?: undefined;
            } | {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify: boolean;
            })[];
            defaultValue?: undefined;
            propertyLinks?: undefined;
            entityType?: undefined;
            hint?: undefined;
            help?: undefined;
            alternates?: undefined;
        } | {
            _id: string;
            _type: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations?: undefined;
            required?: undefined;
            defaultValue?: undefined;
            propertyLinks?: undefined;
            entityType?: undefined;
            choices?: undefined;
            hint?: undefined;
            help?: undefined;
            alternates?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            hint: {
                _base: string;
                en: string;
            };
            help: {
                _base: string;
                en: string;
            };
            alternates: {
                na: boolean;
            };
            defaultValue?: undefined;
            propertyLinks?: undefined;
            entityType?: undefined;
            choices?: undefined;
        })[];
        conditions: never[];
    } | {
        _id: string;
        _type: string;
        name: {
            _base: string;
            en: string;
        };
        contents: ({
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            format: string;
            choices?: undefined;
            hint?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            choices: ({
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify?: undefined;
            } | {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify: boolean;
            })[];
            format?: undefined;
            hint?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            hint: {
                _base: string;
                en: string;
            };
            format?: undefined;
            choices?: undefined;
        })[];
        conditions: {
            lhs: {
                question: string;
            };
            op: string;
            rhs: {
                literal: string;
            };
        }[];
    } | {
        _id: string;
        _type: string;
        name: {
            _base: string;
            en: string;
        };
        contents: ({
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            choices: {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
            }[];
            decimal?: undefined;
            format?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: {
                message: {
                    _base: string;
                    en: string;
                };
                op: string;
                rhs: {
                    literal: {
                        min: number;
                        max: number;
                    };
                };
            }[];
            required: boolean;
            decimal: boolean;
            choices?: undefined;
            format?: undefined;
        } | {
            _id: string;
            _type: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations?: undefined;
            required?: undefined;
            choices?: undefined;
            decimal?: undefined;
            format?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            format: string;
            choices?: undefined;
            decimal?: undefined;
        })[];
        conditions: {
            lhs: {
                question: string;
            };
            op: string;
            rhs: {
                literal: string;
            };
        }[];
    } | {
        _id: string;
        _type: string;
        name: {
            _base: string;
            en: string;
        };
        contents: ({
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            units: {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                hint: {
                    _base: string;
                    en: string;
                };
            }[];
            defaultUnits: string;
            unitsPosition: string;
            decimal: boolean;
            hint?: undefined;
            choices?: undefined;
            format?: undefined;
            commentsField?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations: never[];
            required: boolean;
            units: {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                hint: {
                    _base: string;
                    en: string;
                };
            }[];
            defaultUnits: string;
            unitsPosition: string;
            decimal: boolean;
            hint: {
                _base: string;
                en: string;
            };
            choices?: undefined;
            format?: undefined;
            commentsField?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: {
                lhs: {
                    question: string;
                };
                op: string;
                rhs: {
                    literal: string;
                };
            }[];
            validations: never[];
            required: boolean;
            units: {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
            }[];
            defaultUnits: string;
            unitsPosition: string;
            decimal: boolean;
            hint?: undefined;
            choices?: undefined;
            format?: undefined;
            commentsField?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: {
                lhs: {
                    question: string;
                };
                op: string;
                rhs: {
                    literal: string;
                };
            }[];
            validations: never[];
            required: boolean;
            choices: ({
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify?: undefined;
            } | {
                label: {
                    _base: string;
                    en: string;
                };
                id: string;
                specify: boolean;
            })[];
            units?: undefined;
            defaultUnits?: undefined;
            unitsPosition?: undefined;
            decimal?: undefined;
            hint?: undefined;
            format?: undefined;
            commentsField?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: {
                lhs: {
                    question: string;
                };
                op: string;
                rhs: {
                    literal: string;
                };
            }[];
            validations: never[];
            required: boolean;
            format: string;
            commentsField: boolean;
            units?: undefined;
            defaultUnits?: undefined;
            unitsPosition?: undefined;
            decimal?: undefined;
            hint?: undefined;
            choices?: undefined;
        } | {
            _type: string;
            _id: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: {
                lhs: {
                    question: string;
                };
                op: string;
                rhs: {
                    literal: string;
                };
            }[];
            validations: never[];
            required: boolean;
            format: string;
            units?: undefined;
            defaultUnits?: undefined;
            unitsPosition?: undefined;
            decimal?: undefined;
            hint?: undefined;
            choices?: undefined;
            commentsField?: undefined;
        } | {
            _id: string;
            _type: string;
            text: {
                _base: string;
                en: string;
            };
            conditions: never[];
            validations?: undefined;
            required?: undefined;
            units?: undefined;
            defaultUnits?: undefined;
            unitsPosition?: undefined;
            decimal?: undefined;
            hint?: undefined;
            choices?: undefined;
            format?: undefined;
            commentsField?: undefined;
        })[];
        conditions: {
            lhs: {
                question: string;
            };
            op: string;
            rhs: {
                literal: string;
            };
        }[];
    })[];
    locales: {
        code: string;
        name: string;
    }[];
};
export default _default;
