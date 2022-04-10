import {
    FIELD_ID, FIELD_TYPES_CONFIG, STATIC_FIELDS,
    WHERE_FIELD_PREFIX, WHERE_OP_PREFIX, WHERE_TYPE_PREFIX
} from './Constants';

interface FormItem {
    name: string;
    label: string;
    type: string | null;
    multiple?: boolean;
    source?: string;
    format?: string;
    clearable?: boolean;
    searchable?: boolean;
}

interface TableColumn {
    label: string;
    name?: string;
    type: string;
    valueFormat?: string;
    breakpoint?: string;
    buttons?: any[];
}

interface Columns {
    [key: string]: string;
}

interface PageSignature {
    queryApi: string;
    addApi: string;
    deleteApi: string;
    modifyApi: string;
    columns: Columns;
    filters: string[];
}

function buildFormItem(field: string, datatype: string, forMod = false): FormItem | null {
    const input: FormItem = {
        name: field,
        label: field,
        type: ''
    }
    if (field === FIELD_ID) {
        input.type = forMod ? 'static' : null;
    } else {
        if (datatype && datatype.includes('$api$')) {
            const [inputType, source] = datatype.split('$api$')
            input.source = source;
            input.type = 'select';
            input.multiple = inputType === 'multipleSelect';
            input.searchable = true;
            input.clearable = true;
        } else {
            const fieldConfig = FIELD_TYPES_CONFIG.find(config => config.value === datatype);
            if (!fieldConfig) return null;
            const { inputType } = fieldConfig;
            if (['input-date', 'input-date-time', 'input-date-range'].includes(inputType)) {
                input.format = 'x';
            }
            input.type = inputType;
        }
    }
    return input;
}

export function buildForm(api: string, columns: Columns, forMod: boolean = false) {
    const fields = Object.keys(columns);
    forMod && fields.unshift('_id');
    const formbody = fields.map(field => buildFormItem(field, columns[field], forMod));
    return {
        type: 'form',
        title: '表单',
        body: formbody.filter(i => i && i.type),
        api
    }
}

export function buildAddButton(signature: PageSignature) {
    return {
        type: 'button',
        label: '新增',
        actionType: 'dialog',
        level: 'primary',
        className: 'm-b-sm',
        dialog: {
            title: '新增',
            body: buildForm(signature.addApi, signature.columns)
        }
    }
}

export function buildModifyButton(signature: PageSignature) {
    return {
        type: 'button',
        label: '修改',
        actionType: 'drawer',
        level: 'light',
        className: 'm-b-sm',
        drawer: {
            title: '修改',
            body: buildForm(signature.modifyApi, signature.columns, true)
        }
    }
}

export function buildDelButton(deleteApi: string) {
    return {
        type: 'button',
        label: '删除',
        actionType: 'ajax',
        level: 'danger',
        confirmText: '确认要删除？',
        api: {
            method: 'post',
            url: deleteApi,
            dataType: 'form',
        },
    }
}

export function buildTableColumn(columns: Columns): TableColumn[] {
    const tableColumns = [{
        label: '_id',
        type: 'text',
        name: '_id',
        breakpoint: '*'
    }];
    const fieldMap = { ...columns, ...STATIC_FIELDS };
    const fields = Object.keys(fieldMap);

    const restColumns: TableColumn[] = fields.map(field => {
        const type = fieldMap[field];

        const columnConfig: TableColumn = {
            label: field,
            name: field,
            type: 'text',
        }
        if (['date', 'datetime'].includes(type)) {
            columnConfig.type = type;
            columnConfig.valueFormat = 'x';
        }
        if (['richtext', 'markdown'].includes(type)) {
            columnConfig.breakpoint = '*';
        }
        return columnConfig;
    });
    return [...tableColumns, ...restColumns];
}

export function buildTableFilter(columns: Columns, filters: string[]) {
    const filterBody: any[] = [];

    filters.forEach((field) => {
        const initType = columns[field] || STATIC_FIELDS[field];
        const datatype = ['date', 'datetime'].includes(initType) ? 'daterange' : initType;
        filterBody.push({
            ...buildFormItem(`${WHERE_FIELD_PREFIX}${field}`, datatype),
            label: field
        });
        if (['date', 'datetime'].includes(initType)) {
            filterBody.push({
                type: 'input-text',
                label: `${field}-op`,
                name: `${WHERE_OP_PREFIX}${field}`,
                disabled: 'true',
                visibleOn: '',
                clearValueOnHidden: false,
                visible: false,
                value: 'range'
            });
        }
        if (initType === 'number') {
            filterBody.push({
                type: 'input-text',
                label: '隐藏类型',
                name: `${WHERE_OP_TYPE}${field}`,
                visibleOn: '',
                clearValueOnHidden: false,
                visible: false,
                value: 'number'
            })
        }
    });

    return {
        title: '查询条件',
        body: filterBody
    }
}

export function buildTable(signature: PageSignature) {
    return {
        type: 'crud',
        api: signature.queryApi,
        footable: true,
        columns: buildTableColumn(signature.columns).concat([
            {
                type: 'operation',
                label: '操作',
                buttons: [
                    buildModifyButton(signature),
                    buildDelButton(signature.deleteApi)
                ]
            }
        ]),
        filter: buildTableFilter(signature.columns, signature.filters)
    }
}
// BASE_HOST
// BASE_DATA_DOMAIN
export function buildPageBody(signatureJson: string) {
    const raw = JSON.parse(signatureJson);
    const {domain} = raw.data;
    const apis = {
        queryApi: `SERVER_HOST/api/lc/${domain}/list`,
        addApi: `SERVER_HOST/api/lc/${domain}/add`,
        deleteApi: `SERVER_HOST/api/lc/${domain}/delete/\${_id}`,
        modifyApi: `SERVER_HOST/api/lc/${domain}/modify`,
    }

    const signature = Object.assign(apis, raw) as PageSignature
    return [
        buildAddButton(signature),
        buildTable(signature)
    ];
}