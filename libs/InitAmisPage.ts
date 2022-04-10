import {
    FIELD_ID, FIELD_TYPES_CONFIG, STATIC_FIELDS,
    WHERE_FIELD_PREFIX, WHERE_OP_PREFIX, WHERE_TYPE_PREFIX
} from './Constants';


interface VPageSchema {
    table: string,
    columns: any,
    filters: any[]
}

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

function buildItem(name: string, type: string) {

    return { name, label: name };
}

function buildInputText(name: string) {
    return  { name, label: name, type: 'input-text' };
}

function buildInputNumber(name: string) {}


// 创建 api
function buildApis(table: string): {[key: string]: string} {
    return {
        query: `SERVER_HOST/api/lc/${table}/list`,
        add: `SERVER_HOST/api/lc/${table}/add`,
        del: `SERVER_HOST/api/lc/${table}/delete/\${_id}`,
        mod: `SERVER_HOST/api/lc/${table}/modify`,
    }
}
function buildModifyItem() {
}

function buildTableFilterItem() {
}

function buildAddItems(pageSchema: VPageSchema) {
    const { columns, filters } = pageSchema;
    const normalFilters = filters.map(filter => {})
}

function buildAddButton(title: string, api: string, pageSchema: VPageSchema) {
    return {
        type: 'button',
        label: '新增',
        actionType: 'dialog',
        level: 'primary',
        className: 'm-b-sm',
        dialog: {
            title: `新增${title}`,
            body: {
                type: 'form',
                title: '表单',
                body: buildAddItems(pageSchema),
                api
            }
        }
    }
}

export default function initPage(title: string, raw: string) {
    const schema = JSON.parse(raw) as VPageSchema;
    const apis = buildApis(schema.table);

    return {
        type: 'page',
        title,
        body: [
            buildAddButton(title, apis.add, schema)
        ]
    }
}