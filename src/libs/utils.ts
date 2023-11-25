export let lute
export const setLute = (options) => {
    lute = globalThis.Lute.New();
    lute.SetSpellcheck(window.siyuan.config.editor.spellcheck);
    lute.SetProtyleMarkNetImg(window.siyuan.config.editor.displayNetImgMark);
    lute.SetFileAnnotationRef(true);
    lute.SetTextMark(true);
    lute.SetHeadingID(false);
    lute.SetYamlFrontMatter(false);
    // lute.PutEmojis(options.emojis);
    // lute.SetEmojiSite(options.emojiSite);
    // lute.SetHeadingAnchor(options.headingAnchor);
    lute.SetInlineMathAllowDigitAfterOpenMarker(true);
    lute.SetToC(false);
    lute.SetIndentCodeBlock(false);
    lute.SetParagraphBeginningSpace(true);
    lute.SetSetext(false);
    lute.SetFootnotes(false);
    lute.SetLinkRef(false);
    // lute.SetSanitize(options.sanitize);
    // lute.SetChineseParagraphBeginningSpace(options.paragraphBeginningSpace);
    // lute.SetRenderListStyle(options.listStyle);
    lute.SetImgPathAllowSpace(true);
    lute.SetKramdownIAL(true);
    lute.SetTag(true);
    lute.SetSuperBlock(true);
    lute.SetGitConflict(true);
    lute.SetMark(true);
    lute.SetSup(true);
    lute.SetSub(true);
    lute.SetProtyleWYSIWYG(true);
    // if (options.lazyLoadImage) {
    //     lute.SetImageLazyLoading(options.lazyLoadImage);
    // }
    lute.SetBlockRef(true);
    lute.SetHTMLTag2TextMark(true)
    if (window.siyuan.emojis[0].items.length > 0) {
        const emojis = {};
        window.siyuan.emojis[0].items.forEach(item => {
            emojis[item.keywords] = options.emojiSite + "/" + item.unicode;
        });
        lute.PutEmojis(emojis);
    }
    return lute;
};


interface Data {
    key: {
        name: string;
        type: string;
    };
    values: {
        id: number;
        keyID: string;
        blockID: string;
        text?: { content: string };
        block?: { content: string };
        phone?: { content: string };
        date?: { content: string; content2?: string; hasEndDate?: boolean };
        number?: { content: number };
        mSelect?: { content: string }[];
        mAsset?: { content: string }[];
        checkbox?: { checked: boolean };
        url?: { content: string };
        email?: { content: string };
        created?: { content: string };
        updated?: { content: string };
    }[];
}

class DatabaseValue {
    name: string;
    type: string;
    id: number;
    keyID: string;
    blockID: string;
    values: Data['values'];

    constructor(data: Data) {
        this.name = data.key.name;
        this.type = data.key.type;
        this.id = data.values[0].id;
        this.keyID = data.values[0].keyID;
        this.blockID = data.values[0].blockID;
        this.values = data.values;
    }

    get value(): any {
        return this.value;
    }

    toString(): string {
        return this.value.toString();
    }
}



class TextDatabaseValue extends DatabaseValue {
    constructor(textValue) {
        super(textValue);
    }
    get value() {
        return this.values[0].text.content;
    }
}

class BlockDatabaseValue extends DatabaseValue {
    constructor(blockValue) {
        super(blockValue);
    }
    get value() {
        return this.values[0].block.content;
    }
}

class PhoneDatabaseValue extends DatabaseValue {
    constructor(phoneValue) {
        super(phoneValue);
    }
    get value() {
        return this.values[0].phone.content;
    }
}

class DateDatabaseValue extends DatabaseValue {
    constructor(dateValue: Data) {
        super(dateValue);
    }

    get value(): Date | { startDate: Date; endDate: Date } {
        const dateData = this.values[0].date;
        if (dateData.hasEndDate) {
            return {
                startDate: new Date(dateData.content),
                endDate: new Date(dateData.content2 as string)
            };
        } else {
            return new Date(dateData.content);
        }
    }

    toString(): string {
        const dateData = this.values[0].date;
        if (dateData.hasEndDate) {
            return `${(new Date(dateData.content)).toLocaleString()} → ${(new Date(dateData.content2 as string)).toLocaleString()}`;
        } else {
            return (new Date(dateData.content)).toLocaleString();
        }
    }
}

