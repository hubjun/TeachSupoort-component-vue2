<!-- 菜单页 -->
<template>
  <div id="Menu">
    <ul>
      <li v-for="(item,index) in Menus" :key="index" @click="clickRouter(item.path)">
        <div class="name">{{item.name}}</div>
        <div class="img">
          <img :src="item.src" alt />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    Menus: {
      type: Array,
      default: () => []
    }
  },
  created() {},
  mounted() {},
  methods: {
    clickRouter(path) {
      console.log(path)
      // this.$router.push({ path })
      this.$go(path)
    }
  },
  computed: {},
  components: {},
  watch: {}
}
</script>

<style scoped lang="less">
#Menu {
  height: calc(100% - 60px);
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0px 110px 0 60px;
    li {
      width: calc(25% - 30px);
      height: calc(33.33% - 30px);
      margin-left: 30px;
      margin-top: 30px;
      background-color: #fff;
      box-shadow: 0px 0px 21px 0px rgba(211, 219, 232, 0.5);
      border-radius: 4px;
      padding: 30px 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .name {
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .img {
        text-align: center;
        height: 70%;
        margin: 0 auto;
        img {
          height: 100%;
        }
      }
      &:hover {
        z-index: 2;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
        .name{
          color:#4c9b75
        }
      }
    }
  }
}
</style>
