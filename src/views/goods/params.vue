<template>
  <el-card class="box-card">
    <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>

    <el-alert
      class="alert"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>

    <el-row>
      <el-col :span="24">
        请选择商品分类：
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :show-all-levels="false"
          @change="handleChange"
          :props="{ label: 'cat_name', value: 'cat_id' }"
          v-model="selectedOptions">
        </el-cascader>
      </el-col>
    </el-row>

    <!-- v-model 绑定的是 激活的tab-pane的name属性的值 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="动态参数" name="many">
        <el-button :disabled="isDisabled" type="primary">添加动态参数</el-button>
        <el-table
          :data="dynamicParams"
          style="width: 100%">
          <el-table-column
            type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item,index) in scope.row.params"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, index)">
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button :disabled="isDisabled" type="primary">添加静态参数</el-button>
        <el-table
          :data="staticParams"
          style="width: 100%">
          <el-table-column
            type="index"
            width="40">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicParams: [],
      staticParams: [],
      isDisabled: true,
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 点击标签 关闭按钮 删除当前标签
    async handleClose(row, index) {
      // 界面上的处理
      row.params.splice(index, 1);
      // 准备请求的数据
      // 准备url上需要的id
      const catId = row.cat_id;
      const attrId = row.attr_id;
      // 在准备put过去的对象
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      // 让数据一致
      row.attr_vals = putData.attr_vals;
      // 发送请求
      const url = `categories/${catId}/attributes/${attrId}`;
      const { data: { meta: { status } } } = await this.$http.put(url, putData);
      if (status === 200) {
        this.$message.success('更新成功');
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加标签
    async handleInputConfirm(row) {
      if (this.inputValue.length === 0) {
        return;
      }
      row.params.push(this.inputValue);
      // 清空文本框，显示按钮，隐藏文本框
      this.inputValue = '';
      this.inputVisible = false;

      // 准备put的数据
      const catId = row.cat_id;
      const attrId = row.attr_id;

      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };

      row.attr_vals = putData.attr_vals;
      // 发送请求
      const url = `categories/${catId}/attributes/${attrId}`;
      const { data: { meta: { status } } } = await this.$http.put(url, putData);
      if (status === 200) {
        this.$message.success('更新成功');
      }
    },
    // 层级下拉框 发生改变
    handleChange() {
      // 判断 当前是否选择的3 级分类
      // 如果选择的3级分类  此时按钮可用
      if (this.selectedOptions.length === 3) {
        // 可用
        this.isDisabled = false;
        this.loadTableData();
      } else {
        // 不可用
        this.isDisabled = true;
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data: { data, meta: { status } } } = await this.$http.get('categories?type=3');
      if (status === 200) {
        this.options = data;
      }
    },
    // 加载表格数据
    async loadTableData() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        return;
      }
      // this.activeName ---> many   only
      const { data: { data, meta: { status } } } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`);
      if (status === 200) {
        if (this.activeName === 'many') {
          this.dynamicParams = data;
          // 动态参数的 attr_vals 转换成数组
          // 在动态参数对象上增加一个属性，记录数组  params
          this.dynamicParams.forEach((item) => {
            const arr = item.attr_vals.trim().split(',').length === 0 ? [] : item.attr_vals.trim().split(',');
            // 动态给对象，增加的成员，数据绑定会有问题
            this.$set(item, 'params', arr);
          });
        } else {
          this.staticParams = data;
        }
      }
    },
    // 点击tab栏执行
    handleTabClick() {
      this.loadTableData();
    }
  }
};
</script>

<style scoped>
  .alert {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
