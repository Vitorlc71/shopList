
const ListsSchema = {
    name: 'ListsSchema',
    primaryKey: 'id',
    properties: {
        id: 'int',
        titulo: 'string',
        date: 'string',
        total: 'float',
        items: { type: 'list', objectType: 'ItemSchema' }
    }
}

const ItemSchema = {
    name: 'ItemSchema',
    properties: {
        id: 'int',
        description: 'string',
        quantidade: 'string',
        price: 'string',
        total: 'float'
    }
}

const PreListSchema = {
    name: 'PreListSchema',
    primaryKey: 'id',
    properties: {
        id: 'int',
        titulo: 'string',
        date: 'string',
        total: 'float',
        items: { type: 'list', objectType: 'PreListItemSchema' }
    }
}

const PreListItemSchema = {
    name: 'PreListItemSchema',
    properties: {
        id: 'int',
        description: 'string',
        quantidade: 'string',
        price: 'string',
        total: 'float'
    }
}

export { ListsSchema, ItemSchema, PreListSchema, PreListItemSchema }