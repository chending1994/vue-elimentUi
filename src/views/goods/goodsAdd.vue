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
       :active="2"
       finish-status="success">
       <el-step class="steps" title="基本信息"></el-step>
       <el-step title="商品参数"></el-step>
       <el-step title="商品属性"></el-step>
       <el-step title="商品图片"></el-step>
       <el-step title="商品内容"></el-step>
       </el-steps>
  </el-card>
</template>

<script>
export default {

};
</script>

<style>
.alert {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
