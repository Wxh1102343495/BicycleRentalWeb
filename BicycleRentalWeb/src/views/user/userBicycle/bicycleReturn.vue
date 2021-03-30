<template>
  <div>
    <span>点击跳转到您的订单页进行还车。。。</span>
    <el-button type="primary" @click="jumpOrderIng">跳转</el-button>
  </div>
</template>

<script>
export default {
  name: 'bicycleReturn',
  methods: {
    jumpOrderIng() {
      this.$router.push({
        name:'queryOrderIng',
        path:'/userOrder/queryOrderIng',
      })
    }
  }
}
</script>

<style scoped>

</style>
