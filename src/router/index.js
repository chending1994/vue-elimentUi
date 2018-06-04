import Vue from 'vue';
import Router from 'vue-router';
// 导入登录组件
import Login from '@/views/login';
// 导入home组件
import Home from '@/views/home';

import Users from '@/views/users/users';
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
        }
      ]
    }
  ]
});
