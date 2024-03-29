import {
    IProtyle,
    fetchSyncPost,
    Lute
} from "siyuan";
import "@/types/index.d"
import { DataViewBlock } from "./DataViewBlock";
export class DataQuery {
    private SQLstmt: string;
    private queryList: Query[];
    private limitNumber:number
    blockList: DataViewBlock[]

    constructor() {

        this.SQLstmt = ""
        this.queryList = []
        this.blockList = []
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
            embedBlockID: "",
            includeIDs: idList,
            headingMode:  0,
            breadcrumb: true
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

    
    outlinks(blockArg:string|string[]|DataViewBlock|DataViewBlock[]|undefined){
        let idList = []
        if (blockArg === undefined && this.blockList.length != 0){
            idList = this.blockList.map(x=>{return x.getValue("id")})
        }
        else if (typeof(blockArg) == "string"){
            idList.push(blockArg)
        }
        else if (blockArg instanceof DataViewBlock){
            idList.push(blockArg.getValue("id"))
        }
        else if(Array.isArray(blockArg) && blockArg.length != 0){
            let firstItem = blockArg[0]
            if(typeof(firstItem) == "string"){
                idList = [...blockArg]
            }
            else if(firstItem instanceof DataViewBlock){
                idList = (blockArg as DataViewBlock[]).map((x:DataViewBlock)=>{return x.getValue("id")})
            }
        }

        if (idList.length === 0 ){
            return
        }
        this.queryList.push({
            type: "outlinks",
            value: idList,
            operator: "nop"
        })

        return this
    }

    backlinks(blockArg:string|string[]|DataViewBlock|DataViewBlock[]|undefined){
        let idList = []
        if (blockArg === undefined && this.blockList.length != 0){
            idList = this.blockList.map(x=>{return x.getValue("id")})
        }
        else if (typeof(blockArg) == "string"){
            idList.push(blockArg)
        }
        else if (blockArg instanceof DataViewBlock){
            idList.push(blockArg.getValue("id"))
        }
        else if(Array.isArray(blockArg) && blockArg.length != 0){
            let firstItem = blockArg[0]
            if(typeof(firstItem) == "string"){
                idList = [...blockArg]
            }
            else if(firstItem instanceof DataViewBlock){
                idList = (blockArg as DataViewBlock[]).map((x:DataViewBlock)=>{return x.getValue("id")})
            }
        }

        if (idList.length === 0 ){
            return
        }
        this.queryList.push({
            type: "backlinks",
            value: idList,
            operator: "nop"
        })
        return this
    }

    addQueryList(item:Query){
        this.queryList.push(item)
    }

    id(id, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "id",
                    value: `'%${id}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "id",
                    value: `'${id}'`,
                    operator: operator
                })
        }

        return this
    }

    parent_id(parent_id, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "parent_id",
                    value: `'%${parent_id}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "parent_id",
                    value: `'${parent_id}'`,
                    operator: operator
                })
        }

        return this
    }

    root_id(root_id, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "root_id",
                    value: `'%${root_id}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "root_id",
                    value: `'${root_id}'`,
                    operator: operator
                })
        }

        return this
    }

    hash(hash, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "hash",
                    value: `'%${hash}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "hash",
                    value: `'${hash}'`,
                    operator: operator
                })
        }

        return this
    }

    box(box, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "box",
                    value: `'%${box}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "box",
                    value: `'${box}'`,
                    operator: operator
                })
        }

        return this
    }

    path(path, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "path",
                    value: `'%${path}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "path",
                    value: `'${path}'`,
                    operator: operator
                })
        }

        return this
    }

    hpath(hpath, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "hpath",
                    value: `'%${hpath}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "hpath",
                    value: `'${hpath}'`,
                    operator: operator
                })
        }

        return this
    }

    name(name, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "name",
                    value: `'%${name}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "name",
                    value: `'${name}'`,
                    operator: operator
                })
        }

        return this
    }

    alias(alias, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "alias",
                    value: `'%${alias}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "alias",
                    value: `'${alias}'`,
                    operator: operator
                })
        }

        return this
    }

    memo(memo, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "memo",
                    value: `'%${memo}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "memo",
                    value: `'${memo}'`,
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
                    value: `'%#${tag}%#%'`,
                    operator: "like"
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
                    value: `'${tag}'`,
                    operator: operator
                })
        }

        return this
    }

    content(content, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "content",
                    value: `'%${content}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "content",
                    value: `'${content}'`,
                    operator: operator
                })
        }

        return this
    }

    fcontent(fcontent, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "fcontent",
                    value: `'%${fcontent}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "fcontent",
                    value: `'${fcontent}'`,
                    operator: operator
                })
        }

        return this
    }

    markdown(markdown, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "markdown",
                    value: `'%${markdown}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "markdown",
                    value: `'${markdown}'`,
                    operator: operator
                })
        }

        return this
    }

    length(length, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "length",
                    value: `'%${length}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "length",
                    value: `'${length}'`,
                    operator: operator
                })
        }

        return this
    }

    type(type, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "type",
                    value: `'%${type}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "type",
                    value: `'${type}'`,
                    operator: operator
                })
        }

        return this
    }

    subtype(subtype, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "subtype",
                    value: `'%${subtype}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "subtype",
                    value: `'${subtype}'`,
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
            case "like":
                this.queryList.push({
                    type: "sort",
                    value: `'%${sort}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "sort",
                    value: `'${sort}'`,
                    operator: operator
                })
        }

        return this
    }

    created(created, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "created",
                    value: `'%${created}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "created",
                    value: `'${created}'`,
                    operator: operator
                })
        }

        return this
    }

    updated(updated, operator: string = "like") {
        switch (operator) {
            case "like":
                this.queryList.push({
                    type: "updated",
                    value: `'%${updated}%'`,
                    operator: operator
                })
                break;
            default:
                this.queryList.push({
                    type: "updated",
                    value: `'${updated}'`,
                    operator: operator
                })
        }

        return this
    }
    limit(limit:number){
        this.limitNumber = limit
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
        stmt += ` limit ${this.limitNumber} `
        return stmt
    }

    private genQuery(queryItem: Query) {
        switch (queryItem.type) {
            case "ial":
                return `  id in (select block_id from attributes where name ${queryItem.operator} ${(queryItem.value as any).ialKey} and value ${queryItem.operator} ${(queryItem.value as any).ialValue}) `

            case "outlinks":
                return `id in (SELECT def_block_id FROM refs WHERE root_id in ('${(queryItem.value as string[]).join("', '")}'))`

            case "backlinks":
                return `id in (SELECT block_id FROM refs WHERE def_block_root_id in ('${(queryItem.value as string[]).join("', '")}'))`

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
    uniBlocks(blocks: DataViewBlock[], mode: 'max' | 'min') {
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