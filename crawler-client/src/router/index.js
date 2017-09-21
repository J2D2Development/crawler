import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Actions from '@/components/Actions';
import Profile from '@/components/Profile';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/actions',
      name: 'actions',
      component: Actions
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
});
