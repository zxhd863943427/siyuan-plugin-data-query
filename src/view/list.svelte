<div>
{@html html}
</div>

<script lang="ts">
export let dataList:any[]
import { lute } from "@/libs/utils";
let trimList = dataList.map(x=>"* "+x.toString())
let mdStr = trimList.join("\n")
let html = lute.Md2BlockDOM(mdStr)
</script>