<template>
  <div id="XTabbar" class="XTabbar-wrap">
    <div class="tabbar-list">
      <div class="tabbar-item" :class="{active: currentPath.indexOf(item.path) > -1}" v-for="(item, index) in menus" :key="index" @click="clickMenu(item)">
        {{item.label}}
        <div class="close" @click.stop="closeMenu(item, index)">×</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'XTabbar',
    data() {
      return {
        currentPath: ''
      }
    },
    created() {
      this.currentPath = this.$route.path
    },
    mounted() {},
    methods: {
      clickMenu(item) {
        this.currentPath = item.path;
        this.$go(item.path);
      },
      closeMenu(item, index) {
        let nextPath = '';
        this.$store.commit('delTabbar', index)
        if(this.menus.length > 0) {
          if(this.$route.path.indexOf(item.path) < 0) {
            return
          }
          let idx  = index > 0 ? index - 1 : 0
          nextPath = this.menus[idx].path
        } else {
          nextPath = '/';
        }
        this.$go(nextPath);
      }
    },
    computed: {
      menus() {
        return this.$store.state.tabbar
      }
    },
    components: {},
    watch: {
      $route(n) {
        this.currentPath = n.path
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../assets/css/variable.less';
  .XTabbar-wrap{
    .tabbar-list{
      display: flex;
      border-bottom:1px solid rgba(229,229,229,1);
      .tabbar-item{
        padding: 0 10px 0 30px;
        line-height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        color: #838084;
        border-right: 1px solid #e5e5e5;
        cursor: pointer;
        user-select: none;
        &.active{
          background-color: #fff;
        }
        .close{
          margin-left: 10px;
          font-size: 20px;
          font-weight: lighter;
          &:hover{
            color: @m-color-hover;
          }
        }
      }
    }
  }
</style>
