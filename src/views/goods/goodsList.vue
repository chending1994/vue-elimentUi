<template>
  <el-card>
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <!-- 搜索框 -->
      <el-row class="searchContainer">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                <el-input
                  v-model="searchKey"
                  placeholder="请输入内容"
                  class="searchInput"
                  clearable>
                  <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click="addUserDialogVisible = true" type="success" plain>添加用户</el-button>
            </div>
          </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        stripe
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="商品名称"
          width="400">
        </el-table-column>
        <el-table-column
          prop="email"
          label="商品价格(元)"
          width="130">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="商品重量"
          width="100">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
              {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain>
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain>
              </el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: []
    };
  }
};
</script>

<style scoped>
.searchContainer {
    margin-top: 15px;
    margin-bottom: 15px;
}
.searchInput {
    width: 300px;
}
</style>
