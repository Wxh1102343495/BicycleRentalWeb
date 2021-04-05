<template>
  <div>
    <h3>您已完成的订单</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
    >
      <vxe-table-column field="bicycle.bicycleName" title="自行车名字" width="80px"></vxe-table-column>
      <vxe-table-column title="取车点位置" width="280px">
        <template #default="{ row }">
          <span>{{ row.location.province + row.location.city + row.location.area + row.location.locationInfo }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="照片">
        <template #default="{ row }">
          <img :src="row.bicycle.photo" style="display: block;width: 130px;height: 80px;">
        </template>
      </vxe-table-column>
      <vxe-table-column field="rentMode" title="租赁方式" width="80px"></vxe-table-column>
      <vxe-table-column field="remark" title="计费方式" width="80px"></vxe-table-column>
      <vxe-table-column field="startTime" title="租赁时间" width="148px"></vxe-table-column>
      <vxe-table-column field="endTime" title="还车时间" width="148px"></vxe-table-column>
      <vxe-table-column field="coupon.couponName" title="使用的优惠券" width="90px"></vxe-table-column>
      <vxe-table-column field="coupon.discount" title="优惠券折扣" width="70px"></vxe-table-column>
      <vxe-table-column field="isMoreFixed" title="还车点是否超出运营区" width="50px"></vxe-table-column>
      <vxe-table-column field="rent" title="总租金" width="60px"></vxe-table-column>
      <vxe-table-column title="订单操作" width="90px">
        <template #default="{ row }">
          <el-button type="text" @click="returnBicycle(row)">申请退款</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!--联系客服弹窗-->
      <el-dialog width="30%" title="客服中心" :visible.sync="outerVisible" append-to-body>
        <span>在您退款之前请先联系我们的客服</span><br/>
        <span>客服电话：18139608032</span><br/>
        <span>请在工作日工作时间内拨打电话</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = true">确定</el-button>
        </div>
      </el-dialog>

    <!--退款信息填写弹窗-->
    <el-dialog width="30%" title="退款申请" :visible.sync="innerVisible" append-to-body>
      <span>退款原因：</span><br/>
      <el-input v-model="input" type="textarea" placeholder="请输入内容"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnPay">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'queryOrderEnd',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      tableData:[],
      input:'',
      orderId: '',
      outerVisible: false,
      innerVisible: false,
    }
  },
  created() {
    // 初始化 查询订单信息
    this.finOrderIngList()
  },
  methods: {
    //查询订单信息
    finOrderIngList() {
      axios({
        url: 'http://localhost:9001/order/queryUserOrderByUserAndState',
        method: 'GET',
        params: {
          state: 0,
          username: this.name
        }
      }).then(response => {
        if (response.data.code === 20000) {
          //遍历返回结果
          response.data.data.forEach((item, index) => {
            if (item.rentMode === 'h') {
              item.rentMode = '时租'
              item.remark = item.bicycle.hourRent + ' 元/小时'
            }
            if (item.rentMode === 'd') {
              item.rentMode = '日租'
              item.remark = item.bicycle.dayRent + ' 元/天'
            }
            if (item.rentMode === 'm') {
              item.rentMode = '月租'
              item.remark = item.bicycle.monthRent + ' 元/月'
            }
            if(item.isMoreFixed === 0) {
              item.isMoreFixed = "否"
            }else {
              item.isMoreFixed = "是"
            }
          })
          //将返回结果赋值给页面变量
          this.tableData = response.data.data
        } else {
          return null
        }
      })
    },
    returnBicycle(row) {
      if(row.stateReturnPay === 0) {
        this.orderId = row.orderId
        this.outerVisible = true
      }else {
        this.$message({
          message: '您已经申请过了',
          type: 'success'
        });
      }
    },
    //申请退款操作
    returnPay() {
      axios({
        url: 'http://localhost:9001/order/needReturnPay',
        method: 'POST',
        data: {
          returnPayCause: this.input,
          orderId: this.orderId
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.$message({
            message: '上报成功，我们将尽快给您处理',
            type: 'success'
          });
        }
        this.innerVisible = false
        this.outerVisible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
