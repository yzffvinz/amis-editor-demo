export default function genDefaultSignature() {
    return JSON.stringify({
        table: 'album',
        columns: {
            famous: 'boolean',
            name: 'string',
            age: 'number',
            category: {
                type: 'option',
                api: 'SERVER_HOST/api/lc/tag/options?labelField=displayName&valueField=name',
            },
            tags: {
                type: 'set',
                api: 'SERVER_HOST/api/lc/tag/options?labelField=displayName&valueField=name',
            },
            blogs: {
                type: 'array',
                api: 'SERVER_HOST/api/lc/blog/options?labelField=title&valueField=_id',
            },
            desc: 'markdown',
            content: 'richtext',
            birth: 'date',
            birthtime: 'datetime'
        },
        filters: [
            'famous',
            { field: 'title', op: '%' },
            { field: 'age', op: '>=' },
            'category',
            'tags',
            'blogs',
            { field: 'desc', op: '%' },
            { field: 'content', op: '%' },
            'birth',
            'birthtime'
        ]
    })
}