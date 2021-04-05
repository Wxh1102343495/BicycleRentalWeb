<template>
  <div>
    <h3>退款处理</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>申请退款的订单</span>
      </div>
      <div>
        <vxe-table
          :data="tableData"
          ref="xTable"
          border
        >
          <vxe-table-column field="orderId" title="订单编号"></vxe-table-column>
          <vxe-table-column field="rentMode" title="租赁方式"></vxe-table-column>
          <vxe-table-column field="startTime" title="订单开始时间"></vxe-table-column>
          <vxe-table-column field="endTime" title="订单结束时间"></vxe-table-column>
          <vxe-table-column field="rent" title="总租金"></vxe-table-column>
          <vxe-table-column field="isMoreFixed" title="还车点是否超出服务区"></vxe-table-column>
          <vxe-table-column field="user.username" title="用户名"></vxe-table-column>
          <vxe-table-column field="user.phoneNumber" title="用户电话号"></vxe-table-column>
          <vxe-table-column field="bicycle.bicycleCode" title="自行车编码"></vxe-table-column>
          <vxe-table-column title="计费方式">
            <template #default="{ row }">
              <span>{{ price }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column title="是否使用优惠券">
            <template #default="{ row }">
              <span>{{ isUseCoupon }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="coupon.discount" title="优惠券折扣"></vxe-table-column>
          <vxe-table-column title="订单操作" width="90px">
            <template #default="{ row }">
              <el-button type="text" @click="returnPay(row)">退款</el-button><br/>
              <el-button type="text" @click="notReturnPay(row)">无需退款</el-button>
            </template>
          </vxe-table-column>
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

<!--退款弹窗-->
    <el-dialog width="30%" title="退款" :visible.sync="innerVisible" append-to-body>
      <form :model="form" label-width="85px" action="http://localhost:9001/returnPay" method="post">
        <span>编号:</span>
        <el-input v-model="form.userId" name="userId"></el-input>
        <br/>
        <span>订单号:</span>
        <el-input v-model="form.orderId" name="out_trade_no"></el-input>
        <br/>
        <span>退款金额:</span>
        <el-input v-model="form.rent" name="refund_amount"></el-input>
        <br/>
        <button type="submit"
                style="text-align: center;background-color: #409EFF;width: 80px;height: 40px;margin-top: 20px"
        >确定
        </button>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'needReturnPay',
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
      form: {},
      innerVisible: false
    }
  },
  created() {
    // 初始化 查询订单信息
    this.findNeedReturnPayOrder()
  },
  methods: {
    findNeedReturnPayOrder() {
      axios({
        url: 'http://localhost:9001/order/findNeedReturnPay',
        method: 'GET',
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }).then(response => {
        if (response.data.data.data != null) {
          //对返回结果进行处理显示
          response.data.data.data.forEach((item,index) => {
            if (item.rentMode === 'h') {
              item.rentMode = '时租'
              this.price = item.bicycle.hourRent + '元/小时'
            }
            if (item.rentMode === 'd') {
              item.rentMode = '日租'
              this.price = item.bicycle.dayRent + '元/天'
            }
            if (item.rentMode === 'm') {
              item.rentMode = '月租'
              this.price = item.bicycle.monthRent + '元/月'
            }
            if (item.isMoreFixed === 1) {
              item.isMoreFixed = '是'
            }
            if (item.isMoreFixed === 0) {
              item.isMoreFixed = '否'
            }
            if (item.couponId === null) {
              this.isUseCoupon = '否'
            } else {
              this.isUseCoupon = '是'
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
      this.findNeedReturnPayOrder()
    },

    //退款
    returnPay(row) {
      this.form.userId = row.user.id
      this.form.orderId = row.orderId
      this.form.rent = row.rent
      this.innerVisible = true
    },
    //无需退款
    notReturnPay(row) {
      axios({
        url: 'http://localhost:9001/order/needReturnPayFinash',
        method: 'POST',
        data: {
          orderId: row.orderId
        }
      }).then(response => {
        if(response.data.code === 20000) {
          this.$message({
            message: '退款成功',
            type: 'success'
          });
        }
        this.findNeedReturnPayOrder()
      })
    }
  }
}
</script>

<style scoped>

</style>