class NumberDatabaseValue extends DatabaseValue {
    constructor(numberValue) {
        super(numberValue);
    }
    get value() {
        return this.values[0].number.content;
    }
}

class SelectDatabaseValue extends DatabaseValue {
    constructor(selectValue) {
        super(selectValue);
    }
    get value() {
        return this.values[0].mSelect[0].content;
    }
}

class MSelectDatabaseValue extends DatabaseValue {
    constructor(mSelectValue) {
        super(mSelectValue);
    }
    get value() {
        return this.values[0].mSelect.map(item => item.content);
    }
}

class MAssetDatabaseValue extends DatabaseValue {
    constructor(mAssetValue) {
        super(mAssetValue);
    }
    get value() {
        return this.values[0].mAsset.map(item => item.content);
    }
}

class CheckboxDatabaseValue extends DatabaseValue {
    constructor(checkboxValue) {
        super(checkboxValue);
    }
    get value() {
        return this.values[0].checkbox.checked;
    }
    toString(): string {
        if (this.values[0].checkbox.checked){
            return '☑'
        }
        return '☐'
    }
}

class UrlDatabaseValue extends DatabaseValue {
    constructor(urlValue) {
        super(urlValue);
    }
    get value() {
        return this.values[0].url.content;
    }
}

class EmailDatabaseValue extends DatabaseValue {
    constructor(emailValue) {
        super(emailValue);
    }
    get value() {
        return this.values[0].email.content;
    }
}

class CreatedDatabaseValue extends DatabaseValue {
    constructor(createdValue) {
        super(createdValue);
    }
    get value() {
        return new Date(this.values[0].created.content);
    }
    toString(): string {
        return (new Date(this.values[0].created.content)).toLocaleString();
    }
}

class UpdatedDatabaseValue extends DatabaseValue {
    constructor(updatedValue) {
        super(updatedValue);
    }
    get value() {
        return new Date(this.values[0].updated.content);
    }
    toString(): string {
        return (new Date(this.values[0].updated.content)).toLocaleString();
    }
}

export function parseDatabaseValue(data: Data): DatabaseValue {
    switch (data.key.type) {
        case "text":
            return new TextDatabaseValue(data);
        case "block":
            return new BlockDatabaseValue(data);
        case "phone":
            return new PhoneDatabaseValue(data);
        case "date":
            return new DateDatabaseValue(data);
        case "number":
            return new NumberDatabaseValue(data);
        case "select":
            return new SelectDatabaseValue(data);
        case "mSelect":
            return new MSelectDatabaseValue(data);
        case "mAsset":
            return new MAssetDatabaseValue(data);
        case "checkbox":
            return new CheckboxDatabaseValue(data);
        case "url":
            return new UrlDatabaseValue(data);
        case "email":
            return new EmailDatabaseValue(data);
        case "created":
            return new CreatedDatabaseValue(data);
        case "updated":
            return new UpdatedDatabaseValue(data);
        default:
            return new DatabaseValue(data);
    }
}

export function isValidDate(str: string) {
    // 日期格式正则表达式
    const regex = /^(20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/;

    return regex.test(str);
}

export function parseDateString(dateString: string): Date | null {
    // 正则表达式验证格式是否正确
    const regex = /^(20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/;
    if (!regex.test(dateString)) {
        return null; // 如果不匹配，返回 null
    }

    // 提取日期和时间部分
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 月份从0开始计数
    const day = parseInt(dateString.substring(6, 8), 10);
    const hours = parseInt(dateString.substring(8, 10), 10);
    const minutes = parseInt(dateString.substring(10, 12), 10);
    const seconds = parseInt(dateString.substring(12, 14), 10);

    // 创建 Date 对象
    const date = new Date(year, month, day, hours, minutes, seconds);

    // 验证日期是否有效（例如，没有2月30日）
    if (date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day ||
        date.getHours() !== hours ||
        date.getMinutes() !== minutes ||
        date.getSeconds() !== seconds) {
        return null; // 无效日期返回 null
    }

    return date;
}


export function isNumeric(str: string) {
    const regex = /^\d+$/;
    return regex.test(str);
}

export function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}