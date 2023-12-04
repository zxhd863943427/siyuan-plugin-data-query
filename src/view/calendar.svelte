<script lang="ts">
    import Calendar from '@event-calendar/core';
    import TimeGrid from '@event-calendar/time-grid';
    import DayGrid from '@event-calendar/day-grid'
    import List  from "@event-calendar/list";

    export let calendarData:{
        start:string|Date;
        end:string|Date|null;
        content:any;
        nodeId:string;
        display:string
    }[];
    let showFirstDate = new Date()
    showFirstDate.setDate(1)
    let plugins = [DayGrid,TimeGrid,List];
    let lastClickTime = new Date().getTime();
    let options = {
        view: 'listMonth',
        headerToolbar: {
            start: 'prev,next,today',
            center: 'title',
            end: 'listYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        buttonText: function (texts) {
            texts.listYear = 'year';
            texts.dayGridMonth = 'mon'
            texts.today = 'now'
            return texts;
        },
        resources: [
            {id: 1, title: 'Resource A'},
            {id: 2, title: 'Resource B'}
        ],
        scrollTime: '09:00:00',
        events: calendarData,
        views: {
            timeGridWeek: {pointer: true},
            resourceTimeGridWeek: {pointer: true}
        },
        dayMaxEvents: true,
        nowIndicator: true,
        selectable: true,
        slotDuration:"1:00:00",
        eventClick:(info)=>{
            // console.log(info)
            let currentTime = new Date().getTime();
            let timeDiff = currentTime - lastClickTime;
            
            if (timeDiff < 300 && info.event.resourceIds[0]){
                window.open(`siyuan://blocks/${info.event.resourceIds[0]}`)
            }
            lastClickTime = currentTime
        },
        date :showFirstDate,
    };
</script>
<div>
    <Calendar {plugins} {options} />
</div>


<style lang="scss">
    div :global(h2){
        font-size: 1.1em;
    }
    div :global(.ec-day-grid .ec-body .ec-day){
        min-height: 5em;
        max-height: 7em;
    }
    div :global(.protyle-attr){
        display: none;
    }
    div :global(.ec-day-grid.ec-month-view .ec-event-title){
        max-height: 1em;
    }
    div :global(.ec-day-grid.ec-month-view .ec-event-title [data-node-id]){
        font-size: 1em;
    }
    div :global(.ec-day-grid.ec-month-view .protyle-action){
        display: none;
    }
    div :global(.ec-day-grid [data-node-id]){
        padding: 0px;
        margin: 0px;
    }
    div :global(.ec-toolbar){
        flex-wrap: wrap;
    }
</style>