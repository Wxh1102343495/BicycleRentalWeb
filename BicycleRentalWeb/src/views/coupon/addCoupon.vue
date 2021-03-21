<template>
  <div class="app">
    <h2>发放优惠券</h2>
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="优惠券名称">
        <el-input v-model="form.couponName"></el-input>
      </el-form-item>
      <el-form-item label="优惠券售价">
        <el-input type="number" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="优惠券折扣">
        <el-input-number v-model="form.discount" :precision="2" :step="0.1" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="优惠券描述">
        <el-input type="textarea" v-model="form.couponDescribe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="notSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'addCoupon',
  data() {
    return {
      // 表单
      form: {
        couponName: '',
        price: '',
        couponDescribe: '',
        discount: 0,
      }
    }
  },
  methods: {
    // 表单提交
    onSubmit() {
      axios({
        url: 'http://localhost:9001/coupon/addCoupon',
        method: 'POST',
        data: {
          couponName: this.form.couponName,
          price: this.form.price,
          couponDescribe: this.form.couponDescribe,
          discount: this.form.discount,
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.$message({
            message: '添加优惠券成功!',
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加优惠券失败!',
            type: 'error'
          })
        }
        this.init()
      })
    },
    //取消按钮
    notSubmit() {
      this.init()
    },
    //初始化
    init() {
      this.form.couponName = ''
      this.form.price = ''
      this.form.couponDescribe = ''
      this.form.discount = 0
    }
  }
}
</script>

<style scoped>

</style>
