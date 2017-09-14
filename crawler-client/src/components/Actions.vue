<template>
    <div class="card">
        <div id="crawl-app">
                <div>{{crawlStatus}}</div>
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
                <div v-if="crawlComplete">
                    <h2>Crawl Complete</h2>
                    {{crawlComplete.successes}} crawled.<br />
                    {{crawlComplete.failures}} failed.<br />
                    <small>
                        Crawl took 
                        {{crawlComplete.minutes}}
                        {{
                            crawlComplete.minutes === '01' ? 'minute' : 'minutes' 
                        }} 
                        and 
                        {{crawlComplete.seconds}}
                        {{
                            crawlComplete.seconds === '01' ? 'second' : 'seconds'
                        }}
                    </small>
                </div>
            </div>
        </div>
</template>

<script>
    const socket = io('http://localhost:8000');
    export default {
        name: 'actions',
        data () {
            return {
                crawlStatus: 'Ready',
                crawlResults: [],
                crawlComplete: '',
                crawlFilter: '',
                loaded: false,
                validFilters: ['Test', 'Base', 'Accounting', 'Banking', 'Central Banking', 'Investment', 'Trust', 'Module Options']
            }
        },
        methods: {
            startCrawl
        },
        mounted: function() {
            this.$emit('update', 'Actions');
        }
    }

    function startCrawl() {
        app.crawlResults = [];
        socket.emit('crawl-start', { 
            start: true, 
            filter: app.crawlFilter 
        });
        app.crawlStatus = 'Running...';
    }

    socket.on('crawl-ready', function(data) {
        app.crawlStatus = 'Ready!';
    });

    socket.on('crawl-data', function(data) {
        app.crawlResults.push(data);
    });

    socket.on('crawl-complete', function(data) {
        app.crawlComplete = data;
        socket.disconnect();
    });

    socket.on('crawl-error', function(data) {
        console.log('error passed:', data);
        app.crawlStatus = `Error ${data.msg}`;
    });

    //if we don't disconnect after each crawl, data events duplicate
    socket.on('disconnect', function() {
        socket.open();
    });
</script>