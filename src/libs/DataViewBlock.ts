import {
    fetchSyncPost,
} from "siyuan";
import "@/types/index.d"

export class DataViewBlock {
    // private blockKeys:string[]
    // private ialKeys:string[]
    private databaseAttr: AV[]
    private sqlData: Block
    blockItem: BlockItem

    constructor(
        blockItem: {
            block: IBlock,
            blockPaths: IBreadcrumb[]
        },
        sqlData: Block) {
        this.blockItem = blockItem
        this.sqlData = sqlData
        // this.blockKeys = Object.keys(blockItem.block)
        // this.ialKeys = Object.keys(blockItem.block.ial)
    }

    get dom() {
        return this.blockItem.block['content']
    }

    getValue(key: string) {
        console.log("av")
        if (key === "dom") {
            return this.dom
        }
        if (this.sqlData[key]) {
            return this.sqlData[key]
        }
        if (this.blockItem.block[key]) {
            return this.blockItem.block[key]
        }
        if (this.blockItem.block.ial[key]) {
            return this.blockItem.block.ial[key]
        }
        if (this.blockItem.block.ial[`custom-${key}`]) {
            return this.blockItem.block.ial[`custom-${key}`]
        }
        if (this.databaseAttr) {
            let searchValue = this.searchKeyValues(key)
            if (searchValue != null) {
                return searchValue
            }
        }
        return this.getValueFromDatabase(key)
    }
    getValueFromSql(key: string) {
        if (this.sqlData[key]) {
            return this.sqlData[key]
        }
        return ''
    }
    getValueFromIal(key: string) {
        if (this.blockItem.block.ial[key]) {
            return this.blockItem.block.ial[key]
        }
        if (this.blockItem.block.ial[`custom-${key}`]) {
            return this.blockItem.block.ial[`custom-${key}`]
        }
        return ''
    }
    async getValueFromDatabase(key: string) {
        if (!this.databaseAttr) {
            this.getDatabase()
        }

        let searchValue = this.searchKeyValues(key)
        if (searchValue != null) {
            return searchValue
        }
        return ''
    }
    async getDatabase() {
        let databaseAttrData = await fetchSyncPost('/api/av/getAttributeViewKeys', { "id": this.blockItem.block.id })
        this.databaseAttr = databaseAttrData.data
    }
    private searchKeyValues(searchKey: string) {
        for (let doc of this.databaseAttr) {
            for (let kv of doc.keyValues) {
                if (kv.key.name === searchKey) {
                    return kv;
                }
            }
        }
        return null;
    }
}