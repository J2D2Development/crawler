<template>
    <div class="card">
        <div id="crawl-app">
                <div>{{crawlStatus}}</div>
                <div v-if="loadingSocket">Connecting to crawler...</div>
                <div v-if="!loadingSocket && !socketLoadedSuccess">
                    It looks like the SSR crawl server is not currently running.<br />
                    Double check that it is, and click to try again.
                    <input type="button" value="Reconnect"
                        v-on:click="reconnectToSocket"
                    />
                </div>
                <div v-if="!loadingSocket && socketLoadedSuccess">
                    <select v-model="crawlFilter">
                        <option value="" disabled>Choose Category to crawl</option>
                        <option value="">All</option>
                        <option v-for="filter in validFilters" v-bind:key="filter" v-bind:value="filter">
                            {{filter}}
                        </option>
                    </select>
                    <button v-on:click="startCrawl">Start</button>
                    <div>
                        <transition-group name="fade" tag="ul" class="crawl-results">
                            <li v-for="(result, index) in crawlResults" v-bind:key="index">
                                {{result.url}}: {{result.success}}
                            </li>
                        </transition-group>
                    </div>
                </div>
                <div v-if="crawlComplete">
                    <h2>Crawl Complete</h2>
                    <div>Elapsed Time: {{elapsedTime}}</div>
                    <div style="color:green;">{{crawlCompleteData.successes}} successful hits</div>
                    <div style="color:red;">{{crawlCompleteData.failures}} failed hits</div>
                </div>
            </div>
        </div>
</template>

<script>
    import io from 'socket.io-client';
    const socket = io('http://localhost:8000'); //move this to data?

    function startCrawl() {
        const app = this;
        this.crawlResults = [];
        socket.emit('crawl-start', { 
            start: true, 
            filter: app.crawlFilter 
        });
        this.crawlStatus = 'Running';
    }

    function reconnectToSocket() {
        this.loadingSocket = true;
        this.socketLoadedSuccess = false;
        socket.connect();
    }

    socket.on('connect_error', err => {
        console.log(this); //works
        console.log(this.loadingSocket); //undefined

        console.log('ssr not available', err);
        //this.socketLoadedSuccess = this.loadingSocket = false;
        socket.disconnect();
    });

    export default {
        name: 'actions',
        data () {
            return {
                crawlStatus: 'Checking...',
                loadingSocket: true,
                socketLoadedSuccess: false,
                running: false,
                crawlResults: [],
                crawlComplete: '',
                crawlCompleteData: {},
                crawlFilter: '',
                loaded: false,
                validFilters: ['Test', 'Base', 'Accounting', 'Banking', 'Central Banking', 'Investment', 'Trust', 'Module Options']
            }
        },
        methods: {
            startCrawl, 
            reconnectToSocket
        },
        mounted: function() {
            this.$emit('update', 'Actions');
        }
    };


    socket.on('crawl-ready', function(data) {
        console.log('ready!');
        actions.crawlStatus = 'Ready!';
    });

    socket.on('crawl-data', function(data) {
        actions.crawlResults.push(data);
    });

    socket.on('crawl-complete', function(data) {
        actions.crawlComplete = true;
        actions.crawlCompleteData = {
            successes: data.successes,
            failures: data.failures
        };
        actions.elapsedTime = formatElapsedTime(data.minutes, data.seconds);
        actions.running = false;
        socket.disconnect();
    });

    socket.on('crawl-error', function(data) {
        console.log('error passed:', data);
        actions.crawlStatus = `Error ${data.msg}`;
    });

    //if we don't disconnect after each crawl, data events duplicate
    socket.on('disconnect', function() {
        socket.open();
    });

    function formatElapsedTime(minutes, seconds) {
        const minutesTerm = +minutes === 1 ? 'minute' : 'minutes';
        const minutesDisplay = minutes === '00' ? '' : `${minutes} ${minutesTerm}`;
        const secondsTerm = +seconds === 1 ? 'second' : 'seconds';
        const secondsDisplay = `${seconds} ${secondsTerm}`;

        return `${minutesDisplay} ${secondsDisplay}`;
    }
</script>

<style lang="scss">
.indicator-active {
    width: 40px;
    height: 40px;
    margin-left: 12px;
    border-radius: 50%;
    border: 7px solid rgba(11, 200, 255, 0.25);
    border-top-color: rgba(11, 200, 255, 1);
    animation: 2s infinite rotater;
}
@keyframes rotater {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
