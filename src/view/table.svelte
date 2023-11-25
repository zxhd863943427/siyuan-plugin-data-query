<div class="b3-dialog__content">
    <div>appId:</div>
    <div class="fn__hr"></div>
    <div class="plugin-sample__time">${app?.appId}</div>
    <div class="fn__hr"></div>
    <div class="fn__hr"></div>
    <div>API demo:</div>
    <div class="fn__hr" />
    <div class="plugin-sample__time">
        System current time: <span id="time">{time}</span>
    </div>
    <div class="fn__hr" />
    <div class="fn__hr" />
    <div>Protyle demo: id = {blockID}</div>
    <div class="fn__hr" />
    <div id="protyle" style="height: 360px;" bind:this={divProtyle}/>
</div>