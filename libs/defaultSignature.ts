export default function genDefaultSignature() {
    return JSON.stringify({
        table: '',
        columns: {
            content: 'string',
            imgs: 'string',
            createtime: 'datetime',
            updatetime: 'datetime',
            hide: 'number'
        },
        filters: [
            'content',
            'createtime',
            'updatetime'
        ]
    })
}