<template>
    <div id="app" class="dash-wrapper_outer">
      <section class="menu-left_wrapper">
      <nav class="menu-left">
        <h1>
          Mimics Crawler
          <i class="fa fa-times mobile abs-right" id="mobile-menu-close"></i>
        </h1>
        <ul>
          <li>
            <router-link to="/">
				<i class="fa fa-2x fa-pie-chart" aria-hidden="true"></i>
				<span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/actions">
				<i class="fa fa-2x fa-cogs" aria-hidden="true"></i>
				<span>Actions</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile">
				<i class="fa fa-2x fa-user-circle-o" aria-hidden="true"></i>
				<span>Profile</span>
            </router-link>
          </li>
          <li>
            <a>
            <div class="notifications notice-active">
              5
            </div>
            <i class="fa fa-2x fa-bell-o" aria-hidden="true"></i>
            <span>Notifications</span>
            </a>
          </li>
        </ul>
        <div class="nav-bg-img"></div>
      </nav>
      </section>
      <section class="main">
        <nav class="menu-top">
          <div style="display:flex;align-items:center;padding-left:3px;">
            <i class="fa fa-2x fa-bars mobile" id="mobile-menu-open" aria-hidden="true"></i>
            <h1>{{currentPanel}}</h1>
          </div>
          <ul>
            <li>
              <i class="fa fa-search" aria-hidden="true"></i>
            </li>
            <li>
              <i class="fa fa-sign-out" aria-hidden="true"></i>
            </li>
          </ul>
        </nav>
        <div class="dash-wrapper_inner">
      		<router-view v-bind:current="currentPanel" @update="updateCurrentPanel"></router-view>
		</div>
	</section>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      currentPanel: 'Dashboard'
    }
  },
  methods: {
    updateCurrentPanel(newPanel) {
      this.currentPanel = newPanel;
    }
  }
}
</script>
