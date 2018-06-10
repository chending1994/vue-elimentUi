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

      <el-form
        style="height: 500px; overflow: auto"
        label-position="top"
        :model="form"
        label-width="100px">
        <el-tabs
          @tab-click="handleTabClick"
          v-model="active"
          class="tabs"
          tab-position="left">
            <el-tab-pane name="0" label="基本信息">
              <el-form-item label="商品名称">
                <el-input v-model="form.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input v-model="form.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input v-model="form.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input v-model="form.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader
                  clearable
                  :options="options"
                  :props="defaultProps"
                  v-model="selectedOptions"
                  expand-trigger="hover"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="1" label="商品参数">
              <el-form-item
                v-for="item in dynamicsParams"
                :key="item.attr_id"
                :label="item.attr_name">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                   v-for="val in item.attr_vals"
                   :key="val"
                   border
                   :label="val"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="2" label="商品属性">
              <el-form-item
                v-for="item in staticParams"
                :key="item.attr_id"
                :label="item.attr_name">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品图片">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :headers="tokenHeader"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品内容">
              <el-button @click="handleAdd">添加商品</el-button>
              <quillEditor class="editor" v-model="form.goods_introduce"></quillEditor>
            </el-tab-pane>
        </el-tabs>
      </el-form>
  </el-card>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '0',
      form: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定到层级下拉框上的数据
      selectedOptions: [],
      checkList: [],
      // 动态参数
      dynamicsParams: [],
      // 静态参数
      staticParams: [],
      // 上传文件的手，设置请求头
      tokenHeader: {
        'Authorization': sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 添加商品
    async handleAdd() {
      this.form.goods_cat = this.selectedOptions.join(',');
      const arr1 = this.dynamicsParams.map((item) => {
        item.attr_vals = item.attr_vals.join(',');
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.staticParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      // 获取所有选中的分类参数
      this.form.attrs = [...arr1, ...arr2];

      // 发送请求
      const { data: { meta: { status, msg } } } = await this.$http.post('goods', this.form);
      if (status === 201) {
        this.$message.success('添加成功');
      } else {
        this.$message.error(msg);
      }
    },
    // 图片上传事件
    // 移除一个图片
    handleRemove(file) {
      // file.response服务器返回的响应
      // file.response.data.tmp_path
      // 根据file中的tmp_path的路径，找到数组中对应的要删除的对象的索引
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
    },
    // 图片上传成功
    handleSuccess(response) {
      const { meta, data } = response;
      if (meta.status === 200) {
        this.$message.success('图片上传成功');
        // 当上传成功
        this.form.pics.push({
          pic: data.tmp_path
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 点击tab栏执行
    async handleTabClick() {
      if (this.active === '1' || this.active === '2') {
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请选择三级分类');
          return;
        }
      }
      // 根据当前tab栏是商品参数 sel=many 如果是商品属性sel=only
      const sel = this.active === '1' ? 'many' : 'only';
      // 如果选择了三级分类，发送请求获取数据
      // 请求的接口地址中的id，是三级分类的id
      const { data: resData } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
      if (this.active === '1') {
        // 获取动态数据库，需要对数据进行处理，要把分割的数据转化成数组
        this.dynamicsParams = resData.data;
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');
        });
      } else {
        // 静态参数赋值
        this.staticParams = resData.data;
      }
    },
    handleChange() {
      // 判断当前是否选中的是三级分类
      // 如果不是三级分类，提示，并清空
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('商品只能添加到三级分类');
        this.selectedOptions.length = 0;
      }
    },
    async loadOptions() {
      const { data: resData } = await this.$http.get('categories?type=3');
      //  console.log(resData);
      this.options = resData.data;
    }
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
