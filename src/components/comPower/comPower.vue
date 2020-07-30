<template>
  <div class="comPower">
    <!-- <div class="card_header" v-show="!rolePowerVisi">
      <el-row>
        <el-col :span="19" offset="1">
          <div class="title_left">{{powerList.powerType}}</div>
        </el-col>
        <el-col :span="4">
          <div class="title_right">
            <span class="iconfont icon-tianjia"></span>
            添加自定义角色
          </div>
        </el-col>
      </el-row>
    </div>-->
    <div class="card_content" v-show="!rolePowerVisi">
      <div
        class="list_item"
        v-for="(item) in powerList.roleList"
        :key="item.id"
        @click="handleLook(item)"
      >
        <p>{{item.roleName}}</p>
        <!-- <p v-show="item.defaultRole">企业默认角色</p> -->
      </div>
    </div>
    <!-- 角色详细权限 -->
    <div v-show="rolePowerVisi" class="powerDetail">
      <div class="card_header">
        <el-row>
          <el-col :span="19">
            <div class="title_left">
              <span class="title_back" @click="rolePowerVisi = false">{{powerList.powerType}}</span>
              <span>></span>
              <span>{{rolePowerDetail.roleName}}</span>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div class="power_detail">
        <div class="roleCheckGroup">
          <el-row
            class="list_item"
            v-for="(item,index) in rolePowerDetail.rolePower"
            :key="item.rolePowerTypeId"
          >
            <el-col :span="5" :offset="1">
              <el-checkbox
               :indeterminate="item.rolePowerNow.length !== item.rolePowerList.length && item.rolePowerNow.length !==0"
                :value="item.rolePowerNow.length == item.rolePowerList.length"
                class="check_item"
                @click.prevent.native="handleCheckAll(item)"
              >{{item.rolePowerType}}</el-checkbox>
            </el-col>
            <el-col :span="18">
              <el-checkboxGroup
                v-model="item.rolePowerNow"
                @on-change="checkAllGroupChange(item,index)"
              >
                <el-checkbox
                  class="check_item"
                  v-for="(data) in item.rolePowerList"
                  :label="data.fieldId"
                  :key="data.fieldId"
                >
                  <span>{{data.name}}</span>
                </el-checkbox>
              </el-checkboxGroup>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="roleCheckGroup" v-show="indexA == 0">当为自定义角色时，显示基本信息，待完善！</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ComPower',
  props: {
    powerList: Object,
    rolePowerVisi: {
      type: Boolean,
      default: false
    },
    rolePowerDetail: Object,
    roleMenu: Array
  },
  data() {
    return {
     
      // indexA: 1
    }
  },
  methods: {
    handleLook(item) {
      this.$emit('handle-look', item)
      // if (item.selfDefinedRole !== 'sys') {
      //   this.roleMenu[0].show = true
      // } else {
      //   this.roleMenu[0].show = false
      // }
      // this.rolePowerVisi = true
      // this.rolePowerDetail = item
    },
    handleCheckAll(item) {
      this.$emit('handle-check-all', item)
      // let allPower = []
      // item.rolePowerList.map((item, index) => {
      //   allPower.push(item.menuId)
      // })

      // if (item.rolePowerNow.length !== item.rolePowerList.length) {
      //   item.rolePowerNow = allPower
      // } else {
      //   item.rolePowerNow = []
      // }
    },
    checkAllGroupChange(item, index) {
      this.$emit('handle-all-group-change', 'checkAllGroupChange', item, index)
      // let length = item.rolePowerList.length
      // let data = this.rolePowerDetail.rolePower[index].rolePowerNow
    }
    //
  }
  // beforeDestroy() {
  //   this.rolePowerVisi = false
  // }
}
</script>

<style lang="less" scoped>
.comPower {
  .card_header {
    padding: 15px 0px;
    border-bottom: 1px solid #e5e5e5;
    .title_left {
      font-size: 16px;
      color: #333;
    }
    .title_right {
      el-color: #1b9aee;
    }
    .title_back {
      cursor: pointer;
      &:hover {
        el-color: #1b9aee;
      }
    }
  }
  .card_content {
    padding: 0px 20px;
    .list_item {
      cursor: pointer;
      padding: 12px 20px;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
      p {
        color: #333;
      }
      &:hover {
        background: #f7f7f7;
      }
    }
  }
  .powerDetail {
    .power_detail {
      ul {
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: flex-start;
        li {
          margin-left: 20px;
          cursor: pointer;
        }
        .active {
          el-color: #262626;
          box-shadow: inset 0 -4px #1b9aee;
        }
      }
    }
  }
  .roleCheckGroup {
    .list_item {
      margin-bottom: 1px;
      border-bottom: 1px solid #e5e5e5;
      .check_item {
        width: 150px;
        margin: 10px 50px 10px 0;
      }
    }
  }
}
</style>
