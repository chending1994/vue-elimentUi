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
      },
      // 控制加载提示显示隐藏
      loading: true,
      rules: {
        username: [{
          require: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 8,
          message: '长度在 3 到 8 个字符',
          trigger: 'blur'
        }
        ],
        password: [{
          require: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 5,
          max: 11,
          message: '长度在 5 到 11 个字符',
          trigger: 'blur'
        }
        ]
      },
      // 控制编辑窗口显示隐藏
      editUserDialogVisible: false,
      setRoleDialogVisible: false,
      selectedUser: {
        username: '',
        rid: -1
      },
      options: []
    };
  },
  created() {
    // 获取列表数据
    this.loadData();
  },
  methods: {
    // 分配权限
    async handleSetRole() {
      const {
        data
      } = await this.$http.put(`users/${this.selectedUser.id}/role`, {
        rid: this.selectedUser.rid
      });
      console.log(data);
      if (data.meta.status === 200) {
        this.setRoleDialogVisible = false;
        this.$message.success('权限分配成功');
      } else {
        this.$message.error('权限分配失败');
      }
    },
    // 打开分配权限的对话框
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogVisible = true;
      // 记录用户id,分配权限的时候使用
      this.selectedUser.id = user.id;
      this.selectedUser.username = user.username;
      // 发送请求，获取所有的角色
      const {
        data
      } = await this.$http.get('roles');
      this.options = data.data;
      // console.log(this.options);
      // 根据用户的id去请求用户对象，目的是取得角色id
      const res = await this.$http.get(`users/${user.id}`);
      const data1 = res.data;
      this.selectedUser.rid = data1.data.rid;
    },
    // 修改用户
    async handleUpdate() {
      // console.log(this.userFormData);
      const {
        data
      } = await this.$http.put(`users/${this.userFormData.id}`, {
        email: this.userFormData.email,
        mobile: this.userFormData.mobile
      });
      if (data.meta.status === 200) {
        this.$message.success('修改成功');
        this.loadData();
        this.editUserDialogVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 点击编辑按钮，打开修改用户的对话框，并且把当前用户信息显示
    handleOpenEditDialog(user) {
      this.editUserDialogVisible = true;
      this.userFormData.id = user.id;
      this.userFormData.username = user.username;
      this.userFormData.mobile = user.mobile;
      this.userFormData.email = user.email;
      console.log(this.userFormData);
    },
    async handleAdd() {
      const {
        data
      } = await this.$http.post('users', this.userFormData);
      if (data.meta.status === 201) {
        // 添加成功
        this.$message.success('添加成功');
        this.loadData();
        // 关闭对话框
        this.addUserDialogVisible = false;
        // 清空文本框中的值
        for (let key in this.userFormData) {
          this.userFormData[key] = '';
        }
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 根据id删除用户
    async handleDel(id) {
      this.$confirm('是否确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除操作
        const {
          data
        } = await this.$http.delete(`users/${id}`);
        if (data.meta.status === 200) {
          // 删除成功
          this.$message.success('删除成功');
          this.pagenum = 1;
          // 重新加载数据
          this.loadData();
        } else {
          // 删除失败
          this.$message.error(data.meta.msg);
        }
      });
    },
    // 开关状态改变
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
      this.loading = true;
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
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
