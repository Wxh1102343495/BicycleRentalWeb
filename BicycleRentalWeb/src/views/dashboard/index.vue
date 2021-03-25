<template>
  <div class="dashboard-container">
    <el-container>
      <el-header style="text-align: center; color: #409EFF; font-size: 28px;">Wxh_BicycleRental
      <span style="float: right;color:black;font-size: 12px;">欢迎{{name}}登录</span>
      </el-header>
      <el-main>
        <el-carousel :interval="4000" type="card" height="240px">
          <el-carousel-item v-for="item in imgList" :key="item.id">
            <img :src="item.idView" class="image" style="height: 240px;width: 100%">
          </el-carousel-item>
        </el-carousel>
      </el-main>
      <el-footer>
        <h3 style="color: #409EFF; text-align: center;">租赁步骤</h3>
        <el-steps :active="2" align-center>
          <el-step title="步骤1" description="在左侧菜单，自行车->租车界面中选择您喜欢的自行车，点击下单"></el-step>
          <el-step title="步骤2" description="选择一个您方便的时间和地点，我们会将车提前送到该地点，该时间就是您的租车时间"></el-step>
          <el-step title="步骤3" description="还车时将车停在运营服务区内任意停车点，若定位显示您不在运营区内那将收取额外费用"></el-step>
          <el-step title="步骤4" description="若骑行中出现故障，对订单有任何疑问，对系统有什么建议请在系统中联系我们"></el-step>
        </el-steps>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      imgList: [
        {id:0,idView:require("@/assets/bicycle_images/01.jpg")},
        {id:1,idView:require("@/assets/bicycle_images/02.jpg")},
        {id:2,idView:require("@/assets/bicycle_images/03.jpg")},
        {id:3,idView:require("@/assets/bicycle_images/b04.jpg")},
        {id:4,idView:require("@/assets/bicycle_images/b09.jpg")},
        {id:5,idView:require("@/assets/bicycle_images/b10.jpg")}
      ]
    };
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px 10px;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
