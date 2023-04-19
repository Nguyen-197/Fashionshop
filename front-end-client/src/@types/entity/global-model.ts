export class Filter {
    key?: string;
    value?: any;
    operator?: '<' | '<=' | '>' | '>=' | '!=' | 'nin' | 'in' | 'contains' | 'startsWith' | 'endsWith';
    or?: Filter[];
    constructor(init?: Partial<Filter>) {
        Object.assign(this, init);
    }
}