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
          v-model="searchKey"
          placeholder="请输入内容"
          class="searchInput"
          clearable>
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-button @click="addUserDialogVisible = true" type="success" plain>添加用户</el-button>
      </div></el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
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
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间">
        <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        with="50">
        <template slot-scope="scope">
            <!-- 获取当前绑定的索引，从0开始 -->
            <!-- {{ scope.$index }} -->
            <!-- 获取的是当前绑定的数据 对象 -->
            <!-- {{ scope.row }} -->
            <!-- {{ scope.row.mg_state }} -->
            <el-switch
                @change="handleChange(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain>
          </el-button>
          <el-button
            @click="handleDel(scope.row)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain>
          </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
     </el-table>
     <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2,4,6]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
     </el-pagination>
     <!-- 添加用户的对话框 -->
      <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible">
      <el-form
        label-width="100px"
        label-position="right"
        :model="userFormData">
        <el-form-item label="用户名">
          <el-input v-model="userFormData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userFormData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFormData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userFormData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 4,
      total: 0,
      searchKey: '',
      // 控制添加用户的对话框是否显示
      addUserDialogVisible: false,
      // 用户对应的表单数据
      userFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    };
  },
  created() {
    // 获取列表数据
    this.loadData();
  },
  methods: {
    async handleDel(user) {
      if (this.$confirm('确认删除此用户?')) {
        return;
      }
      const res = await this.$http.delete(`users/${user.id}`);
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('删除成功');
      } else {
        this.$message.error('删除失败');
      }
    },
    // 开个状态改变
    async handleChange(user) {
      // loadData的时候，已经给this.$http设置了请求头，携带了token
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('用户状态修改成功');
      } else {
        this.$message.error('用户状态修改失败');
      }
    },
    // 搜索功能
    handleSearch() {
      this.pagenum = 1;
      this.loadData();
    },
    // 分页使用的方法
    handleSizeChange(val) {
      // 当界面上选择每页条数数据后执行
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      // 当页码发送变化的时候执行
      // 修改当前页面，重新获取数据列表
      this.pagenum = val;
      this.loadData();
    },
    async loadData() {
      // 获取登录后的token
      const token = sessionStorage.getItem('token');
      // axios发送请求的时候需要携带token
      this.$http.defaults.headers.common['Authorization'] = token;
      // 发送请求
      //   const res = await this.$http.get('users?pagenum=1&pagesize=10');
      const res = await this.$http.get(
        `users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchKey
        }`
      );
      // 获取服务器返回的数据
      const data = res.data;
      if (data.meta.status === 200) {
        this.total = data.data.total;
        this.tableData = data.data.users;
      } else {
        this.$message.error('获取数据失败');
      }
    }
  }
};
</script>

<style >
.box-card {
  width: 100%;
  height: 100%;
}

.searchContainer {
  margin-top: 15px;
  margin-bottom: 15px;
}
.searchInput {
  width: 300px;
}
</style>
