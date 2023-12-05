import {
    fetchSyncPost,
} from "siyuan";
import "@/types/index.d"
import { isNumeric, isValidDate, isValidJSON, parseDatabaseValue, parseDateString } from "@/libs/utils";

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
        this.databaseAttr = null
        // this.blockKeys = Object.keys(blockItem.block)
        // this.ialKeys = Object.keys(blockItem.block.ial)
    }

    get dom() {
        return this.blockItem.block['content']
    }

    getValue(key: string) {
        // console.log("av")
        if (key === "dom") {
            return this.dom
        }
        //sqldata 和 blockItem.block 只有'created','updated' 需要解析
        if (this.sqlData[key]) {
            if (['created','updated'].indexOf(key)!=-1){
            return this.parseCommonValue(this.sqlData[key])
            }
            return this.sqlData[key]
        }
        if (this.blockItem.block[key]) {
            return this.blockItem.block[key]
        }
        if (this.blockItem.block.ial[key]) {
            return this.parseCommonValue(this.blockItem.block.ial[key])
        }
        if (this.blockItem.block.ial[`custom-${key}`]) {
            return this.parseCommonValue(this.blockItem.block.ial[`custom-${key}`])
        }
        //部分块没有updated, 直接返回created
        if (key === "updated") {
            return this.getValue("created")
        }
        if (this.databaseAttr != null) {
            let searchValue = this.searchKeyValues(key)
            if (searchValue != null) {
                return parseDatabaseValue(searchValue)
            }
            else{
                return ''
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
            return parseDatabaseValue(searchValue)
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

    private parseCommonValue(str:string){
        if(isValidDate(str)){
            return parseDateString(str)
        }
        if (isNumeric(str)){
            return Number(str)
        }
        if (isValidJSON(str)){
            return JSON.parse(str)
        }
        return str
    }
}