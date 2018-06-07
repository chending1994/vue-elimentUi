<template>
  <div class="login">
    <el-form class="login-form" label-position="top" ref="form" :model="form" label-width="80px">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input @keyup.enter.native="handleLogin" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click.prevent="handleLogin">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post('login', this.form);
      // 相对于在回调函数中书写代码
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('登录成功');
        sessionStorage.setItem('token', data.data.token);
        // 跳转
        this.$router.push({
          name: 'home'
        });
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
/* scoped 只自作用于当前页面 */
.login {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login .login-btn {
  width: 100%;
}
</style>
