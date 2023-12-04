import {
    IProtyle,
    fetchSyncPost,
    Lute
} from "siyuan";
import "@/types/index.d"
import { lute } from "@/libs/utils";
import { DataViewBlock } from "./DataViewBlock";
import { DataQuery } from "./DataQuery";
import List from "@/view/list.svelte";
import Card from "@/view/card.svelte"
import Table from "@/view/table.svelte"
import Calendar from "@/view/calendar.svelte"

export class DataView extends DataQuery{
    private protyle: IProtyle
    private item: HTMLElement
    private top: number | null
    private lute:Lute
    container: HTMLElement

    constructor(protyle: IProtyle, item: HTMLElement, top: number | null) {
        super()
        this.protyle = protyle
        this.item = item
        this.top = top
        this.container = document.createElement("div")
        this.container.classList.add('data-query-embed')
        this.item.lastElementChild.insertAdjacentElement("beforebegin", this.container);
        this.lute = lute

    }

    static DataQuery(){
        return new DataQuery()
    }

    static DataViewBlock(blockItem: {
        block: IBlock,
        blockPaths: IBreadcrumb[]
    },
    sqlData: Block){
        return new DataViewBlock(blockItem, sqlData)
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
        console.log('calendar')
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
                let dom = x.getValue("dom")
                return {
                start: start,
                end: end,
                title: {html:dom},
                resourceIds: [x.getValue("id")],
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
                let dom = x[0].getValue("dom")
                return {
                    start: start,
                    end: end,
                    title: {html:dom},
                    resourceIds: [x[0].getValue("id")],
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
