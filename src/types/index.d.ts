/**
 * Copyright (c) 2023 frostime. All rights reserved.
 */

/**
 * Frequently used data structures in SiYuan
 */
type DocumentId = string;
type BlockId = string;
type NotebookId = string;
type PreviousID = BlockId;
type ParentID = BlockId | DocumentId;

type Notebook = {
    id: NotebookId;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

type NotebookConf = {
    name: string;
    closed: boolean;
    refCreateSavePath: string;
    createDocNameTemplate: string;
    dailyNoteSavePath: string;
    dailyNoteTemplatePath: string;
}

type BlockType = "d" | "s" | "h" | "t" | "i" | "p" | "f" | "audio" | "video" | "other";

type BlockSubType = "d1" | "d2" | "s1" | "s2" | "s3" | "t1" | "t2" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "table" | "task" | "toggle" | "latex" | "quote" | "html" | "code" | "footnote" | "cite" | "collection" | "bookmark" | "attachment" | "comment" | "mindmap" | "spreadsheet" | "calendar" | "image" | "audio" | "video" | "other";

type Block = {
    id: BlockId;
    parent_id?: BlockId;
    root_id: DocumentId;
    hash: string;
    box: string;
    path: string;
    hpath: string;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent?: string;
    markdown: string;
    length: number;
    type: BlockType;
    subtype: BlockSubType;
    /** string of { [key: string]: string } 
     * For instance: "{: custom-type=\"query-code\" id=\"20230613234017-zkw3pr0\" updated=\"20230613234509\"}" 
     */
    ial?: string;
    sort: number;
    created: string;
    updated: string;
}

type doOperation = {
    action: string;
    data: string;
    id: BlockId;
    parentID: BlockId | DocumentId;
    previousID: BlockId;
    retData: null;
}

interface Window {
    siyuan: {
        notebooks: any;
        menus: any;
        dialogs: any;
        blockPanels: any;
        storage: any;
        user: any;
        ws: any;
        languages: any;
        config: any;
        emojis: any;
    };
}

interface IRiffCard {
    due?: string;
    reps?: number; // 闪卡复习次数
}

interface IObject {
    [key: string]: string;
}

interface IBlock {
    riffCard?: IRiffCard,
    depth?: number,
    box?: string;
    path?: string;
    hPath?: string;
    id?: string;
    rootID?: string;
    type?: string;
    content?: string;
    def?: IBlock;
    defID?: string
    defPath?: string
    refText?: string;
    name?: string;
    memo?: string;
    alias?: string;
    refs?: IBlock[];
    children?: IBlock[]
    length?: number
    ial: IObject
}

interface IBreadcrumb {
    id: string,
    name: string,
    type: string,
    subType: string,
    children: []
}

type Query = {
    type: 'parent_id' | 'root_id' | 'hash' | 'box' | 'path' | 'hpath' | 'name' | 'alias' | 'memo' | 'tag' | 'content' | 'fcontent' | 'markdown' | 'length' | 'type' | 'subtype' | 'ial' | 'sort' | 'created' | 'updated';
    operator: string;
    value: Object | string | number | Date;
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

interface DataViewBlock {
    blockItem: {
        block: IBlock;
        blockPaths: IBreadcrumb[];
    };
    sqlData: Block;
    dom: any;
    getValue(key: string): string | any;
    getValueFromSql(key: string): string;
    getValueFromIal(key: string): string;
    getValueFromDatabase(key: string): Promise<any>;
    getDatabase(): Promise<void>;
    searchKeyValues(searchKey: string): {
        key: {
            name: string;
        } | null;
    } | null;
}