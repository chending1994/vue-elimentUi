<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <el-table
      height="500"
      :data="tableData"
      style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20">
      </el-tree-grid>
      <el-table-column
        prop="cat_level"
        label="级别"
        width="180">
        <template slot-scope="scope">
            <span v-if="scope.row.cat_level === 0">一级</span>
            <span v-else-if="scope.row.cat_level === 1">二级</span>
            <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>    
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
            <span>{{ scope.row.cat_deleted ? '无效' : '有效' }}</span>
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
// 导入tree-column组件
import ElTreeGrid from "element-tree-grid";
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
      const { data: resData } = await this.$http.get(
        "categories?type=3&pagenum=1&pagesize=10"
      );
      this.tableData = resData.data.result;
    }
  },
  components: {
    "el-tree-grid": ElTreeGrid
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
