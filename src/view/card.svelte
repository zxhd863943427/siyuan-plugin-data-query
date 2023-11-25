<div class='card-deck'>
{#each data as item}
    <CardItem header={item[0]} body={item[1]}></CardItem>
{/each}
</div>

<script lang="ts">
export let data
import CardItem from "./card/card-item.svelte";

</script>
<style lang="scss">
.card-deck {
    display: flex;
    flex-wrap: wrap;
}
</style>