<template>
  <el-card>
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <!-- 搜索框 -->
      <el-row class="searchContainer">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                <el-input
                  placeholder="请输入内容"
                  class="searchInput"
                  clearable>
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click="$router.push({name: 'goodsadd'})" type="success" plain>添加商品</el-button>
            </div>
          </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        height="500"
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
          prop="goods_name"
          label="商品名称"
          width="400">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="130">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
              {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
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
      <!-- 显示分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[50, 100, 150, 200]"
        :page-size="50"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
      <el-form label-width="100" label-position="right">
        <el-form-item label="分类名称">
          <el-input style="width: 300px" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pagenum: 1,
      total: 0,
      pagesize: 50,
      addDialogFormVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 获取列表数据
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // console.log(resData);
      this.tableData = resData.data.goods;
      this.total = resData.data.total;
      this.loading = false;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    handleAdd() {
      this.addDialogFormVisible = true;
    }
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
