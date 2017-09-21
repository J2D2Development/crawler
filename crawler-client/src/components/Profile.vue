<template>
    <div>
        <div class="card">
            <h1>{{username}}</h1>
            <span>profile</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'profile',
        data () {
            return {
                username: 'Jackie'
            }
        },
        mounted: function() {
            this.$emit('update', 'Profile');
        }
    }
</script>