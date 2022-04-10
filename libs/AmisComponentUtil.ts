import { Select } from 'amis';
import {
    WHERE_FIELD_PREFIX, WHERE_OP_PREFIX, WHERE_TYPE_PREFIX
} from './Constants';

type VItemType = 'input' | 'filter' | 'column'

interface VItemOption {
    source: string
}

interface VDataType {
    name: string;
    type: string;
    api?: string;
    op?: string;
}

function buildOp() {
}

function buildType() {
}

export default function generateAmisItem(datatype: VDataType, itemType: VItemType, options?: VItemOption) {
    const { name, type, api, op } = datatype;
    const items = [];
    const queryField = {
        name: itemType === 'filter' ? `${WHERE_FIELD_PREFIX}name` : name,
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
    else if (['option', 'set'].includes(type)) {
        Object.assign(queryField, {
            type: 'select',
            searchable: true,
            clearable: true,
            multiple: type === 'set',
            disabled: itemType === 'column',
            source: api,
            joinValues: false
        });
    }
    else if (type === 'array') {
        Object.assign(queryField, {
            type: 'input-array',
            disabled: itemType === 'column',
            items: {
                type: 'select',
                searchable: true,
                source: api,
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
            'input': 'textarea'
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
            'input': 'input-rich-text',
        };
        Object.assign(queryField, {
            type: comps[itemType],
            breakpoint: '*'
        });
    }

    items.push(queryField);

    if (type === 'number') {
        items.push({
            type: 'input-text',
            name: `${WHERE_TYPE_PREFIX}${name}`,
            label: `${name}-type`,
            visible: false,
            clearValueOnHidden: false,
            value: 'number'
        })
    }

    if (op) {
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