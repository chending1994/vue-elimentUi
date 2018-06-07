<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">
          <img src="/static/logo1.svg" alt="">
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
        <el-menu
          :unique-opened="true"
          :router="true"
          class="menu">
          <el-submenu
            v-for="item1 in menus"
            :key="item1.id"
            :index="item1.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
              v-for="item2 in item1.children"
              :key="item2.id"
              :index="'/' + item2.path">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
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
      // 跳转回登录页面并且要提示
      this.$router.push({
        name: 'login'
      });
      // 提示
      this.$message.warning('请先登录');
    }
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      menus: []
    };
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
    },
    async loadData() {
      const { data: resData } = await this.$http.get('menus');
      this.menus = resData.data;
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
