import generateAmisItem, {VItemType, normalizeItmeProps} from './AmisItemUtil';


interface VPageSchema {
    table: string,
    columns: any,
    filters: any[]
}

interface VApis {
    query: string;
    add: string;
    del: string;
    mod: string;
}


// 创建 api
function buildApis(table: string): VApis {
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

function buildItems(itemType: VItemType, pageSchema: VPageSchema) {
    const { columns, filters } = pageSchema;
    let rst = [];
    if (itemType === 'filter') {
        const props = filters.map(filter => {
            const filterKey = typeof filter === 'string' ? filter : filter.field
            return normalizeItmeProps(filterKey, columns[filterKey], filter);
        })
        const items = props.map(item => generateAmisItem(itemType, item));
        rst = items.reduce((sum, cur) => [...sum, ...cur], []);
    } else {
        const props = Object.keys(columns).map(columnKey => normalizeItmeProps(columnKey, columns[columnKey]));
        const items = props.map(prop => generateAmisItem(itemType, prop));
        rst = items.reduce((sum, cur) => [...sum, ...cur], []);
    }
    return rst;
}

function buildAddButton(title: string, api: string, pageSchema: VPageSchema) {
    return {
        type: 'button',
        label: '新增',
        actionType: 'dialog',
        level: 'primary',
        className: 'm-b-sm',
        dialog: {
            title: `新增 ${title}`,
            size: 'full',
            body: {
                type: 'form',
                title: '表单',
                body: buildItems('input', pageSchema),
                api
            }
        }
    }
}

function buildActions(title: string, apis: VApis, pageSchema: VPageSchema): any {
    return [{
        type: 'operation',
        label: '操作',
        buttons: [
            {
                label: '修改',
                type: 'button',
                actionType: 'drawer',
                drawer: {
                    title: `修改 ${title}`,
                    size: 'xl',
                    body: {
                        type: 'form',
                        api: {
                            method: 'post',
                            url: apis.mod
                        },
                        body: [{
                            label: '_id',
                            name: '_id',
                            value: '${_id}',
                            type: 'static'
                        }].concat(buildItems('input', pageSchema) as any[]) 
                    }
                }
            },
            {
                label: '删除',
                type: 'button',
                actionType: 'ajax',
                level: 'danger',
                confirmText: '确认要删除？',
                api: apis.del
            }
        ]
    }];
}

function buildCrud(title: string, apis: VApis, pageSchema: VPageSchema) {
    return {
        type: 'crud',
        api: {
            method: 'post',
            url: apis.query
        },
        columns: buildItems('column', pageSchema).concat(buildActions(title, apis, pageSchema)),
        filter: {
            title: `${title} 查询条件`,
            body: buildItems('filter', pageSchema)
        },
        footable: true
    };
}

export default function initPage(title: string, raw: string) {
    const schema = JSON.parse(raw) as VPageSchema;
    const apis = buildApis(schema.table);

    return [
        buildAddButton(title, apis.add, schema),
        buildCrud(title, apis, schema)
    ]
}