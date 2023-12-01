import {
    IProtyle,
    fetchSyncPost,
    Lute
} from "siyuan";
import "@/types/index.d"
import { lute } from "@/libs/utils";
import { DataViewBlock } from "./DataViewBlock";
import List from "@/view/list.svelte";
import Card from "@/view/card.svelte"
import Table from "@/view/table.svelte"
import Calendar from "@/view/calendar.svelte"
export class DataView {
    private SQLstmt: string;
    private queryList: Query[];
    private protyle: IProtyle
    private item: HTMLElement
    private top: number | null
    private lute:Lute
    private limitNumber:number
    blockList: DataViewBlock[]
    container: HTMLElement

    constructor(protyle: IProtyle, item: HTMLElement, top: number | null) {
        this.protyle = protyle
        this.item = item
        this.top = top
        this.SQLstmt = ""
        this.queryList = []
        this.container = document.createElement("div")
        this.container.classList.add('data-query-embed')
        this.item.lastElementChild.insertAdjacentElement("beforebegin", this.container);
        this.lute = lute
        this.limitNumber = 256
    }

    async query() {
        let queryBody: string
        if (this.SQLstmt) {
            queryBody = this.SQLstmt
        }
        else {
            queryBody = this.buildSQLstmt(this.queryList)
        }
        let sqlData: Block[] = (await fetchSyncPost('/api/query/sql', { stmt: queryBody })).data
        let idList = (sqlData).map(x => x.id)
        let iblocks: BlockItem[] = (await fetchSyncPost("/api/search/getEmbedBlock", {
            embedBlockID: this.item.getAttribute("data-node-id"),
            includeIDs: idList,
            headingMode: this.item.getAttribute("custom-heading-mode") === "1" ? 1 : 0,
            breadcrumb: false
        })).data.blocks
        this.blockList = this.buildBlockList(iblocks, sqlData)
        return this.blockList
    }

    sql(SQLstmt: string) {
        this.SQLstmt = SQLstmt
        return this
    }

    cleanQuery() {
        this.SQLstmt = ""
        this.queryList = []
        return this
    }

