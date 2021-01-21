import Realm from 'realm'
import { ListsSchema, ItemSchema, PreListSchema, PreListItemSchema } from '../schemas/ListsSchema.js'

export default function getRealm() {

    return Realm.open({
        schema: [ListsSchema, ItemSchema, PreListSchema, PreListItemSchema],
        schemaVersion: 15
    })
}