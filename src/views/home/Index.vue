<template>
  <div class="Home-wrap main-wrap">
    <!--  顶部导航  -->
    <XHeader></XHeader>
    <div class="layout-wrap" v-if="$route.path !=='/'">
      <div class="layout-aside">
        <XAside></XAside>
      </div>
      <div class="layout-main">
        <div class="layout-tab">
          <XTabbar></XTabbar>
        </div>
        <div class="layout-inner">
          <router-view />
          <div class="layout-footer">Copyright © 中国人民解放军陆军勤务学院 版权所有</div>
        </div>
      </div>
    </div>
    <div class="layout-wrap layout-container" v-else>
      <Menu :Menus="menuList"></Menu>
      <div class="layout-footer">Copyright © 中国人民解放军陆军勤务学院 版权所有</div>
    </div>
    <!-- 修改密码 -->
    <modify-psw></modify-psw>
  </div>
</template>

<script>
import XHeader from '@/components/include/XHeader.vue'
import XAside from '@/components/include/XAside.vue'
import XTabbar from '@/components/include/XTabbar.vue'
import Menu from '@/components/Menu/Index.vue'
import ModifyPsw from '@/components/pop/ModifyPsw.vue'
export default {
  name: 'Home',
  components: {
    XHeader,
    XAside,
    XTabbar,
    Menu,
    ModifyPsw
  },
  data() {
    return {
      currentIndex: 0,
      menuList: [
        {
          path: '/standardexpenses/standard/standard',
          src: require('@/assets/images/baseFunds.png'),
          name: '标准经费管理'
        },
        {
          path: '/projectconstruct/construct/construct',
          src: require('../../assets/images/construction.png'),
          name: '项目建设管理'
        },
        {
          path: '/teachasset/base-dict/asset-type',
          src: require('../../assets/images/assets.png'),
          name: '教学资产管理'
        },
        {
          path: '/teachingmaterial/teaching-material-inventory/inventory-inquire',
          src: require('../../assets/images/manage.png'),
          name: '教材管理'
        },
        {
          path: '',
          src: require('../../assets/images/equip.png'),
          name: '训练装备管理'
        },
        {
          path: '',
          src: require('../../assets/images/office.png'),
          name: '信息化办公设备管理'
        },
         {
          path: '',
          src: require('../../assets/images/material.png'),
          name: '教学物资管理'
        },
        {
          path: '',
          src: require('../../assets/images/site.png'),
          name: '训练场地管理'
        },
        {
          path: '',
          src: require('../../assets/images/software.png'),
          name: '软件资产管理'
        },
         {
          path: '',
          src: require('../../assets/images/laboratory.png'),
          name: '实验室管理'
        },
        {
          path: '',
          src: require('../../assets/images/visual.png'),
          name: '数据可视化与信息系统集成'
        },
         {
          path: '/system/user',
          src: require('../../assets/images/system.png'),
          name: '系统管理'
        }
      ],
      popVisible: true,
      popWidth: '390px'
    }
  },
  created() {
    console.log(this.$route)
  },
  mounted() {
    // console.log(1)
  },
  methods: {
    showMsg() {
      this.$message('hello')
    }
  },
  computed: {},

  watch: {}
}
</script>

<style scoped lang="less">
@import '../../assets/css/variable.less';
.Home-wrap {
  width: 100%;
  position: relative;
  .login-logo {
    width: 750px;
    height: 80px;
    font-size: 30px;
    border: 1px solid red;
    margin: 100px auto 20px;
  }
  .layout-wrap {
    position: absolute;
    top: @top-height;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    display: flex;
    min-width: 0;
    .layout-aside {
      width: @aside-width;
      min-width: @aside-width;
      background-color: #fff;
    }
    .layout-main {
      flex: 1;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .layout-tab {
        height: 32px;
        background-color: #e5e5e5;
      }
      .layout-inner {
        overflow-y: auto;
        height: calc(100% - 32px);
        padding: 30px 30px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .layout-container {
    flex-direction: column;
    justify-content: space-between;
  }
  .layout-footer {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 12px;
    color: #abafb3;
    text-align: center;
  }
}
</style>
