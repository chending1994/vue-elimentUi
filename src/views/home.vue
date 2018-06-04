<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">
          <img src="/static/logo.png" alt="">
        </div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple">
          <div class="title">电商后台管理</div>
        </div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
          <a class="logout" @click.prevent="handleLogout" href="#">退出</a>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <!--
          unique-opened只能展开一个菜单项
          router 可以跳转到index指定的路由路径
          default-active="1-1" 默认指定某一个menu-item展开，要和item的index的值一样
        -->
        <el-menu
          :unique-opened="true"
          :router="true"
          class="menu">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 判断是否登录
  beforeCreate() {
    // 判断sessionStorage中是否有token ，如果没有token认为没有登录
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转会登录页面并且要提示
      this.$router.push({
        name: 'login'
      });
      // 提示
      this.$message.warning('请先登录');
    }
  },
  methods: {
    // 退出
    handleLogout() {
      // 删除token
      sessionStorage.removeItem('token');
      // 登录页面
      this.$router.push({
        name: 'login'
      });
      this.$message.success('退出成功');
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  padding: 0;
}
.header .title {
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  color: #fff;
}
.header .logout {
  position: absolute;
  right: 10px;
  color: orange;
  line-height: 60px;
  text-decoration: none;
}
.aside {
  background-color: #d3dce6;
}
.aside .menu {
  height: 100%;
}
.main {
  height: 100%;
  background-color: #e9eef3;
}
</style>
