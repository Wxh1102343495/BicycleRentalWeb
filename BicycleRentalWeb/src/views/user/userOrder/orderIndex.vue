<template>
<!--生成订单-->
  <div id="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>填写订单</span>
      </div>
      <div class="body">
        <el-form ref="form" :model="orderForm" label-width="120px">
          <el-form-item label="选择取车点">
            <div class="block">
              <el-select v-model="orderForm.location" placeholder="请选择取车点" :clearable="true">
                <el-option
                  v-for="item in location"
                  :key="item.id"
                  :label="item.province + item.area + item.city + item.locationInfo"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="取车时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="orderForm.date1" :picker-options="pickerOptions"
                              format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="orderForm.date2" format="HH:mm:ss" value-format="HH:mm:ss"
                              style="width: 100%;"
              ></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送">
            <el-switch v-model="orderForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="租赁方式">
            <el-radio-group v-model="orderForm.resource">
              <el-radio label="时租"></el-radio>
              <el-radio label="日租"></el-radio>
              <el-radio label="月租"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="orderForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="notSubmit">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'orderIndex',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.findLocationList()
  },
  mounted() {
    this.form = this.$route.params.form
  },
  data() {
    return {
      form: {},
      location: [],
      orderForm: {
        location: '',
        date1: '',
        date2: '',
        delivery: false,
        resource: '',
        desc: ''
      },
      pickerOptions: {
        // 限制预约日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      }
    }
  },
  methods: {
    //查询地址信息
    findLocationList() {
      axios({
        url: 'http://localhost:9001/location/findAllLocation',
        method: 'GET'
      }).then(response => {
        if (response.data.code === 20000) {
          this.location = response.data.data
        } else {
          return null
        }
      })
    },
    //生成订单
    onSubmit() {
      var startTime = this.orderForm.date1 + ' ' + this.orderForm.date2
      var rentMode = ''
      if (this.orderForm.resource === '时租') {
        rentMode = 'h'
      } else if (this.orderForm.resource === '日租') {
        rentMode = 'd'
      } else if (this.orderForm.resource === '月租') {
        rentMode = 'm'
      }
      axios({
        url: `http://localhost:9001/order/creatOrder?username=${this.name}`,
        method: 'POST',
        data: {
          bicycleId: this.form.bicycleCode,
          locationId: this.orderForm.location,
          rentMode: rentMode,
          startTime: startTime,
          remark: this.orderForm.desc
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.$message({
            message: '下单成功!',
            type: 'success'
          })
          this.$router.push({
            name:'queryOrderIng',
            path:'/userOrder/queryOrderIng',
          })
        } else {
          this.$message({
            message: '下单失败失败，请重新下单',
            type: 'error'
          })
          this.$router.push({
            name:'bicycleRental',
            path:'/userBicycle/bicycleRental',
          })
        }
      })
    },
    notSubmit() {
      this.$router.push({
        name:'bicycleRental',
        path:'/userBicycle/bicycleRental',
      })
    }
  }

}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}


</style>
