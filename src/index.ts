import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    IWebSocketData,
    IProtyle,
    fetchSyncPost
} from "siyuan";
import "@/index.scss";
import "@/types/index.d"


import { SettingUtils } from "./libs/setting-utils";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class PluginSample extends Plugin {

    private isMobile: boolean;
    private settingUtils: SettingUtils;

    async onload() {
        
        console.log(this.i18n.helloPlugin);
        window.DataViewBlock = DataViewBlock
        window.DV = DV
    }

    onLayoutReady() {
       
    }

    async onunload() {
        console.log(this.i18n.byePlugin);
        await this.settingUtils.save();
        showMessage("Goodbye SiYuan Plugin");
        console.log("onunload");
    }

    /**
     * A custom setting pannel provided by svelte
     */
    openDIYSetting(): void {
        
    }

    private eventBusPaste(event: any) {
        // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
        event.preventDefault();
        // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
        event.detail.resolve({
            textPlain: event.detail.textPlain.trim(),
        });
    }

    private eventBusLog({ detail }: any) {
        console.log(detail);
    }
}

type Query = {
    type:'parent_id' | 'root_id' | 'hash' | 'box' | 'path' | 'hpath' | 'name' | 'alias' | 'memo' | 'tag' | 'content' | 'fcontent' | 'markdown' | 'length' | 'type' | 'subtype' | 'ial' | 'sort' | 'created' | 'updated';
    operator:string;
    value:Object|string|number|Date;
}

interface KeyValue {
    key: any; 
    values: any[];
  }
  
  interface AV {
    avID: string;
    avName: string; 
    blockIDs: string[];
    keyValues: KeyValue[];  
  }

interface BlockItem {
    block: IBlock,
    blockPaths: IBreadcrumb[]
}

class DataViewBlock{
    // private blockKeys:string[]
    // private ialKeys:string[]
    private databaseAttr:AV[]
    private sqlData:Block
    blockItem: BlockItem

    constructor(
        blockItem: {
            block: IBlock,
            blockPaths: IBreadcrumb[]
        },
        sqlData:Block){
        this.blockItem = blockItem
        this.sqlData = sqlData
        // this.blockKeys = Object.keys(blockItem.block)
        // this.ialKeys = Object.keys(blockItem.block.ial)
    }

    get dom(){
        return this.blockItem.block['content']
    }

    getValue(key:string){
        console.log("av")
        if (key === "dom"){
            return this.dom
        }
        if (this.sqlData[key]){
            return this.sqlData[key]
        }
        if (this.blockItem.block[key]){
            return this.blockItem.block[key]
        }
        if (this.blockItem.block.ial[key]){
            return this.blockItem.block.ial[key]
        }
        if (this.blockItem.block.ial[`custom-${key}`]){
            return this.blockItem.block.ial[`custom-${key}`]
        }
        if (this.databaseAttr){
            let searchValue = this.searchKeyValues(key)
            if (searchValue != null){
                return searchValue
            }
        }
        return this.getValueFromDatabase(key)
    }
    getValueFromSql(key:string){
        if (this.sqlData[key]){
            return this.sqlData[key]
        }
        return ''
    }
    getValueFromIal(key:string){
        if (this.blockItem.block.ial[key]){
            return this.blockItem.block.ial[key]
        }
        if (this.blockItem.block.ial[`custom-${key}`]){
            return this.blockItem.block.ial[`custom-${key}`]
        }
        return ''
    }
    async getValueFromDatabase(key:string){
        if (!this.databaseAttr){
            this.getDatabase()
        }
        
        let searchValue = this.searchKeyValues(key)
        if (searchValue != null){
            return searchValue
        }
        return ''
    }
    async getDatabase(){
        let databaseAttrData = await fetchSyncPost('/api/av/getAttributeViewKeys',{"id":this.blockItem.block.id})
        this.databaseAttr = databaseAttrData.data
    }
    private searchKeyValues(searchKey:string) {
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

class DV{
    private SQLstmt: string;
    private queryList: Query[];
    private protyle:IProtyle
    private item:HTMLElement
    private top:number|null
    blockList:DataViewBlock[]

    constructor(protyle:IProtyle,item:HTMLElement,top:number|null){
        this.protyle = protyle
        this.item = item
        this.top = top
        this.SQLstmt = ""
        this.queryList = []
    }

    async query(){
        let queryBody:string
        if (this.SQLstmt){
            queryBody = this.SQLstmt
        }
        else{
            queryBody = this.buildSQLstmt(this.queryList)
        }
        let sqlData:Block[] = (await fetchSyncPost('/api/query/sql',{stmt: queryBody})).data
        let idList = (sqlData).map(x=>x.id)
        let iblocks:BlockItem[] = (await fetchSyncPost("/api/search/getEmbedBlock",{
            embedBlockID: this.item.getAttribute("data-node-id"),
            includeIDs: idList,
            headingMode: this.item.getAttribute("custom-heading-mode") === "1" ? 1 : 0,
            breadcrumb:false
        })).data.blocks
        this.blockList = this.buildBlockList(iblocks,sqlData)
        return this.blockList
    }

    sql(SQLstmt:string){
        this.SQLstmt = SQLstmt
        return this
    }

    cleanQuery(){
        this.SQLstmt = ""
        this.queryList = []
        return this
    }

    parent_id(parent_id, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "parent_id",
                    value: `'%${parent_id}%'`,
                    operator: operator
                })
        }

