<template>
  <div id="app">
    <h2 style="color: #409EFF;padding-left: 40px">购买优惠券</h2>
    <el-row>
      <el-col :span="6" v-for="(val, index) in couponList" :key="val.couponId" :offset="index > 0 ? 1 : 0"
              style="margin: 40px"
      >
        <el-card :body-style="{ padding: '13px' }" shadow="hover" onMouseOver=" this.style.color='#F56C6C'"
                 onMouseOut="this.style.color='#000000'" style="width: 300px;height: 400px"
        >
          <img :src="imgList.idView" class="image">
          <div style="padding: 15px;">
            <span class="span1">{{ val.couponName }}</span>
            <div class="bottom clearfix">
              <span class="span2">描述：{{ val.couponDescribe }}</span>
            </div>
          </div>
          <el-button size="small" medium :round="true" class="button" onMouseOver=" this.style.color='#409EFF'"
                     onMouseOut="this.style.color='#000000'" :id="val.couponId" @click="detial($event)"
          >查看详情
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情页面弹窗-->
    <el-dialog title="优惠券详情" :visible.sync="dialogVisible" :append-to-body="true">
      <el-form class="form" ref="form" :model="form" label-width="90px">
        <el-form-item label="优惠券名称: ">
          <span>{{ form.couponName }}</span>
        </el-form-item>
        <el-form-item label="折扣: ">
          <span>{{ form.discount }} 折</span>
        </el-form-item>
        <el-form-item label="售价: ">
          <span>{{ form.price }} 元/张</span>
        </el-form-item>
        <el-form-item label="优惠券描述: ">
          <span>{{ form.couponDescribe }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即下单</el-button>
          <el-button @click="notSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 支付页面弹窗-->
    <el-dialog title="支付" :visible.sync="innerVisible" :append-to-body="true">
      <form class="buy" :model="form" label-width="95px" action="http://localhost:9001/aliPay" method="post">
        <span>订单号:</span>
        <el-input v-model="form.couponId" name="out_trade_no"></el-input>
        <br/>
        <span>优惠券名:</span>
        <el-input v-model="form.couponName" name="subject"></el-input>
        <br/>
        <span>优惠券描述:</span>
        <el-input v-model="form.couponDescribe" name="body"></el-input>
        <br/>
        <span>折扣:</span>
        <el-input v-model="form.discount"></el-input>
        <br/>
        <span>售价:</span>
        <el-input v-model="form.price" name="total_amount"></el-input>
        <br/>
        <button type="submit" style="text-align: center;background-color: #409EFF;width: 80px;height: 40px;margin-top: 20px">支付</button>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'buyCoupon',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data () {
    return{
      imgList: {id:0,idView:require("@/assets/coupon/coupon.jpg")},
      dialogVisible: false,
      form: {
        couponId: '',
        couponName: '',
        couponDescribe: '',
        discount: '',
        price: ''
      },
      couponList: [],
      innerVisible: false
    }
  },
  created() {
    this.findCouponList()
  },
  methods: {
    findCouponList() {
      axios({
        url: 'http://localhost:9001/coupon/findAll',
        method: 'GET'
      }).then(response => {
        if (response.data.code === 20000) {
          this.couponList = response.data.data
        } else {
          this.$message({
            message: '查询失败!',
            type: 'error'
          })
        }
      })
    },
    detial(e) {
      // 获取当前点击优惠券id
      var id = e.currentTarget.getAttribute('id')
      //根据id查修优惠券信息
      axios({
        url: 'http://localhost:9001/coupon/findByCouponId',
        method: 'POST',
        data: {
          couponId: id
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.form = response.data.data
          this.dialogVisible = true
        } else {
          return null
        }
      })
    },
    //点击下单按钮
    onSubmit() {
      //首先判断是否有需要支付的订单
      axios({
        url: 'http://localhost:9001/userCoupon/findByUsername',
        method: 'GET',
        params: {
          username: this.name
        }
      }).then(response => {
        if (response.data.data === null) {
          //其次判断卡卷包里是否已存在该优惠券，若存在则不能购买
          axios({
            url: 'http://localhost:9001/userCoupon/findByUsernameAndCouponId',
            method: 'GET',
            params: {
              username: this.name,
              couponId: this.form.couponId
            }
          }).then(response => {
            if (response.data.data === null) {
              this.$confirm('确定要购买么 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                axios({
                  url: `http://localhost:9001/coupon/buyCoupon?username=${this.name}`,
                  method: 'POST',
                  data: {
                    couponId: this.form.couponId,
                    couponName: this.form.couponName,
                    couponDescribe: this.form.couponDescribe,
                    discount: this.form.discount,
                    price: this.form.price,
                  }
                }).then(response => {
                  if (response.data.code === 20000) {
                    this.innerVisible = true
                  } else {
                    return null
                  }
                })
              }).catch(() => {
                this.dialogVisible = false
                return null;
              });
            }else {
              this.$message('您已经购买过此优惠券，不能重复购买');
              return null;
            }
          })
        } else {
          this.$message('您需要先支付未支付的订单');
          //说明有需要支付的订单
          this.form.couponId = response.data.data.couponId
          this.form.couponDescribe = response.data.data.coupon.couponDescribe
          this.form.couponName = response.data.data.coupon.couponName
          this.form.discount = response.data.data.coupon.discount
          this.form.price = response.data.data.coupon.price
          this.innerVisible = true
        }
      })
    },
    notSubmit() {
      this.dialogVisible=false;
    }
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 200px;
  display: block;
}
.span1,.span2{
  display: block;
  margin-top: 20px;
}
.span2{
  margin-bottom: 20px;
}
.button {
  float: right;
}
.buy span {
  display: block;
  width: 120px;
  height: 28px;
  margin-top: 10px;
}
</style>
