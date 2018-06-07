import Vue from 'vue';
import Router from 'vue-router';
// 导入登录组件
import Login from '@/views/login';
// 导入home组件
import Home from '@/views/home';

import Users from '@/views/users/users';

import Rights from '@/views/roles/rights';

import Roles from '@/views/roles/roles';

Vue.use(Router);

export default new Router({
  routes: [
    {name: 'home', path: '/', component: Home},
    {name: 'login', path: '/login', component: Login},
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        }
      ]
    }
  ]
});
