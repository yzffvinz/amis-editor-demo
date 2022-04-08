import {
    FIELD_ID, FIELD_TYPES_CONFIG, STATIC_FIELDS,
    WHERE_FIELD_PREFIX, WHERE_OP_PREFIX, WHERE_OP_TYPE
} from './Constants';

interface Item {
    name: string;
    label: string;
    type: string | null;
    multiple?: boolean;
    source?: string;
}

interface FormItem extends Item {
    format?: string;
    clearable?: boolean;
    searchable?: boolean;
}

interface TableItem extends Item {
    valueFormat?: string;
    disabled?: boolean;
    breakpoint?: string;
    buttons?: any[];
}

function buildFormItem(): FormItem {
    return {} as FormItem;
}

function buildTableItem(): TableItem {
    return {} as FormItem;
}

// config replace