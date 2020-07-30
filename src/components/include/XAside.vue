<template>
  <div id="XAside" class="XAside-wrap">
    <div class="menu-wrap">
      <el-scrollbar style="height: 100%;">
        <el-menu ref="myMenu" :default-active="defaultActive" style="height: 100%;" :unique-opened="true">
          <el-submenu :index="item.id" v-for="(item, index) in menus" :key="item.id">
            <template slot="title">
              <i class="menu-icon iconfont" v-html="item.icon"></i>
              <span>{{item.label}}</span>
            </template>
            <el-menu-item :index="sub.id" v-for="(sub, index2) in item.children" :key="sub.id" @click="clickMenu(sub)">
              <i style="margin-right:20px;"></i>
              <span slot="title">{{sub.label}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import menus from '@/assets/js/menus'
  export default {
    name: 'XAside',
    data() {
      return {
        defaultActive: '',
        menus: []
      }
    },
    created() {
      // 配置菜单项
      let len = this.$route.path.split('/')
      if(len.length > 2) {
        this.menus = menus[len[1]]
      }
    },
    mounted() {
     this.initDefaultActive();
    },
    methods: {
      initDefaultActive() {
        this.menus.forEach(item => {
          item.children.forEach(item2 => {
            if(this.$route.path.indexOf(item2.path) > -1) {
              if(this.$route.path !== item2.path) {
                this.defaultActive = item2.path
                return
              }
              this.defaultActive = item2.id
              this.clickMenu(item2)
            }
          })
        })
      },
      clickMenu(sub) {
        if(this.tabbar.length > 8) {
          this.$store.commit('delTabbar', 0)
        }
        setTimeout(() => {
          this.$go(sub.path)
          this.$store.commit('addTabbar', sub)
        }, 1)
      }
    },
    computed: {
      tabbar() {
        return this.$store.state.tabbar
      }
    },
    components: {},
    watch: {
      $route(n) {
        if(n.path !== '/') {
          this.initDefaultActive();
        } else {
          this.defaultActive = ''
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .XAside-wrap{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .menu-wrap{
      width: 100%;
      height: 100%;
      border-right: solid 1px #e6e6e6;
      .menu-icon{
        margin-right: 20px;
        font-size: 20px;
      }
    }
  }
</style>
<style lang="less">
  .XAside-wrap{
    .el-menu{
      border-right: none;
    }
    .el-submenu{
      .el-submenu__title{
        font-size: 15px;
      }
    }
    .el-submenu.is-opened{
      .menu-icon,.el-submenu__title{
        color: #4C9B75;
      }
    }
    .el-menu-item.is-active{
      color: #4C9B75;
    }
  }

</style>