    id(id, operator: string = "like") {
        switch (operator) {
            default:
                this.queryList.push({
                    type: "id",
                    value: `'%${id}%'`,
                    operator: operator
                })
        }

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

    ial(ialKey, ialValue, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "ial",
                    value: { ialKey: `'%custom-${ialKey}%'`, ialValue: `'%${ialValue}%'` },
                    operator: operator
                })
                break
            default:
                this.queryList.push({
                    type: "ial",
                    value: { ialKey: `'custom-${ialKey}'`, ialValue: `'${ialValue}'` },
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
    limit(limit:number){
        this.limitNumber = limit
    }
    buildSQLstmt(queryList: Query[]) {
        //using
        let stmt = "select * from blocks where "
        let queryStmt = []
        for (let queryItem of queryList) {
            queryStmt.push(this.genQuery(queryItem))
        }

        stmt += queryStmt.join(" AND ")
        stmt += ` limit ${this.limitNumber} `
        return stmt
    }

    private genQuery(queryItem: Query) {
        switch (queryItem.type) {
            case "ial":
                return `  id in (select block_id from attributes where name ${queryItem.operator} ${(queryItem.value as any).ialKey} and value ${queryItem.operator} ${(queryItem.value as any).ialValue}) `
            case "tag":
                return `  (tag ${queryItem.operator} ${queryItem.value} OR markdown ${queryItem.operator} ${queryItem.value})`
            default:
                return ` ${queryItem.type} ${queryItem.operator} ${queryItem.value} `
        }
    }

    buildBlockList(iblocks: BlockItem[], sqlData: Block[]) {
        let ret: DataViewBlock[] = []
        let idList = (iblocks).map(x => x.block.id)
        for (let id of idList) {
            let blockItem = iblocks.find(x => x.block.id === id)
            let sqlItem = sqlData.find(x => x.id === id)
            let DVblock = new DataViewBlock(blockItem, sqlItem)
            ret.push(DVblock)
        }
        return ret
    }

    addElement(CustomEmbed: HTMLElement | string ){
        const customElem = document.createElement("div")

        if (typeof CustomEmbed === 'string') {
            const html = `<div class="protyle-wysiwyg__embed">${CustomEmbed}</div>`
            customElem.innerHTML = html
        }
        else if (CustomEmbed instanceof Element) {
            customElem.appendChild(CustomEmbed)
        }
        
        this.container.append(customElem)
    }

    addMarkdown(md:string){
        let elem = document.createElement("div")
        elem.innerHTML = this.lute.Md2BlockDOM(md)
        this.container.append(elem)
    }

    list(data:any[]){
        let listContainer = document.createElement("div")
        new List({
            target: listContainer,
            props: {
                // we'll learn about props later
                dataList:data
            }
        })
        this.container.append(listContainer)
    }

    card(data:any[]){
        let cardContainer = document.createElement('div')
        new Card({
            target:cardContainer,
            props:{
                data:data
            }
        })
        this.container.append(cardContainer)
    }
    table(data:any[]){
        let tableContainer = document.createElement('div')
        new Table({
            target:tableContainer,
            props:{
                tableData : data
            }
        })
        this.container.append(tableContainer)
    }

    calendar(data:any[],option:{
        type:"custom"|'database'|"block"
        blockType:"updated"|"created"|"between"
    }|null){
        if (!option){
            option = {
                type:"block",
                blockType:"created"
        }
        }
        let calendarContainer = document.createElement('div')
        
        if(data.every(x=>x instanceof DataViewBlock)){
            console.log("is block")
            data = data.map(x=>{
                let start:Date
                let end:Date
                let hour
                switch(option.blockType){
                    case "created":
                        start = x.getValue("created")
                        end = x.getValue("created")  
                        hour = start.getHours()
                        end.setHours(hour+1) 
                        break;
                    case "updated":
                        start = x.getValue("updated")
                        end = x.getValue("updated")  
                        hour = start.getHours()
                        end.setHours(hour+1)
                        break;
                    case "between":
                        start = x.getValue("created")
                        end = x.getValue("updated")  
                }
                let content =  x.getValue("content")
                return {
                start: start,
                end: end,
                title: content,
                nodeId: x.getValue("id"),
                color:`var(--b3-font-background${content.charCodeAt(0) % 13+1})`
            }})
        }
        if (option.type === 'database'){
            data = data.map(x=>{
                let dataDate = x[0].getValue(x[1]).value
                let start
                let end
                if (!(dataDate instanceof Date)){
                    start=dataDate.startDate
                    end = dataDate.endDate
                    let hour = end.getHours()
                    end.setHours(hour+1)
                }
                else{
                    start = x[0].getValue(x[1]).value
                    end = x[0].getValue(x[1]).value
                    let hour = start.getHours()
                    end.setHours(hour+1)
                }
                let content =  x[0].getValue("content")
                return {
                    start: start,
                    end: end,
                    title: content,
                    nodeId: x[0].getValue("id"),
                    color:`var(--b3-font-background${content.charCodeAt(0) % 13+1})`
                }
            })
        }
        console.log(data)
        new Calendar({
            target:calendarContainer,
            props:{
                calendarData : data
            }
        })
        this.container.append(calendarContainer)
    }

    show() {

        this.protyle.element.addEventListener("keydown", cancelKeyEvent, true)
        const rotateElement = this.item.querySelector(".fn__rotate");
                
        if (rotateElement) {
            rotateElement.classList.remove("fn__rotate");
        }

        this.container.setAttribute("contenteditable", "false")
        this.container.onmousedown = (el) => { el.stopPropagation() }
        this.container.onmouseup = (el) => { el.stopPropagation() }
        this.container.onkeydown = (el) => { el.stopPropagation() }
        this.container.onkeyup = (el) => { el.stopPropagation() }
        this.container.oninput = (el) => { el.stopPropagation() }
        this.container.onclick = (el) => {
            const selection = window.getSelection();
            const length = selection.toString().length;
            if (length === 0 && (el.target as HTMLElement).tagName === "SPAN") {
                return
            }
            el.stopPropagation()
        }

        if (this.top) {
            // 前进后退定位 https://ld246.com/article/1667652729995
            this.protyle.contentElement.scrollTop = this.top;
        }

        // 确保内部节点不可编辑
        let editableNodeList = this.container.querySelectorAll('[contenteditable="true"]')
        editableNodeList.forEach(node=>{
            node.setAttribute('contenteditable','false')
        })

        this.item.style.height = "";
        let content = lute.BlockDOM2Content(this.container.innerText).replaceAll('\n',' ')
        fetchSyncPost('/api/search/updateEmbedBlock',{
            id:this.item.getAttribute("data-node-id"),
            content:content
        })
    }
    static uniBlocks(blocks: DataViewBlock[], mode: 'max' | 'min') {
        // 正则表达式用于匹配所有的data-node-id值
        const idRegex = /data-node-id="([^"]+)"/g;
        let blockMap = new Map();
        let parentChildMap = new Map();

        // 首先，构建一个包含所有block ID的集合
        let allBlockIds = new Set(blocks.map(block => block.getValue('id')));

        // 遍历blocks，提取所有的id，并建立父子关系
        blocks.forEach(block => {
            let dom = block.getValue('dom');
            let match;
            let parentId = null;

            blockMap.set(block.getValue('id'), block);

            while ((match = idRegex.exec(dom)) !== null) {
                let id = match[1];

                if (parentId === null) {
                    parentId = id; // 第一个匹配的id是父id
                } else if (parentId !== id) {
                    let children = parentChildMap.get(parentId) || new Set();
                    children.add(id);
                    parentChildMap.set(parentId, children);
                }
            }
        });

        // 根据模式过滤blocks
        let filteredBlocks: DataViewBlock[];

        if (mode === 'max') {
            // 移除所有子block
            filteredBlocks = blocks.filter(block => {
                return ![...parentChildMap.values()].some(children => children.has(block.getValue('id')));
            });
        } else if (mode === 'min') {
            // 移除所有在block列表中有子block的block
            filteredBlocks = blocks.filter(block => {
                let children = parentChildMap.get(block.getValue('id')) || new Set();
                // 保留那些子block不在block列表中的block
                return [...children].every(childId => !allBlockIds.has(childId));
            });
        } else {
            throw new Error('Invalid mode. Use "max" or "min".');
        }

        return filteredBlocks;
    }
}


function cancelKeyEvent(el: KeyboardEvent) {
    let nodeElement: HTMLElement = document.getSelection().getRangeAt(0).startContainer.parentElement
    if (hasParentWithClass(nodeElement, "data-query-embed")) {
        el.stopPropagation()
    }
}



function hasParentWithClass(element: HTMLElement, className: string) {

    // 获取父元素
    let parent = element.parentElement;

    // 通过while循环遍历父元素
    while (parent && !parent.classList.contains('protyle-wysiwyg--attr')) {

        // 检查父元素是否包含指定class
        if (parent.classList.contains(className)) {
            return true;
        }

        // 继续向上获取父元素
        parent = parent.parentElement;
    }

    return false;
}
