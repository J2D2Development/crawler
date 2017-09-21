<template>
    <div style="display:flex;flex-wrap:wrap;">
        <div class="card">
            <h1>System Status</h1>
            <span>Current Info</span>
            <ul>
                <li>Last Crawl: {{msg}}</li>
                <li>Next Scheduled: xx</li>
            </ul>
        </div>
        <div class="card">
            <h1>Running Processes</h1>
            <span>Current Actions</span>
            <ul>
                <li>None</li>
            </ul> 
        </div>
        <div class="card">
            <h1>Details</h1>
            <span>Real Time Tracking</span>
            <div>
                Charts - static stats on last crawl and overall if no running, live updates (rxjs?) if currently running
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data () {
            return {
                msg: 'TODAY'
            }
        },
        mounted: function() {
            this.$emit('update', 'Dashboard');
        }
    }
</script>