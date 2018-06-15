import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
// 路由懒加载
// 导入登录组件
const Login = () => import('@/views/login');
// 导入home组件
const Home = () => import('@/views/home');

const Users = () => import('@/views/users/users');

const Rights = () => import('@/views/roles/rights');

const Roles = () => import('@/views/roles/roles');

// 商品分类组件
const Categories = () => import('@/views/goods/categories');
// 商品列表组件
const Goods = () => import('@/views/goods/goodsList');

// 商品添加组件
const GoodsAdd = () => import('@/views/goods/goodsAdd');

// 导入element-ui中的Message方法

// 商品参数组件
const Params = () => import('@/views/goods/params');

// 订单列表
const Orders = () => import('@/views/orders/orders');

// 数据统计
const Reports = () => import('@/views/reports/reports');

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
        },
        {
          name: 'goodsadd',
          path: 'goods/add',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: 'params',
          component: Params
        },
        {
          name: 'orders',
          path: 'orders',
          component: Orders
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
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
