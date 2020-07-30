<template>
  <el-scrollbar style="height: 90%">
    <div class="menuList">
      <el-row style="margin-top: 20px">
        <div class="menuList-table">
          <!-- 总全选-->
          <el-checkbox :indeterminate="indeterminate" v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
          <!--这里使用element-ui 的折叠板-->
          <el-collapse>
            <el-collapse-item v-for="(one,oneIndex) in menuData" :key="oneIndex">
              <template slot="title">
                <!-- 一级 权限列表-->
                <el-checkbox
                  :indeterminate="one.indeterminate"
                  v-model="one.checked"
                  @change="checkedOneAll(oneIndex,one.id,$event)"
                  :key="oneIndex"
                >{{ one.name }}</el-checkbox>
              </template>
              <!-- 二级 权限列表-->
              <el-checkbox
                v-for="(two,twoIndex) in one.children"
                v-model="two.checked"
                @change="checkedTwoAll(oneIndex,twoIndex,two.id,one.id,$event)"
                :indeterminate="two.indeterminate"
                :key="twoIndex"
              >
                {{two.name}}
                <div style="position: absolute" v-if="two.children.length>0">
                  <el-checkbox
                    style="display:block;line-height: 2"
                    v-for="(three,threeIndex) in two.children"
                    :key="threeIndex"
                    v-model="three.checked"
                    :title="three.name"
                    @change="checkedThreeAll(oneIndex,twoIndex,threeIndex,three.id,two.id,$event)"
                  >{{three.name|filterName}}</el-checkbox>
                </div>
              </el-checkbox>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-row>
    </div>
  </el-scrollbar>
