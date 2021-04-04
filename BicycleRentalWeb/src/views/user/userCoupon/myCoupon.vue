<template>
  <div>
    <h3>我的优惠券</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>所有的优惠券</span>
      </div>
      <div>
        <vxe-table
          :data="tableData"
          ref="xTable"
          :filter-config="{showIcon: false}"
          border
        >
          <vxe-table-column field="coupon.couponName" title="优惠券名称"></vxe-table-column>
          <vxe-table-column field="coupon.price" title="价格"></vxe-table-column>
          <vxe-table-column field="coupon.discount" title="折扣"></vxe-table-column>
          <vxe-table-column field="coupon.couponDescribe" title="优惠券描述"></vxe-table-column>
          <vxe-table-colgroup title="是否使用">
            <vxe-table-column field="state" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterSex">
              <template #header="{ column }">
                <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="stateList" @change="filterEvent(option)" placeholder="请选择" clearable transfer></vxe-select>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
        </vxe-table>
        <vxe-pager
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
        >
        </vxe-pager>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'myCoupon',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      tableData: [],
      //用于筛选表格
      stateList: [
        { label: '已使用', value: '已使用' },
        { label: '未使用', value: '未使用' }
      ],
      tablePage: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      }
    }
  },
  created() {
    // 初始化查询用户的优惠券信息
    this.findCoupon()
  },
  methods: {
    findCoupon() {
      axios({
        url: 'http://localhost:9001/userCoupon/findAll',
        method: 'GET',
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize,
          username: this.name
        }
      }).then(response => {
        if (response.data.code === 20000) {
          response.data.data.data.forEach((item,index) => {
            if(item.state === 1){
              item.state = '未使用'
            }
            if(item.state === 0){
              item.state = '已使用'
            }
          })
          this.tableData = response.data.data.data
          this.tablePage.totalResult = response.data.data.total
        } else {
          this.$message({
            message: '查询失败',
            type: 'error'
          })
        }
      })
    },
    //切换分页
    handlePageChange({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findCoupon()
    },
    formatterSex ({ cellValue }) {
      const item = this.stateList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    filterEvent (option) {
      const xTable = this.$refs.xTable
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    },
    customEqualFilterMethod ({ option, row, column }) {
      if (option.data) {
        return row[column.property] === option.data
      }
      return true
    },
  }
}
</script>

<style scoped>

</style>
