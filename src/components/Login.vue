<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icondengluyonghu" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconmima" />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      }, // 表单的验证规则对象
      loginFormRef: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ], // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单(利用resetFields函数)
    resetLoginForm() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    // 表单的预校验(利用validate函数)
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return // 校验失败，则返回
        await this.$http.post('user/login', this.loginForm)
          .then(res => {
            console.log(res)
            if (res.data.code !== 20000) return this.$message.error('登录失败!')
            this.$message.success('登录成功!')
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          })
          .catch(err => {
          // console.log(err)
            this.$message.error(err + '')
          })
        // const { data: res } = await this.$http.post(
        //   'user/login',
        //   this.loginForm
        // ) //校验成功则发起登录请求
        // console.log(res)
        // if (res.code !== 20000) return this.$message.error('登录失败!')
        // this.$message.success('登录成功!')
        // console.log(res);
        // 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        // window.sessionStorage.setItem('token', res.data.token)
        // 导航跳转到后台主页，路由地址是 /home
        // this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.btns {
  display: flex; //弹性布局
  justify-content: flex-end; //尾部对齐
}
</style>
