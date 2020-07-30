<template>
  <footer class="XFooter-wrap">
  </footer>
</template>

<script>
  export default {
    name: 'XFooter',
    components: {

    },
    data () {
      return {
        currentIndex: 0
      }
    },
    created () {

    },
    mounted () {
      console.log(1);
    },
    methods: {},
    computed: {},

    watch: {}
  }
</script>

<style scoped lang="less">
  @import '../../assets/css/variable.less';
  .XFooter-wrap{
    width: 100%;
    padding: 15px 0;
    text-align:center;
    color: #ddd;
    background-color: #555;
  }
</style>
