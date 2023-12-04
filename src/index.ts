import {
    Plugin,
    showMessage
} from "siyuan";
import "@/index.scss";
import "@/types/index.d"
import { DataViewBlock } from "@/libs/DataViewBlock";

import { SettingUtils } from "./libs/setting-utils";
import { setLute } from "@/libs/utils";
import { DataView } from "./libs/DataView";



export default class PluginSample extends Plugin {

    private isMobile: boolean;
    private settingUtils: SettingUtils;

    async onload() {

        console.log(this.i18n.helloPlugin);
        globalThis.DataViewBlock = DataViewBlock
        globalThis.DV = DataView
    }

    onLayoutReady() {
        setLute({})
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

}




