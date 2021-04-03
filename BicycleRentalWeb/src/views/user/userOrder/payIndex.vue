<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付</span>
      </div>
      <div class="aaa" style="margin: 10px 50px">
        <form :model="form" label-width="85px" action="http://localhost:9001/aliPay" method="post">
          <span>订单号:</span>
          <el-input v-model="form.orderId" name="out_trade_no"></el-input>
          <br/>
          <span>自行车名:</span>
          <el-input v-model="form.bicycle.bicycleName" name="subject"></el-input>
          <br/>
          <span>自行车描述:</span>
          <el-input v-model="form.bicycle.describ" name="body"></el-input>
          <br/>
          <span>租赁方式:</span>
          <el-input v-model="form.rentMode"></el-input>
          <br/>
          <span>租赁价格:</span>
          <el-input v-model="price"></el-input>
          <br/>
          <span>优惠券使用情况:</span>
          <el-input v-model="couponUse"></el-input>
          <br/>
          <span>租车时间:</span>
          <el-input v-model="form.startTime"></el-input>
          <br/>
          <span>还车时间:</span>
          <el-input v-model="form.endTime"></el-input>
          <br/>
          <span>租金:</span>
          <el-input v-model="form.rent" name="total_amount"></el-input>
          <br/>
          <button type="submit"
                  style="text-align: center;background-color: #409EFF;width: 80px;height: 40px;margin-top: 20px"
          >支付
          </button>
        </form>
      </div>
    </el-card>

    <!--弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <h2>您没有需要支付的订单</h2>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="ok">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.findOrderNeedPay()
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        bicycle: {
          bicycleName: '',
          describ: ''
        }
      },
      //存储租赁价格信息
      price: '',
      //存储优惠券使用情况
      couponUse: ''
    }
  },
  methods: {
    findOrderNeedPay() {
      axios({
        url: 'http://localhost:9001/order/findOrderNeedPay',
        method: 'GET',
        params: {
          username: this.name
        }
      }).then(response => {
        if (response.data.data === '') {
          this.dialogVisible = true
          return null
        }
        if (response.data.code === 20000) {
          //遍历返回结果
          if (response.data.data.rentMode === 'h') {
            response.data.data.rentMode = '时租'
            this.price = response.data.data.bicycle.hourRent + ' 元/小时'
          }
          if (response.data.data.rentMode === 'd') {
            response.data.data.rentMode = '日租'
            this.price = response.data.data.bicycle.dayRent + ' 元/日'
          }
          if (response.data.data.rentMode === 'm') {
            response.data.data.rentMode = '月租'
            this.price = response.data.data.bicycle.monthRent + ' 元/月'
          }
          if(response.data.data.coupon === null) {
            this.couponUse = "未使用优惠券"
          }else {
            this.couponUse = response.data.data.coupon.couponName +' / '+ response.data.data.coupon.discount + '折'
          }
          this.form = response.data.data
        }
      })
    },
    ok() {
      this.dialogVisible = false
      this.$router.push({
        name: 'Dashboard',
        path: '/dashboard'
      })
    }
  }
}
</script>

<style>
.el-input {
  display: inline-block;
  height: 47px;
  width: 55%;
  margin-left: 20px;
}

.aaa span {
  display: block;
  width: 120px;
  height: 28px;
  margin-top: 10px;
}
</style>
