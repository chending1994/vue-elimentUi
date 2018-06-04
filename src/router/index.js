import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/login';

import Home from '@/views/home';

Vue.use(Router);

export default new Router({
  routes: [
    {name: 'home', path: '/', component: Home},
    {name: 'login', path: '/login', component: Login}
  ]
});
