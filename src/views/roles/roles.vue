<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="row">
      <el-col :span="24">
        <el-button>添加角色</el-button>
      </el-col>
    </el-row>

    <el-table
      height="500"
      :data="tableData"
      v-loading="loading"
      stripe
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 展示之后，显示一级权限 -->
          <el-row
            class="level1"
            v-for="item in scope.row.children"
            :key="item.id">
            <el-col :span="4">
              <!-- 显示一级权限名称 -->
              <el-tag
                @close="handleClose(scope.row,item)"
                type="success"
                closable>
                {{ item.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 显示二、三级权限 -->
              <el-row
                v-for="item1 in item.children"
                :key="item1.id">
                <!-- 显示二级权限 -->
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row,item1)"
                    type="info"
                    closable>
                    {{ item1.authName }}
                  </el-tag>
                </el-col>
                <!-- 显示三级权限 -->
                <el-col :span="20">
                    <el-tag
                      @close="handleClose(scope.row,item2)"
                      class="level3"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      type="warning">
                        {{ item2.authName }}
                    </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              当前角色没有分配权限
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
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
          <el-button
            @click="handleShowSetRightsDialog(scope.row)"
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible">
      <el-tree
        default-expand-all
        show-checkbox
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkedKeys">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRightsDialogVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      setRightsDialogVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkedKeys: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data: resData } = await this.$http.get('roles');
      const { data, meta } = resData;

      this.loading = false;
      if (meta.status === 200) {
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除对应的权限
    async handleClose(role, rights) {
      const { data: resData } = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      const { data: meta } = resData;
      if (meta.status === 200) {
        this.$message.succes('删除成功');
      } else {
        this.$message.error(meta.msg);
      }
    },
    async handleShowSetRightsDialog(role) {
      this.setRightsDialogVisible = true;
      // 获取tree的数据
      const { data: resData } = await this.$http.get('rights/tree');
      const { data } = resData;
      this.treeData = data;
      var arr = [];
      role.children.forEach((item1) => {
        // item1 一级权限对象
        arr.push(item1.id);

        // 遍历二级权限
        item1.children.forEach((item2) => {
          arr.push(item2.id);
          // item2 二级权限

          // 遍历三级权限
          item2.children.forEach((item3) => {
            // item3 三级权限
            arr.push(item3.id);
          });
        });
      });
      this.checkedKeys = arr;
    }
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.level1 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
