<div>
    <table class="query-table">
        <thead>
            <tr>
                {#each tableData[0] as header}
                <th>{@html lute.InlineMd2BlockDOM(`${header}`)}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each tableData[1] as row}
            <tr>
            {#each row as rowItem}
                <td>{@html lute.InlineMd2BlockDOM(`${rowItem}`)}</td>
            {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>
<script lang="ts">
export let tableData
import { lute } from "@/libs/utils";
</script>

<style lang="scss">
.query-table{
    max-width: 100%;
}
</style>