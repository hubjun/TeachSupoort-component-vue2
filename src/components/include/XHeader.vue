<template>
  <header class="XHeader-wrap">
    <div class="logo">教学保障资源信息服务平台</div>

    <div class="right">
      <el-breadcrumb separator=">" class="menus">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

        <el-breadcrumb-item
          v-if="$route.meta.breadcrumb"
          v-for="(item, index) in $route.meta.breadcrumb"
          :key="index"
        >{{item}}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="settings">
        <div class="icon"></div>
        <div class="drop-menu">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{user}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="com-header-dropmenu">
              <el-dropdown-item @click.native="modify">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetter } from 'vuex'
export default {
  name: 'XHeader',
  components: {},
  data() {
    return {
      currentIndex: 0,
      user: ''
    }
  },
  created() {
    this.user = sessionStorage.getItem('user')
  },
  mounted() {
    console.log(1)
  },
  methods: {
    modify() {
      this.$store.commit('setModifyPopVisible', true)
    },
    loginOut() {
      this.$router.push('/login')
      // todo 清除缓存
    }
  },
  computed: {},

  watch: {}
}
</script>

<style scoped lang="less">
@import '../../assets/css/variable.less';
.XHeader-wrap {
  z-index: 99;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: @top-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  min-width: 1200px;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    width: @aside-width;
    height: 100%;
    background-color: @m-color-hover;
    font-size: 20px;
    font-weight: bold;
    .pic {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: yellow;
      margin-right: 5px;
    }
  }
  .right {
    flex: 1;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .menus {
      font-size: 16px;
    }
    .settings {
      font-size: 14px;
      display: flex;
      align-items: center;
      .icon {
        width: 40px;
        height: 40px;
        background: @m-color-hover url('../../assets/images/user.png') no-repeat
          center center;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>
<style lang="less">
@import '../../assets/css/variable.less';
.XHeader-wrap {
  .el-breadcrumb {
    .el-breadcrumb__item:last-child {
      .el-breadcrumb__inner {
        color: @m-color;
      }
    }
    .el-breadcrumb__inner.is-link:hover {
      color: @m-color;
    }
  }
  .drop-menu {
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
.com-header-dropmenu {
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: rgba(240, 249, 244, 1);
    color: @m-color-hover;
  }
}
</style>
