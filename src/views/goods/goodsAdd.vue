<template>
  <el-card class="bax-card">
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <el-alert
       class="alert"
       title="添加商品信息"
       type="info"
       center
       :closable="false"
       show-icon>
      </el-alert>

      <el-steps
        align-center
        :active="active - 0"
        finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <el-tabs v-model="active" class="tabs" tab-position="left">
          <el-tab-pane name="0" label="基本信息">基本信息</el-tab-pane>
          <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
          <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
          <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
          <el-tab-pane name="4" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
        active: '0'
    };
  }
};
</script>

<style>
.alert {
  margin-top: 15px;
  margin-bottom: 15px;
}
.tabs {
    margin-top: 15px;
}
</style>
