export const FIELD_ID = '_id';

export const FIELD_TYPES_CONFIG = [
    { label: '字符串', value: 'string', inputType: 'input-text' },
    { label: '数字', value: 'number', inputType: 'input-number' },
    { label: '数组', value: 'array', inputType: 'input-array' },
    { label: '日期', value: 'date', inputType: 'input-date' },
    { label: '日期时间', value: 'datetime', inputType: 'input-date' },
    { label: '日期范围', value: 'daterange', inputType: 'input-date-range' },
    { label: 'markdown', value: 'markdown', inputType: 'textarea' },
    { label: '富文本', value: 'richtext', inputType: 'input-rich-text' },
];

export const STATIC_FIELDS: {[key: string]: string} = {
    createtime: 'datetime',
    updatetime: 'datetime',
    version: 'number',
    hide: 'number',
    deleted: 'number'
};

export const WHERE_FIELD_PREFIX = 'where_field_';
export const WHERE_OP_PREFIX = 'where_op_';
export const WHERE_OP_TYPE = 'where_type_';