<template>
  <div id="app">
    <h2 style="color: #409EFF;padding-left: 40px">选择自行车</h2>
    <el-row>
      <el-col :span="6" v-for="(val, index) in bicycleList" :key="val.bicycleCode" :offset="index > 0 ? 1 : 0"
              style="margin: 40px"
      >
        <el-card :body-style="{ padding: '13px' }" shadow="hover" onMouseOver=" this.style.color='#F56C6C'"
                 onMouseOut="this.style.color='#000000'" style="width: 300px;height: 400px"
        >
          <img :src="val.photo" class="image">
          <div style="padding: 5px;">
            <span class="span1">{{ val.bicycleName }}</span>
            <div class="bottom clearfix">
              <span class="span2">描述：{{ val.describ }}</span>
            </div>
          </div>
          <el-button size="small" medium :round="true" class="button" onMouseOver=" this.style.color='#409EFF'"
                     onMouseOut="this.style.color='#000000'" :id="val.bicycleCode" @click="detial($event)"
          >查看详情
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情页面弹窗-->
    <el-dialog title="自行车详情" :visible.sync="dialogVisible">
      <el-form class="form" ref="form" :model="form" label-width="90px">
        <el-form-item label="自行车名称: ">
          <span>{{ form.bicycleName }}</span>
        </el-form-item>
        <el-form-item label="自行车照片:">
          <img :src="form.photo" style="display: block;width: 250px;height: 150px;">
        </el-form-item>
        <el-form-item label="时租费用: ">
          <span>{{ form.hourRent }} 元/小时</span>
        </el-form-item>
        <el-form-item label="日租费用: ">
          <span>{{ form.dayRent }} 元/天</span>
        </el-form-item>
        <el-form-item label="月租费用: ">
          <span>{{ form.monthRent }} 元/月</span>
        </el-form-item>
        <el-form-item label="自行车描述: ">
          <span>{{ form.describ }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即下单</el-button>
          <el-button @click="notSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'bicycleRental',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      bicycleList: [],
      dialogVisible: false,
      form: ''
    }
  },
  created() {
    this.findBicycleList()
  },
  methods: {
    findBicycleList() {
      axios({
        url: 'http://localhost:9001/bicycle/findAll',
        method: 'GET'
      }).then(response => {
        if (response.data.code === 20000) {
          this.bicycleList = response.data.data
        } else {
          this.$message({
            message: '查询自行车失败!',
            type: 'error'
          })
        }
      })
    },
    detial(e) {
      // 获取当前点击自行车id
      var id = e.currentTarget.getAttribute('id')
      console.log(id)
      axios({
        url: 'http://localhost:9001/bicycle/findByCode',
        method: 'POST',
        data: {
          bicycleCode: id
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
    //下单按钮
    onSubmit() {
      //判断是否有未支付的订单若没有才可以下单
      axios({
        url: 'http://localhost:9001/order/findOrderNeedPay',
        method: 'GET',
        params: {
          username: this.name
        }
      }).then(response => {
        if (response.data.data === '') {
          // 将自行车编码通过路由方式传递到订单页
          this.$router.push({
            name:'orderIndex',
            path:'/userOrder/orderIndex',
            params:{form:this.form}
          })
        }else {
          this.$message({
            message: '您需要先支付!',
            type: 'error'
          });
          this.$router.push({
            name: 'payIndex',
            path: '/payIndex'
          })
        }
      })
    },
    // 取消按钮
    notSubmit() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

#app {
  margin: 0 auto;
  padding: 20px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  float: right;
}

.image {
  width: 100%;
  height: 250px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.span1 {
  display: block;
  font-size: 18px;
  padding: 10px;
  line-height: 20px;
  text-align: center;
}

.span2 {
  display: block;
  height: 25px;
  line-height: 25px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form span {
  font-size: 16px;
  color: #909399;
}
</style>
