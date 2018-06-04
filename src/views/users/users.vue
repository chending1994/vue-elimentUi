<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="searchContainer">
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-input
          placeholder="请输入内容"
          class="searchInput"
          clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-button type="success" plain>添加用户</el-button>
      </div></el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
};
</script>

<style >
  .box-card {
    width: 100%;
    height: 100%;
  }
  .searchContainer {
    margin-top: 15px;
  }
  .searchInput {
    width: 300px;
  }
</style>