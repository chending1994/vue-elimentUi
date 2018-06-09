<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row">
      <el-col :span="24">
        <el-button type="success" @click="handleShowAddDialog" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      stripe
      height="400"
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
            @click="handleDel(scope.row.cat_id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain>
        </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[8, 10, 20, 30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
      <el-form label-width="100" :model="form" label-position="right">
        <el-form-item label="分类名称">
          <el-input style="width: 300px" v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            placeholder="默认添加一级分类"
            change-on-select
            clearable
            expand-trigger="hover"
            :options="options"
            :props="defaultProps"
            v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入tree-column组件
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 8,
      total: 0,
      loading: true,
      // 控制新增对话框的显示或者隐藏
      addDialogFormVisible: false,
      form: {
        cat_pid: -1,
        cate_name: '',
        cat_level: 0
      },
      // 绑定层级下拉框
      selectedOptions: [],
      // 层级下拉框中的数据
      options: [],
      // 层级下拉框的配置
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 删除分类
    async handleDel(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const { data: resData } = await this.$http.delete(`categories/${id}`);
        // console.log(resData);
        if (resData.meta.status === 200) {
          this.$message.success(resData.meta.msg);
          this.loadData();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加分类
    async handleAdd() {
      if (this.selectedOptions.length === 0) {
        this.form.cate_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
      }
      this.form.cat_level = this.selectedOptions.length;

      // 发送请求，添加数据
      const { data: resData } = await this.$http.post('categories', this.form);
      if (resData.meta.status === 201) {
        this.$message.success('添加成功');
        this.loadData();
        this.addDialogFormVisible = false;
      } else {
        this.$message.error(resData.meta.msg);
      }
    },
    // 点击添加按钮，显示添加对话框
    async handleShowAddDialog() {
      this.addDialogFormVisible = true;
      // 加载层级的数据
      const { data: resData } = await this.$http.get('categories?type=2');
      this.options = resData.data;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    async loadData() {
      const { data: resData } = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.loading = false;
      this.tableData = resData.data.result;
      this.total = resData.data.total;
    }
  },
  components: {
    'el-tree-grid': ElTreeGrid
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
  margin-bottom: 15px;
}

.pagination {
  margin-top: 15px;
}
</style>
