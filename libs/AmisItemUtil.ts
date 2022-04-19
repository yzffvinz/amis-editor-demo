import {
    WHERE_FIELD_PREFIX, WHERE_OP_PREFIX, WHERE_TYPE_PREFIX
} from './Constants';

export type VItemType = 'input' | 'filter' | 'column'

export interface VDataType {
    name: string;
    type: string;
    api?: string;
    op?: string;
}

export function normalizeItmeProps(name: string, type: any, filter?: any): VDataType {
    const props: VDataType = { name, type: 'string' };
    if (typeof type === 'string') {
        props.type = type;
    } else if (type) {
        type.type && (props.type = type.type);
        type.api && (props.api = type.api);
    }
    if (filter && filter.op) {
        props.op = filter.op;
    }
    return props;
}

export default function generateAmisItem(itemType: VItemType, datatype: VDataType) {
    let { name, type, api, op } = datatype;
    const items = [];
    const queryField = {
        name: itemType === 'filter' ? `${WHERE_FIELD_PREFIX}${name}` : name,
        label: name
    }
    if (type === 'boolean') {
        Object.assign(queryField, {
            type: 'switch',
            disabled: itemType === 'column',
            onText: `${name} true`,
            offText: `${name} false`
        });
    }
    else if (type === 'string') {
        Object.assign(queryField, {
            type: itemType === 'column' ? 'text' : 'input-text'
        });
    }
    else if (type === 'number') {
        Object.assign(queryField, {
            type: itemType === 'column' ? 'text' : 'input-number'
        });
    }
    else if (itemType === 'filter' && ['option', 'set', 'array'].includes(type)) {
        Object.assign(queryField, {
            type: 'select',
            searchable: true,
            clearable: true,
            source: {
                url: api,
                cache: 30000
            },
        });
    }
    else if (['option', 'set'].includes(type)) {
        Object.assign(queryField, {
            type: 'select',
            searchable: true,
            clearable: true,
            multiple: type === 'set',
            disabled: itemType === 'column',
            source: {
                url: api,
                cache: 30000
            },
            joinValues: false,
            extractValue: true
        });
    }
    else if (type === 'array' && ['input', 'column'].includes(itemType)) {
        Object.assign(queryField, {
            type: 'input-array',
            disabled: itemType === 'column',
            items: {
                type: 'select',
                searchable: true,
                source: {
                    url: api,
                    cache: 30000
                },
            },
            draggable: true,
            joinValues: false
        });
    }
    else if (type === 'date') {
        const comps = {
            'column': 'date',
            'filter': 'input-date-range',
            'input': 'input-date'
        }

        if (itemType === 'filter') {
            op = 'range';
        }

        const formatKey = itemType === 'column' ? 'valueFormat' : 'format';
        Object.assign(queryField, {
            type: comps[itemType],
            [formatKey]: 'x'
        });
    }
    else if (type === 'datetime') {
        const comps = {
            'column': 'datetime',
            'filter': 'input-datetime-range',
            'input': 'input-datetime'
        }

        if (itemType === 'filter') {
            op = 'range';
        }

        const formatKey = itemType === 'column' ? 'valueFormat' : 'format';
        Object.assign(queryField, {
            type: comps[itemType],
            [formatKey]: 'x'
        });
    }
    else if (type === 'richtext') {
        const comps = {
            'column': 'text',
            'filter': 'input-text',
            'input': 'input-rich-text'
        };
        Object.assign(queryField, {
            type: comps[itemType],
            breakpoint: '*'
        });
    }
    else if (type === 'markdown') {
        const comps = {
            'column': 'text',
            'filter': 'input-text',
            'input': 'textarea',
        };
        Object.assign(queryField, {
            type: comps[itemType],
            breakpoint: '*'
        });
    }
    items.push(queryField);

    if (itemType === 'filter' && ['number', 'boolean'].includes(type)) {
        items.push({
            type: 'input-text',
            name: `${WHERE_TYPE_PREFIX}${name}`,
            label: `${name}-type`,
            visible: false,
            clearValueOnHidden: false,
            value: type
        })
    }

    if (itemType === 'filter' && op) {
        items.push({
            type: 'input-text',
            name: `${WHERE_OP_PREFIX}${name}`,
            label: `${name}-op`,
            visible: false,
            clearValueOnHidden: false,
            value: op
        })
    }

    return items.map(item => ({
        ...item,
        disabled: itemType === 'column'
    }));
}