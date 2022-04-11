import {types, getEnv, applySnapshot, getSnapshot} from 'mobx-state-tree';
import {PageStore} from './Page';
import {when, reaction} from 'mobx';
import axios from 'axios';
import { toast } from 'amis';
import { SERVER_HOST } from '../libs/Constants';

let schemaId = '';
const moduleId = 'blog_config';
let pagIndex = 1;
let updateLoading = false;


function getPageConfig(): any {
    function doQuery() {
        return axios.get(SERVER_HOST + '/api/lc/pages/list', {
            params: {
                where_field_moduleId: moduleId
            }
        }).then((data: any) => {
            if (data.data.status) {
                toast.error(data.data.msg)
            } else {
                const {schema, version: v} = data?.data?.data?.rows?.[0] || {};
                schemaId = data?.data?.data?.rows?.[0]?._id;
                return schema
            }
        })
    }
    return doQuery().then(schema => {
        return schema
            ? schema
            : updatePageConfig({}).then(doQuery)
    });
}

function updatePageConfig(schema: any): any {
    if (schemaId) {
        return axios.post(SERVER_HOST + '/api/lc/pages/modify', {
            _id: schemaId,
            moduleId,
            schema
        }).then(data => {
            if (data.data.status) {
                toast.error(data.data.msg)
            }
        });
    } else {
        return axios.post(SERVER_HOST + '/api/lc/pages/add', {
            moduleId,
            schema
        }).then(data => {
            schemaId = data.data.insertedId;
        });
    }
}

export const MainStore = types
    .model('MainStore', {
        pages: types.optional(types.array(PageStore), [
            {
                id: `${pagIndex}`,
                path: 'hello-world',
                label: 'Hello world',
                icon: 'fa fa-file',
                schema: {
                    type: 'page',
                    title: 'Hello world',
                    body: '初始页面'
                }
            }
        ]),
        theme: 'cxd',
        asideFixed: true,
        asideFolded: false,
        offScreen: false,
        addPageIsOpen: false,
        preview: false,
        isMobile: false,
        schema: types.frozen()
    })
    .views(self => ({
        get fetcher() {
            return getEnv(self).fetcher;
        },
        get notify() {
            return getEnv(self).notify;
        },
        get alert() {
            return getEnv(self).alert;
        },
        get copy() {
            return getEnv(self).copy;
        }
    }))
    .actions(self => {
        function toggleAsideFolded() {
            self.asideFolded = !self.asideFolded;
        }

        function toggleAsideFixed() {
            self.asideFixed = !self.asideFixed;
        }

        function toggleOffScreen() {
            self.offScreen = !self.offScreen;
        }

        function setAddPageIsOpen(isOpened: boolean) {
            self.addPageIsOpen = isOpened;
        }

        function addPage(data: {label: string; path: string; icon?: string; schema?: any}) {
            self.pages.push(
                PageStore.create({
                    ...data,
                    id: `${++pagIndex}`
                })
            );
        }

        function removePageAt(index: number) {
            self.pages.splice(index, 1);
        }

        function updatePageSchemaAt(index: number) {
            self.pages[index].updateSchema(self.schema);
        }

        function updateSchema(value: any) {
            self.schema = value;
        }

        function setPreview(value: boolean) {
            self.preview = value;
        }

        function setIsMobile(value: boolean) {
            self.isMobile = value;
        }

        return {
            toggleAsideFolded,
            toggleAsideFixed,
            toggleOffScreen,
            setAddPageIsOpen,
            addPage,
            removePageAt,
            updatePageSchemaAt,
            updateSchema,
            setPreview,
            setIsMobile,
            afterCreate() {
                getPageConfig().then((schema: any) => applySnapshot(self, schema))

                reaction(
                    () => getSnapshot(self),
                    (json: any) => {
                        updatePageConfig(json)
                    }
                );
            }
        };
    });

export type IMainStore = typeof MainStore.Type;
