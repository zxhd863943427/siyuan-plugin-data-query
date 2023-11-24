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
    type:string;
    operator:string;
    value:string;
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

class DataViewBlock{
    private blockKeys:string[]
    private ialKeys:string[]
    private databaseAttr:AV[]
    private sqlData:Block
    blockItem: {
        block: IBlock,
        blockPaths: IBreadcrumb[]
    }

    constructor(
        blockItem: {
            block: IBlock,
            blockPaths: IBreadcrumb[]
        },sqlData){
        this.blockItem = blockItem
        this.sqlData = sqlData
        this.blockKeys = Object.keys(blockItem.block)
        this.ialKeys = Object.keys(blockItem.block.ial)
    }
    async getValue(key:string){
        console.log("av")
        if (this.blockItem.block[key]){
            return this.blockItem.block[key]
        }
        if (this.sqlData[key]){
            return this.sqlData[key]
        }
        if (this.blockItem.block.ial[key]){
            return this.blockItem.block.ial[key]
        }
        if (this.blockItem.block.ial[`custom-${key}`]){
            return this.blockItem.block.ial[`custom-${key}`]
        }
        if (!this.databaseAttr){
            let databaseAttrData = await fetchSyncPost('/api/av/getAttributeViewKeys',{"id":this.blockItem.block.id})
            this.databaseAttr = databaseAttrData.data
        }
        
        let searchValue = this.searchKeyValues(key)
        if (searchValue != null){
            return searchValue
        }
        return ''
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

class DataView{
    private SQLstmt: string;
    private QueryList: Query[];
    private protyle:IProtyle
    private item:HTMLElement
    private top:number|null
    block:DataViewBlock[]
    constructor(protyle:IProtyle,item:HTMLElement,top:number|null){
        this.protyle = protyle
        this.item = item
        this.top = top
        this.SQLstmt = ""
        this.QueryList = []
    }
}

