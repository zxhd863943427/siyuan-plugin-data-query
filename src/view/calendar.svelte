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

    let plugins = [DayGrid,TimeGrid,List];
    let lastClickTime = new Date().getTime();
    let options = {
        view: 'listWeek',
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: function (texts) {
            texts.resourceTimeGridWeek = 'resources';
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
        eventClick:(info)=>{
            // console.log(info)
            let currentTime = new Date().getTime();
            let timeDiff = currentTime - lastClickTime;
            
            if (timeDiff < 300 && info.event.resourceIds[0]){
                window.open(`siyuan://blocks/${info.event.resourceIds[0]}`)
            }
            lastClickTime = currentTime
        }
    };
</script>

<Calendar {plugins} {options} />