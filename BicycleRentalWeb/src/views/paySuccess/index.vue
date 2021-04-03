<template>
  <div>
    <span>您已成功支付，请点击按钮跳转页面</span><br/>
    <el-button type="primary" @click="jumpDashboard">首页</el-button>
    <el-button type="primary" @click="jumpOrderEnd">历史订单</el-button>
  </div>
</template>

<script>
export default {
  name: 'index',
  methods: {
    jumpDashboard() {
      this.$router.push({
        name: 'Dashboard',
        path: '/dashboard'
      })
    },
    jumpOrderEnd() {
      this.$router.push({
        name: 'queryOrderEnd',
        path: '/userOrder/queryOrderEnd'
      })
    }
  },
}
</script>

<style scoped>
div{
  padding: 20px;
}
span {
  display: block;
  margin-bottom: 20px;
}
</style>
