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
        <h3 style="color: #409EFF; text-align: center;">租赁步骤</h3>
        <el-steps :active="2" align-center>
          <el-step title="步骤1" description="在左侧菜单，自行车->租车界面中选择您喜欢的自行车，点击下单"></el-step>
          <el-step title="步骤2" description="选择一个您方便的时间和地点，我们会将车提前送到该地点，该时间就是您的租车时间"></el-step>
          <el-step title="步骤3" description="还车时将车停在运营服务区内任意停车点，若定位显示您不在运营区内那将收取额外费用"></el-step>
          <el-step title="步骤4" description="若骑行中出现故障，对订单有任何疑问，对系统有什么建议请在系统中联系我们"></el-step>
        </el-steps>
        <h3 style="text-align: center;">在您使用前请仔细阅读下列规则！</h3>
        <h3 style="color: #409EFF; text-align: center; margin-top: 10px">收费规则</h3>
        <el-collapse accordion>
          <el-collapse-item title="提前还车">
            <div>按时租赁：提前还车不予退费</div>
            <div>按天租赁：提前还车不予退费</div>
            <div>按月租赁：提前还车，时间超过一天（≥24小时）按该车日租费用退费；不足24小时不予退费</div>
          </el-collapse-item>
          <el-collapse-item title="延期还车">
            <div>所有租赁方式：超时部分按时计费，不足一小时算计一小时</div>
            <div>备注：若延期超过5个工作日，我们会将您的信息上报公安机关依法处理</div>
          </el-collapse-item>
          <el-collapse-item title="遇故障">
            <div>人为故障：故障时间正常计费</div>
            <div>设备故障：故障时间不收取费用，还车后可在系统中申请退款</div>
          </el-collapse-item>
          <el-collapse-item title="超出运营区">
            <div>若根据定位显示，您还车地点超出运营区，则额外收取200元调度费</div>
          </el-collapse-item>
        </el-collapse>
        <h3 style="color: #409EFF; text-align: center; margin-top: 10px">其他规则</h3>
        <el-collapse>
          <el-collapse-item title="取消订单">
            <div>任何订单在距离预定时间前1个小时不允许取消</div>
          </el-collapse-item>
          <el-collapse-item title="还车地点">
            <div>运营服务区内，任何符合非机动车停车的区域均可还车</div>
            <div>若非法停车，造成任何后果，将由租赁人本人承担全部责任</div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer>
        <div style="color: #909399;font-size: 12px;margin-top: 20px">我们保证每辆车在您租赁前都将精心保养，服务至上！为您提供最优质的服务！</div>
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
    }
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
