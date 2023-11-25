<div class="card">
    <div class="card-header">
      {@html lute.Md2BlockDOM(`${header}`)}
    </div>
    <div class="card-body">
    {#each body as item}
        <div>{@html lute.Md2BlockDOM(`${item}`)}</div>
	{/each}
    </div>
</div>
<script lang="ts">
export let header
export let body:any[]
import {lute} from "@/libs/utils"

</script>

<style lang="scss">
.card {
    margin-left: 1%;
    margin-right: 1%;
    margin-top: 10px;
    padding: 3%;
    max-height: 400px;
    overflow: hidden;
    overflow-y: scroll;
    border-radius: 10px;
    flex-direction: column;
    flex: 1 0 250px;
    display: flex;
    background-color: #c4c4c486;
}
</style>