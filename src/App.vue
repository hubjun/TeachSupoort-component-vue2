<template>
  <div id="app">
    <!--  页面  -->
    <router-view/>
    <!--  后续放置 背景底图 or 动画效果  -->
  </div>
</template>
<script>
  export default {
    components: {

    },
    data() {
      return {}
    },
    created() {
      // 初始化tab菜单栏缓存数据
      if(sessionStorage.getItem('tabbar')) {
        this.$store.commit('setTabbar', JSON.parse(sessionStorage.getItem('tabbar')))
      }
    },
    watch: {
      $route(n) {
        // 当回到首页时，清空缓存的tab菜单选项。
        if(n.path === '/') {
          sessionStorage.removeItem('tabbar')
          this.$store.commit('setTabbar', [])
        }
      }
    }
  }
</script>
<style lang="less">
  @import 'assets/css/variable.less';
  @import 'assets/css/common.less';
  @import 'assets/css/style.less';
  body, html{
    width: 100%;
    height: 100%;
  }
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    min-width: 1200px;
    font-size: 15px;
    background-color: @bg-color;
  }
</style>
