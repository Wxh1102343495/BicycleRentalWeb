<template>
  <div>
    <h3>您未完成的订单</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
    >
      <vxe-table-column field="bicycle.bicycleName" title="自行车名字" width="150px"></vxe-table-column>
      <vxe-table-column title="取车点位置" width="300px">
        <template #default="{ row }">
          <span>{{ row.location.province + row.location.city + row.location.area + row.location.locationInfo }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column title="照片">
        <template #default="{ row }">
          <img :src="row.bicycle.photo" style="display: block;width: 150px;height: 80px;">
        </template>
      </vxe-table-column>
      <vxe-table-column field="rentMode" title="租赁方式" width="80px"></vxe-table-column>
      <vxe-table-column field="remark" title="计费方式" width="90px"></vxe-table-column>
      <vxe-table-column field="startTime" title="租赁时间" width="150px"></vxe-table-column>
      <vxe-table-column title="订单操作">
        <template #default="{ row }">
          <el-button type="info" icon="el-icon-star-off" circle @click="returnBicycle(row)">还车</el-button>
          <el-button type="info" icon="el-icon-delete" circle @click="removeBicycle(row)">取消</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!--取消订单弹窗-->
    <el-dialog title="确定要取消该订单么？" :visible.sync="outerVisible" :modal="false">
      <el-dialog
        width="30%"
        title="填写取消原因"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :model="form">
          <el-form-item label="取消原因">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click="innerVisible = false;outerVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
      </div>
    </el-dialog>

    <!--确认还车弹窗-->
    <el-dialog :title="diaoTitel" :visible.sync="outReturn" :modal="false">
      <el-dialog
        width="40%"
        :visible.sync="innerReturn"
        append-to-body
      >
        <el-form :model="returnForm" :rules="rules" ref="ruleForm">
          <el-form-item label="自行车质量">
            <el-rate v-model="returnForm.value1" style="margin-top: 10px"></el-rate>
          </el-form-item>
          <el-form-item label="服务质量">
            <el-rate v-model="returnForm.value2" style="margin-top: 10px"></el-rate>
          </el-form-item>
          <el-form-item label="满意度">
            <el-rate v-model="returnForm.value3" style="margin-top: 10px"></el-rate>
          </el-form-item>
          <el-form-item label="整体评价">
            <el-rate v-model="returnForm.value4" style="margin-top: 10px"></el-rate>
          </el-form-item>
          <el-form-item label="优惠券使用">
            <div class="block">
              <el-select v-model="returnForm.couponId" placeholder="请选择可以使用的优惠券" :clearable="true">
                <el-option
                  v-for="item in coupon"
                  :key="item.couponId"
                  :label="item.coupon.couponName +'   ['+ item.coupon.discount+'折]' "
                  :value="item.couponId"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="订单评价" prop="evaluation">
            <el-input type="textarea" v-model="returnForm.evaluation"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="returnSubmit('ruleForm')">提交</el-button>
            <el-button @click="innerReturn = false;outReturn = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outReturn = false">取 消</el-button>
        <el-button type="primary" @click="innerReturn = true">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'queryOrder',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      tableData: [],
      form: {},
      //弹窗标题
      diaoTitel: '',
      outerVisible: false,
      innerVisible: false,
      outReturn: false,
      innerReturn: false,
      //用于点击还车按钮保存当前自行车信息
      returnForm: {},
      rules: {
        evaluation: [
          { required: true, message: '必须填写', trigger: 'blur' }
        ]
      },
      //用于存放优惠券信息
      coupon: [],
    }
  },
  created() {
    // 初始化 查询正在进行订单信息
    this.finOrderIngList()
    this.finCouponList()
  },
  methods: {
    //查询正在进行订单信息
    finOrderIngList() {
      axios({
        url: 'http://localhost:9001/order/queryUserOrderByUserAndState',
        method: 'GET',
        params: {
          state: 1,
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
          })
          //将返回结果赋值给页面变量
          this.tableData = response.data.data
        } else {
          return null
        }
      })
    },

    //查询当前用户优惠券信息
    finCouponList() {
      axios({
        url: 'http://localhost:9001/userCoupon/findCouponByUsername',
        method: 'GET',
        params: {
          username: this.name
        }
      }).then(response => {
        this.coupon = response.data.data
      })
    },
    //点击还车按钮
    returnBicycle(row) {
      //还车 只要当前时间大于预定时间便可还车
      if (Date.parse(row.startTime) > new Date()) {
        this.$notify.error({
          title: '错误',
          message: '该订单还未开始!',
          duration: 3000
        })
      } else {
        //判断自行车位置并提示
        axios({
          url: 'http://localhost:9001/fixed/findFixed',
          method: 'GET'
        }).then(response => {
          //若超出运营区
          if(response.data.data === 0) {
            this.diaoTitel = "您的停车点在运营区外，若在此还车则需要额外支付200元调度费，您确定还车么？"
            row.rent = 200
            this.returnForm = row
            this.outReturn = true
          }else {
            this.diaoTitel = "您确定还车么？"
            this.returnForm = row
            this.outReturn = true
          }
        })
      }
    },
    //点击取消按钮
    removeBicycle(row) {
      //获取数据表中预定的时间
      var date = Date.parse(row.startTime)
      //获取当前系统时间，并将两个时间转换为时间戳进行比较
      if (new Date(date).getTime() > new Date().getTime() + 60 * 60 * 1000) {
        this.form.orderId = row.orderId
        this.outerVisible = true
      } else {
        this.$notify.error({
          title: '错误',
          message: '该订单已经开始不可以取消!',
          duration: 3000
        })
      }
    },
    //取消弹窗确定取消按钮
    onSubmit() {
      axios({
        url: 'http://localhost:9001/order/removeOrder',
        method: 'POST',
        data: {
          orderId: this.form.orderId
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.$message({
            message: '成功!',
            type: 'success'
          })
        } else {
          return null
        }
      })
      this.innerVisible = false
      this.outerVisible = false
      this.finOrderIngList()
    },
    //还车弹窗确定按钮
    returnSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'http://localhost:9001/order/finishOrder',
            method: 'POST',
            data: this.returnForm,
          }).then(response => {
            console.log(response)
            if (response.data.code === 20000) {
              this.$router.push({
                name: 'payIndex',
                path: '/pay/payIndex'
              })
            }
          })
        } else {
          return false
        }
        this.innerReturn = false
        this.outReturn = false
        this.finOrderIngList()
      })
    }
  }
}
</script>

<style scoped>

</style>
