import {
    IProtyle,
    fetchSyncPost,
    Lute
} from "siyuan";
import "@/types/index.d"
import { lute } from "@/libs/utils";
import { DataViewBlock } from "./DataViewBlock";
import List from "@/view/list.svelte";
export class DataView {
    private SQLstmt: string;
    private queryList: Query[];
    private protyle: IProtyle
    private item: HTMLElement
    private top: number | null
    private lute:Lute
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

    value(ialKey, ialValue, operator: string = "like") {
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
    buildSQLstmt(queryList: Query[]) {
        //using
        let stmt = "select * from blocks where "
        let queryStmt = []
        for (let queryItem of queryList) {
            queryStmt.push(this.genQuery(queryItem))
        }

        stmt += queryStmt.join(" AND ")
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

        this.item.style.height = "";
        
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