        return this
    }

    root_id(root_id, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "root_id",
                    value: `'%${root_id}%'`,
                    operator: operator
                })
        }

        return this
    }

    hash(hash, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "hash",
                    value: `'%${hash}%'`,
                    operator: operator
                })
        }

        return this
    }

    box(box, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "box",
                    value: `'%${box}%'`,
                    operator: operator
                })
        }

        return this
    }

    path(path, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "path",
                    value: `'%${path}%'`,
                    operator: operator
                })
        }

        return this
    }

    hpath(hpath, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "hpath",
                    value: `'%${hpath}%'`,
                    operator: operator
                })
        }

        return this
    }

    name(name, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "name",
                    value: `'%${name}%'`,
                    operator: operator
                })
        }

        return this
    }

    alias(alias, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "alias",
                    value: `'%${alias}%'`,
                    operator: operator
                })
        }

        return this
    }

    memo(memo, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "memo",
                    value: `'%${memo}%'`,
                    operator: operator
                })
        }

        return this
    }

    tag(tag, operator: string = "like") {
        switch (operator) {
            case "withSub":
                this.queryList.push({
                    type: "tag",
                    value: `'#${tag}[^#\n]*#'`,
                    operator: "REGEXP"
                })
                break;
            case "like":
                this.queryList.push({
                    type: "tag",
                    value: `'%#${tag}#%'`,
                    operator: "like"
                })
                break;
            default:
                this.queryList.push({
                    type: "tag",
                    value: `'%${tag}%'`,
                    operator: operator
                })
        }

        return this
    }

    content(content, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "content",
                    value: `'%${content}%'`,
                    operator: operator
                })
        }

        return this
    }

    fcontent(fcontent, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "fcontent",
                    value: `'%${fcontent}%'`,
                    operator: operator
                })
        }

        return this
    }

    markdown(markdown, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "markdown",
                    value: `'%${markdown}%'`,
                    operator: operator
                })
        }

        return this
    }

    length(length, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "length",
                    value: `'%${length}%'`,
                    operator: operator
                })
        }

        return this
    }

    type(type, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "type",
                    value: `'%${type}%'`,
                    operator: operator
                })
        }

        return this
    }

    subtype(subtype, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "subtype",
                    value: `'%${subtype}%'`,
                    operator: operator
                })
        }

        return this
    }

    value(ialKey,ialValue, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "ial",
                    value: {ialKey:`'%custom-${ialKey}%'`,ialValue:`'%${ialValue}%'`},
                    operator: operator
                })
                break
            default:
                this.queryList.push({
                    type: "ial",
                    value: {ialKey:`'custom-${ialKey}'`,ialValue:`'${ialValue}'`},
                    operator: operator
                })
        }

        return this
    }

    sort(sort, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "sort",
                    value: `'%${sort}%'`,
                    operator: operator
                })
        }

        return this
    }

    created(created, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "created",
                    value: `'%${created}%'`,
                    operator: operator
                })
        }

        return this
    }

    updated(updated, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "updated",
                    value: `'%${updated}%'`,
                    operator: operator
                })
        }

        return this
    }
    buildSQLstmt(queryList: Query[]){
        //using
        let stmt = "select * from blocks where "
        let queryStmt = []
        for (let queryItem of queryList){
            queryStmt.push(this.genQuery(queryItem))
        }
        
        stmt += queryStmt.join(" AND ")
        return stmt
    }

     private genQuery(queryItem:Query){
        switch(queryItem.type){
            case "ial":
                return `  id in (select block_id from attributes where name ${queryItem.operator} ${(queryItem.value as any).ialKey} and value ${queryItem.operator} ${(queryItem.value as any).ialValue}) `
            case "tag":
                return `  (tag ${queryItem.operator} ${queryItem.value} OR markdown ${queryItem.operator} ${queryItem.value})`
            default:
                return ` ${queryItem.type} ${queryItem.operator} ${queryItem.value} `
        }
     }
    
    buildBlockList(iblocks:BlockItem[],sqlData:Block[]){
        let ret:DataViewBlock[] = []
        let idList = (iblocks).map(x=>x.block.id)
        for (let id of idList){
            let blockItem = iblocks.find(x=>x.block.id === id)
            let sqlItem = sqlData.find(x=>x.id === id)
            let DVblock = new DataViewBlock(blockItem,sqlItem)
            ret.push(DVblock)
        }
        return ret
    }

    show(CustomEmbed:HTMLElement|string){
       const rotateElement = this.item.querySelector(".fn__rotate");
       if (rotateElement) {
           rotateElement.classList.remove("fn__rotate");
       }
       const customElem = document.createElement("div")
       if(typeof CustomEmbed === 'string'){
           const html = `<div class="protyle-wysiwyg__embed">${CustomEmbed}</div>`
           customElem.innerHTML = html
           this.item.lastElementChild.insertAdjacentElement("beforebegin", customElem);
       }
       else if(CustomEmbed instanceof Element){
           customElem.appendChild(CustomEmbed)
           this.item.lastElementChild.insertAdjacentElement("beforebegin", customElem)
       }
       customElem.setAttribute("contenteditable","false")
       customElem.onmousedown = (el)=>{el.stopPropagation()}
       customElem.onclick = (el)=>{el.stopPropagation()}
       customElem.onmouseup = (el)=>{el.stopPropagation()}
       if (this.top) {
           // 前进后退定位 https://ld246.com/article/1667652729995
           this.protyle.contentElement.scrollTop = this.top;
       }
       this.item.style.height = "";
   }
}

