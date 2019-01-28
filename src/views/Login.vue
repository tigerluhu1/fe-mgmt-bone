<style lang="less" scoped>
  .loginWrapper {
    position: relative;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: flex-end;
    background-image: url(../assets/login--background.jpg);
    background-size: 100% auto;
    background-repeat: no-repeat;

    .loginContainer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;
      padding: 0 10px;
      box-shadow: 1px 1px 10px 0px #ccc;
      background-color: rgba(38, 43, 45, 0.5);
    }
  }
</style>

<template>
  <div class="loginWrapper" @keydown.enter="handleLogin">
    <div class="loginContainer">
      <h2 style="color: #FFF; font-size: 18px; font-family: '宋体'">管理平台</h2>
      <el-form :model="formModel" style="width: 100%;" :rules="formRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input :placeholder="$t('placeholder.username')" size="medium" v-model="formModel.username">
            <i class="iconfont icon-username" style="line-height: 36px;" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :placeholder="$t('placeholder.password')" type="password" size="medium" v-model="formModel.password">
            <i class="iconfont icon-password" style="line-height: 36px;" slot="prefix"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item> -->
        <el-button :loading="buttonLoading" style="width: 100%;" size="medium" type="primary" @click="handleLogin">登录</el-button>
        <!-- </el-form-item> -->
      </el-form>
      <p style="color: #FFF; font-family: '宋体'; font-size: 12px; position: absolute; bottom: 0;">© 2017 版权所有</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      buttonLoading: false,
      formModel: {},
      formRules: {
        username: { required: true, message: this.$t('validate.notBlank'), trigger: 'blur' },
        password: { required: true, message: this.$t('validate.notBlank'), trigger: 'blur' }
      }
    }
  },

  methods: {
    handleLogin () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          let params = this.formModel
          this.$axios
            .get('/api/login', { params })
            .then(resp => {
              let respData = resp.data
              // 获取 token 并保存至 vuex 中
              let token = respData.token
              this.$store.commit('updateAccessToken', token)
              this.$router.replace({ name: 'home' })
            })
            .finally(() => {
              this.buttonLoading = false
            })
        }
      })
    }
  }
}
</script>
