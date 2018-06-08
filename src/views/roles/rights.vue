<template>
  <el-card class="box-card">
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-table
      class="table"
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-else-if="scope.row.level === '1'">二级</span>
            <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data } = await this.$http.get('rights/list');
      // this.tableData = data.data;
      if (data.meta.status === 200) {
        this.tableData = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
  .table {
    margin-top: 15px;
  }
</style>
