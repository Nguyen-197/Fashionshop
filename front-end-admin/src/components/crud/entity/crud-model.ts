export class CrudModel {
    field: string | undefined;
    name: string | undefined;
    fullName: string | undefined;
    description: string | undefined;
    dataType?: 'int' | 'decimal' | 'date' | 'datetime' | 'string' | 'boolean' | 'timestamp';
}

export class Filter {
    key?: string;
    value?: any;
    operator?: '<' | '<=' | '>' | '>=' | '!=' | 'nin' | 'in' | 'contains' | 'startsWith' | 'endsWith';
    or?: Filter[];
    constructor(init?: Partial<Filter>) {
        Object.assign(this, init);
    }
}

export class Order {
    key?: string;
    direction?: string;
    constructor(init?: Partial<Order>) {
        Object.assign(this, init);
    }
}


export class Page {
    pageSize?: number;
    pageNumber?: number;
    constructor(init?: Partial<Order>) {
        Object.assign(this, init);
    }
}
export class FilterModel {
    filters?: Filter[];
    order?: Order;
    // pageInfo?: Page;
    constructor(init?: Partial<FilterModel>) {
        Object.assign(this, init);
    }
}