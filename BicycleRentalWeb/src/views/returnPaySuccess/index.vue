<template>
  <div>
    <span>已成功退款，请点击按钮跳转页面</span><br/>
    <el-button type="primary" @click="jumpDashboard">首页</el-button>
    <el-button type="primary" @click="jumpOrderEnd">申请退款处理</el-button>
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
        name: 'needReturnPay',
        path: '/problem/needReturnPay'
      })
    }
  }
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
