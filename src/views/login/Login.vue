<template>
  <div id="login">
    <div class="login_box">
      <div class="login_img">
        <img src="../../assets/images/login.png">
      </div>
      <div class="login_features">
        <img src="../../assets/images/logo.png">
        <div class="name">教学保障资源信息服务平台</div>
        <el-form :rules="LoginRules" ref="formLogin"  :model="formLogin">
          <el-form-item prop="userName">
            <el-input @keyup.enter.native="Login" prefix-icon="el-icon-user" v-model="formLogin.userName"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input @keyup.enter.native="Login" type="password" prefix-icon="el-icon-lock" v-model="formLogin.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formLogin.remember">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
        <el-button @click="Login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from '@/axios/index'
  import { BASE_URL } from '@/axios/Global'
// import { demoServer } from "../../api/installServer";

export default {
  components: {
    axios
  },
  data() {
    return {
      formLogin: {
        userName: '',
        password: '',
        remember: false
      },
      LoginRules: {
        userName: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    
  },
  mounted: function () {
    if (localStorage.getItem('IsRemember') === '1') {
      this.formLogin.userName = localStorage.getItem('UserName');
      this.formLogin.password = localStorage.getItem('Password');
      this.formLogin.remember = true;
    }
  },
  methods: {
    Login: function () {
      this.$refs['formLogin'].validate((valid) => {
        if (valid) {
          axios.post(`${BASE_URL}/oauth/token?username=${this.formLogin.userName}&password=${this.formLogin.password}&grant_type=password&client_secret=secret&client_id=alu_web`)
            .then((value) => {
              if(value.status) {
                sessionStorage.setItem('TOKEN', value.access_token)
                sessionStorage.setItem('user', value.user.username)
                sessionStorage.setItem('userId', value.user.id)
                if (!this.formLogin.remember) {
                } else {
                  localStorage.setItem('IsRemember', '1');
                  localStorage.setItem('UserName', this.formLogin.userName);
                  localStorage.setItem('Password', this.formLogin.password);
                }
                this.$message.success('登陆成功');
                this.$router.push({ path: '/' });
              }else {
                this.$message.error('登陆失败');
              }
            })
            .catch(function (reason) {

            });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#login{
  min-width: 1200px;
  height: 100vh;
  padding-top: 158px;
  background: url(../../assets/images/loginBackground.png) no-repeat center;
  .login_img{

  }
  .login_box{
    width: 1230px;
    height: 747px;
    background-color: #FFF;
    box-shadow:0px 0px 21px 0px rgba(211,219,232,0.5);
    border-radius: 10px;
    overflow: hidden;
    margin: auto;
    text-align: center;
    .login_img{
      float: left;
      width: 658px;
      height: 100%;
      background-color: #aeeaed;
    }
    .login_features{
      float: left;
      width: 572px;
      height: 100%;
      padding: 108px 106px 0 106px;
      img{
        width: 150px;
        height: 150px;
        margin-bottom: 15px;
      }
      .name{
        width:360px;
        font-size:30px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:45px;
        margin-bottom: 60px;
      }
      .el-input__prefix{
        font-size: 22px;
      }
      .el-input__icon{
        color: #999999;
      }
      .el-input__inner{
        border:none;
        border-bottom: 1px #C1C1C1 solid;
        border-radius: 0;
        font-size: 18px;
        padding-left: 45px;
      }
      .el-form-item:nth-child(3){
        text-align: left;
      }
      .el-checkbox{
        color: #999999;
        font-weight:400;
        font-size: 16px;
      }
      .el-button--default{
        width: 100%;
        height: 50px;
        background-color: #60C293;
        color: #FEFEFE;
        font-size: 18px;
        border-radius: 4px;
      }
    }
  }
}
</style>
<style scoped>

</style>
