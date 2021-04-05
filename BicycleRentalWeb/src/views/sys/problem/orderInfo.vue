<template>
  <div>
    <h3>订单查询</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已完成的订单</span>
      </div>
      <div>
        <vxe-table
          :data="tableData"
          ref="xTable"
          border
        >
          <vxe-table-column field="orderId" title="订单编号"></vxe-table-column>
          <vxe-table-colgroup title="租赁方式">
            <vxe-table-column field="rentMode" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterRentMode">
              <template #header="{ column }">
                <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="rentModeList" @change="filterEvent(option)" placeholder="请选择" clearable transfer></vxe-select>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column field="startTime" title="订单开始时间"></vxe-table-column>
          <vxe-table-column field="endTime" title="订单结束时间"></vxe-table-column>
          <vxe-table-column field="rent" title="总租金"></vxe-table-column>
          <vxe-table-column field="evaluation" title="订单评价"></vxe-table-column>
          <vxe-table-column field="isMoreFixed" title="还车点是否超出服务区"></vxe-table-column>
          <vxe-table-colgroup title="订单状态">
            <vxe-table-column field="state" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterState">
              <template #header="{ column }">
                <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="stateList" @change="filterEvent(option)" placeholder="请选择" clearable transfer></vxe-select>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column field="user.username" title="用户名"></vxe-table-column>
          <vxe-table-column field="user.name" title="用户姓名"></vxe-table-column>
          <vxe-table-column field="user.phoneNumber" title="用户电话号"></vxe-table-column>
          <vxe-table-column title="取车点位置" width="140px">
            <template #default="{ row }">
              <span>{{ row.location.province + row.location.city + row.location.area + row.location.locationInfo }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="bicycle.bicycleCode" title="自行车编码"></vxe-table-column>
          <vxe-table-column title="计费方式">
            <template #default="{ row }">
              <span>{{price}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="是否使用优惠券">
            <template #default="{ row }">
              <span>{{isUseCoupon}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="coupon.discount" title="优惠券折扣"></vxe-table-column>
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

export default {
  name: 'orderInfo',
  data() {
    return {
      tableData: [],
      tablePage: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      },
      //用于存计费方式
      price: '',
      //是否使用优惠券
      isUseCoupon: '',
      //用于筛选表格
      rentModeList: [
        { label: '日租', value: '日租' },
        { label: '月租', value: '月租' },
        { label: '时租', value: '时租' },
      ],
      stateList:[
        { label: '已完成', value: '已完成' },
        { label: '正在进行', value: '正在进行' },
        { label: '未支付', value: '未支付' },
      ]
    }
  },
  created() {
    // 初始化 查询订单信息
    this.findOrder()
  },
  methods: {
    findOrder() {
      axios({
        url: 'http://localhost:9001/order/pageFindAllOrder',
        method: 'GET',
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }).then(response => {
        console.log(response)
        if (response.data.code === 20000) {
          //对返回结果进行处理显示
          response.data.data.data.forEach((item,index) =>{
            if(item.rentMode === 'h') {
              item.rentMode = '时租'
              this.price = item.bicycle.hourRent+'元/小时'
            }
            if(item.rentMode === 'd') {
              item.rentMode = '日租'
              this.price = item.bicycle.dayRent+'元/天'
            }
            if(item.rentMode === 'm') {
              item.rentMode = '月租'
              this.price = item.bicycle.monthRent+'元/月'
            }
            if(item.isMoreFixed === 1) {
              item.isMoreFixed = '是'
            }
            if(item.isMoreFixed === 0){
              item.isMoreFixed = '否'
            }
            if(item.couponId === null) {
              this.isUseCoupon = '否'
            }else {
              this.isUseCoupon = '是'
            }
            if(item.state === 0) {
              item.state = '已完成'
            }
            if(item.state === 1) {
              item.state = '正在进行'
            }
            if(item.state === 2) {
              item.state = '未支付'
            }
          })
          this.tableData = response.data.data.data
          this.tablePage.totalResult = response.data.data.total
        }
      })
    },
    //切换分页
    handlePageChange({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //调用函数根据新的分页数据再次查询
      this.findOrder()
    },
    formatterRentMode ({ cellValue }) {
      const item = this.rentModeList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    formatterState ({ cellValue }) {
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