</template>
<script>
export default {
  name: 'menuList',
  components: {},
  props: {},
  data() {
    return {
      menuData: [
        {
          id: 73,
          name: '地图',
          children: [
            {
              id: 35,
              name: '实时态势',
              children: [
                {
                  id: 35,
                  name: '实时态势',
                  checked: false
                }
              ],
              checked: false
            },
            {
              id: 69,
              name: '实时态势',
              children: [],
              checked: false
            },
            {
              id: 68,
              name: '统计图',
              children: [],
              checked: false
            },
            {
              id: 21,
              name: '禁飞区列表',
              children: [],
              checked: false
            },
            {
              id: 22,
              name: '禁飞区添加',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 74,
          name: '设备',
          children: [
            {
              id: 2,
              name: '无人机列表',
              children: [],
              checked: false
            },
            {
              id: 79,
              name: '警用无人机列表',
              children: [
                {
                  id: 108,
                  name: '进入警用无人机修改页面',
                  children: [],
                  checked: false
                },
                {
                  id: 111,
                  name: '警用无人机修改操作',
                  children: [],
                  checked: false
                },
                {
                  id: 110,
                  name: '进入警用无人机详情页面',
                  children: [],
                  checked: false
                },
                {
                  id: 151,
                  name: '警用无人机删除',
                  children: [],
                  checked: false
                },
                {
                  id: 109,
                  name: '进入警用无人机添加页面',
                  children: [],
                  checked: false
                }
              ],
              checked: false
            },
            {
              id: 66,
              name: '定位器列表',
              children: [],
              checked: false
            },
            {
              id: 30,
              name: '无人机厂商列表',
              children: [],
              checked: false
            },
            {
              id: 3,
              name: '添加无人机',
              children: [],
              checked: false
            },
            {
              id: 67,
              name: '新增定位器',
              children: [],
              checked: false
            },
            {
              id: 31,
              name: '添加厂商',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 75,
          name: '人员',
          children: [
            {
              id: 59,
              name: '持有者列表',
              children: [],
              checked: false
            },
            {
              id: 172,
              name: '新增持有者',
              children: [],
              checked: false
            },
            {
              id: 178,
              name: '待审核名单',
              children: [],
              checked: false
            },
            {
              id: 192,
              name: '历史用户日志',
              children: [],
              checked: false
            },
            {
              id: 175,
              name: '任务小组列表',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 76,
          name: '报批',
          children: [
            {
              id: 7,
              name: '飞行计划列表',
              children: [],
              checked: false
            },
            {
              id: 8,
              name: '飞行计划/报备',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 152,
          name: '可疑飞行处理',
          children: [
            {
              id: 18,
              name: '可疑飞行列表',
              children: [],
              checked: false
            },
            {
              id: 177,
              name: '任务处理列表',
              children: [],
              checked: false
            },
            {
              id: 19,
              name: '可疑飞行举报',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 77,
          name: '日志',
          children: [
            {
              id: 191,
              name: '用户审核日志',
              children: [],
              checked: false
            },
            {
              id: 198,
              name: '分局统计率',
              children: [],
              checked: false
            },
            {
              id: 45,
              name: '飞行记录',
              children: [],
              checked: false
            },
            {
              id: 148,
              name: '权限日志列表',
              children: [],
              checked: false
            },
            {
              id: 166,
              name: '审批记录',
              children: [],
              checked: false
            },
            {
              id: 169,
              name: '新增用户/设备',
              children: [],
              checked: false
            },
            {
              id: 196,
              name: '数据库管理',
              children: [],
              checked: false
            },
            {
              id: 53,
              name: '警报记录',
              children: [],
              checked: false
            },
            {
              id: 78,
              name: '任务列表',
              children: [
                {
                  id: 89,
                  name: '查看任务详情',
                  children: [],
                  checked: false
                }
              ],
              checked: false
            },
            {
              id: 55,
              name: '操作记录',
              children: [],
              checked: false
            },
            {
              id: 171,
              name: '推流申请记录',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 80,
          name: '权限',
          children: [
            {
              id: 141,
              name: '警员权限管理',
              children: [
                {
                  id: 142,
                  name: '新增子权限组',
                  children: [],
                  checked: false
                }
              ],
              checked: false
            },
            {
              id: 190,
              name: '警员访问权限',
              children: [],
              checked: false
            },
            {
              id: 193,
              name: '模块访问权限',
              children: [],
              checked: false
            },
            {
              id: 81,
              name: '权限组列表',
              children: [
                {
                  id: 85,
                  name: '新增权限组',
                  children: [],
                  checked: false
                },
                {
                  id: 88,
                  name: '查看用户列表',
                  children: [],
                  checked: false
                },
                {
                  id: 87,
                  name: '查看菜单列表',
                  children: [],
                  checked: false
                },
                {
                  id: 86,
                  name: '删除权限组',
                  children: [],
                  checked: false
                }
              ],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 82,
          name: '短信',
          children: [
            {
              id: 84,
              name: '统计总览',
              children: [],
              checked: false
            },
            {
              id: 83,
              name: '发送记录查询',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 60,
          name: '防控设备管理',
          children: [
            {
              id: 179,
              name: '设备态势',
              children: [],
              checked: false
            },
            {
              id: 10,
              name: '防控设备列表',
              children: [],
              checked: true
            },
            {
              id: 11,
              name: '新增防控设备',
              children: [],
              checked: false
            },
            {
              id: 72,
              name: '无源测试页面',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 61,
          name: '防区管理',
          children: [
            {
              id: 38,
              name: '防区管理',
              children: [],
              checked: false
            },
            {
              id: 39,
              name: '新增防区',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 62,
          name: '数据概况',
          children: [
            {
              id: 32,
              name: '防控数据统计',
              children: [],
              checked: false
            },
            {
              id: 162,
              name: '目标记录',
              children: [],
              checked: false
            },
            {
              id: 187,
              name: '断网记录',
              children: [],
              checked: false
            },
            {
              id: 181,
              name: '数据统计',
              children: [],
              checked: false
            },
            {
              id: 189,
              name: '特殊统计列表',
              children: [],
              checked: false
            },
            {
              id: 195,
              name: '详细日志',
              children: [],
              checked: false
            },
            {
              id: 180,
              name: '处置记录',
              children: [],
              checked: false
            },
            {
              id: 188,
              name: '断网告警记录',
              children: [],
              checked: false
            },
            {
              id: 194,
              name: '统计日志',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 159,
          name: '微信端-实时态势',
          children: [
            {
              id: 161,
              name: '显示民航飞机',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 155,
          name: '微信端-警用无人机录入',
          children: [],
          checked: false
        },
        {
          id: 173,
          name: '微信端-更多功能',
          children: [],
          checked: false
        },
        {
          id: 158,
          name: '微信端-处置任务',
          children: [],
          checked: false
        },
        {
          id: 143,
          name: '视频图传',
          children: [
            {
              id: 144,
              name: '图传列表',
              children: [],
              checked: false
            },
            {
              id: 146,
              name: '图传模板列表',
              children: [],
              checked: false
            },
            {
              id: 145,
              name: '新增图传',
              children: [],
              checked: false
            },
            {
              id: 150,
              name: '存储回放',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 136,
          name: '门户',
          children: [
            {
              id: 137,
              name: '用户咨询管理',
              children: [],
              checked: false
            },
            {
              id: 140,
              name: '文章管理',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 154,
          name: '微信端-民用无人机列表',
          children: [],
          checked: false
        },
        {
          id: 157,
          name: '微信端-警用无人机飞行申请',
          children: [],
          checked: false
        },
        {
          id: 160,
          name: '微信端-警用无人机列表',
          children: [],
          checked: false
        },
        {
          id: 153,
          name: '微信端-可疑飞行查询',
          children: [],
          checked: false
        },
        {
          id: 138,
          name: '大屏',
          children: [
            {
              id: 139,
              name: '指挥中心',
              children: [],
              checked: false
            }
          ],
          checked: false
        },
        {
          id: 156,
          name: '微信端-飞行计划列表',
          children: [],
          checked: false
        },
        {
          id: 52,
          name: '日志记录',
          children: [
            {
              id: 64,
              name: '授权记录',
              children: [],
              checked: false
            },
            {
              id: 135,
              name: '操作记录',
              children: [],
              checked: false
            }
          ],
          checked: false
        }
      ],
      isCheckAll: false, // 一级全选状态
      indeterminate: false
    }
  },
  computed: {},
  methods: {
    // 总change事件
    checkAll(e) {
      this.ischeckAll = e
      if (e === true) {
        this.indeterminate = false
        for (var i = 0, len = this.menuData.length; i < len; i++) {
          // 二级全选反选不确定
          this.menuData[i].checked = e
          this.menuData[i].indeterminate = false
          for (
            var j = 0, len1 = this.menuData[i].children.length;
            j < len1;
            j++
          ) {
            this.menuData[i].children[j].checked = e
            for (
              var k = 0, len2 = this.menuData[i].children[j].children.length;
              k < len2;
              k++
            ) {
              this.menuData[i].children[j].children[k].checked = e
            }
          }
        }
      } else {
        this.indeterminate = false
        for (var i = 0, len = this.menuData.length; i < len; i++) {
          // 三级全选反选不确定
          this.menuData[i].checked = e
          this.menuData[i].indeterminate = false
          for (
            var j = 0, len1 = this.menuData[i].children.length;
            j < len1;
            j++
          ) {
            this.menuData[i].children[j].checked = e
            for (
              var k = 0, len2 = this.menuData[i].children[j].children.length;
              k < len2;
              k++
            ) {
              this.menuData[i].children[j].children[k].checked = e
            }
          }
        }
      }
    },
    // 一级change事件
    checkedOneAll(oneIndex, oneId, e) {
      this.menuData[oneIndex].checked = e // 一级勾选后，子级全部勾选或者取消
      if (e === true) {
        // 去掉一级不确定状态
        this.menuData[oneIndex].indeterminate = false
      }
      let childrenArray = this.menuData[oneIndex].children
      if (childrenArray.length > 0) {
        childrenArray.forEach(oneItem => {
          oneItem.checked = e
          if (oneItem.children.length > 0) {
            oneItem.children.forEach(twoItem => {
              twoItem.checked = e
            })
          }
        })
      }
      this.getIsCheckAll()
    },
    // 二级change事件
    checkedTwoAll(oneIndex, twoIndex, twoId, oneId, e) {
      var childrenArray = this.menuData[oneIndex].children
      var tickCount = 0,
        unTickCount = 0,
        len = childrenArray.length
      for (var i = 0; i < len; i++) {
        if (twoId === childrenArray[i].id) childrenArray[i].checked = e
        if (childrenArray[i].checked === true) tickCount++
        if (childrenArray[i].checked === false) unTickCount++
      }
      // 判断二级下面是否还有三级，点击选择二级(选择与不选）时候下面三级是全选还是全不选
      if (childrenArray[twoIndex].children.length > 0) {
        childrenArray[twoIndex].children.forEach(threeItem => {
          threeItem.checked = e
        })
        // 判断二级是否选中
        childrenArray[twoIndex].checked = e
        if (e === true) {
          childrenArray[twoIndex].indeterminate = false
        }
      }
      if (tickCount === len) {
        // 二级全勾选
        this.menuData[oneIndex].checked = e
        this.menuData[oneIndex].indeterminate = false
      } else if (unTickCount === len) {
        // 二级全不勾选
        this.menuData[oneIndex].checked = e
        this.menuData[oneIndex].indeterminate = false
      } else {
        this.menuData[oneIndex].checked = e
        this.menuData[oneIndex].indeterminate = true // 添加一级不确定状态
      }

      this.getIsCheckAll()
    },
    // 三级change事件
    checkedThreeAll(oneIndex, twoIndex, threeIndex, threeId, twoId, e) {
      let childrenArray = this.menuData[oneIndex].children[twoIndex].children
      let tickCount = 0,
        unTickCount = 0,
        len = childrenArray.length
      for (let i = 0; i < len; i++) {
        if (threeId === childrenArray[i].id) childrenArray[i].checked = e
        if (childrenArray[i].checked === true) tickCount++
        if (childrenArray[i].checked === false) unTickCount++
      }
      if (tickCount === len) {
        // 三级全勾选
        this.menuData[oneIndex].children[twoIndex].checked = true
        this.menuData[oneIndex].children[twoIndex].indeterminate = false
        this.menuData[oneIndex].checked = true
        this.menuData[oneIndex].indeterminate = false // 添加二级不确定状态
      } else if (unTickCount === len) {
        // 三级全不勾选
        this.menuData[oneIndex].children[twoIndex].checked = false
        this.menuData[oneIndex].children[twoIndex].indeterminate = false
        this.menuData[oneIndex].checked = false
        this.menuData[oneIndex].indeterminate = true // 添加二级不确定状态
        this.isCheckAll = false
        this.indeterminate = true
      } else if (tickCount !== len) {
        // 三级勾选几个
        this.menuData[oneIndex].children[twoIndex].checked = e
        this.menuData[oneIndex].children[twoIndex].indeterminate = true
        this.menuData[oneIndex].checked = false
        this.menuData[oneIndex].indeterminate = true // 添加二级不确定状态
        this.isCheckAll = false
        this.indeterminate = true
      }
      this.getIsCheckAll()
    },
    /**
     *是否全选
     */
    getIsCheckAll() {
      var tickCount = 0,
        unTickCount = 0,
        ArrLength = this.menuData.length
      for (var j = 0; j < ArrLength; j++) {
        // 全选checkbox状态
        if (this.menuData[j].checked === true) tickCount++
        if (this.menuData[j].checked === false) unTickCount++
      }
      if (tickCount === ArrLength) {
        // 二级全勾选
        this.isCheckAll = true
        this.indeterminate = false
      } else if (unTickCount === ArrLength) {
        // 二级全不勾选
        this.isCheckAll = false
        this.indeterminate = false
      } else {
        this.isCheckAll = false
        this.indeterminate = true // 添加一级不确定状态
      }
    },
    /**
     * 获取列表数据
     *
     */
    getList() {
      this.menuData.forEach((oneItem, oneIndex) => {
        if (oneItem.children.length > 0) {
          let oneCountNum = oneItem.children.length
          let isOneCheckedNum = 0
          oneItem.children.forEach(twoItem => {
            if (twoItem.checked) {
              isOneCheckedNum += 1
            }
            if (twoItem.children.length > 0) {
              let twoCountNum = twoItem.children.length
              let isTwoCheckedNum = 0
              twoItem.children.forEach(three => {
                if (three.checked) {
                  isTwoCheckedNum += 1
                }
              })
              twoItem.checked = isTwoCheckedNum === twoCountNum
              twoItem.indeterminate =
                isTwoCheckedNum > 0 && isTwoCheckedNum < twoCountNum
            }
          })
          oneItem.checked = isOneCheckedNum === oneCountNum
          oneItem.indeterminate =
            isOneCheckedNum > 0 && isOneCheckedNum < oneCountNum
        }
      })
    }
  },
  created() {
    this.getList()
  },
  watch: {},
  filters: {
    filterName(value) {
      return value.substring(0, 5) + '...'
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-collapse-item__content {
  padding-bottom: 0;
  min-height: 200px;
  font-size: 33px;
  margin-left: 2%;
}
/deep/.el-checkbox {
  margin-right: 60px !important;
}
</style>
