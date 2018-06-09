import Vue from 'vue';
import Router from 'vue-router';
// 导入登录组件
import Login from '@/views/login';
// 导入home组件
import Home from '@/views/home';

import Users from '@/views/users/users';

import Rights from '@/views/roles/rights';

import Roles from '@/views/roles/roles';

// 商品分类组件
import Categories from '@/views/goods/categories';
// 商品列表组件
import Goods from '@/views/goods/goodsList';

// 导入element-ui中的Message方法
import { Message } from 'element-ui';
Vue.use(Router);

const router = new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
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
        },
        {
          name: 'categories',
          path: 'categories',
          component: Categories
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods
        }
      ]
    }
  ]
});

// 全局的路由前缀守卫
// 在路由跳转之前做的干预
router.beforeEach((to, from, next) => {
  // 判断是否登录
  // 登录页面不需要判断token
  if (to.name === 'login') {
    next();
  } else {
    // 判断有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 提示
      Message.warning('请先登录');
      router.push({
        name: 'login'
      });
    }
  }
});
export default router;
