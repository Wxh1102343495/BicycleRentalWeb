<template>
  <div>
    <h3>优惠券管理</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已发售的优惠券</span>
      </div>
      <div>
        <vxe-table
          :data="tableData1"
          ref="xTable1"
          border
        >
          <vxe-table-column field="couponName" title="优惠券名称"></vxe-table-column>
          <vxe-table-column field="price" title="价格"></vxe-table-column>
          <vxe-table-column field="discount" title="折扣"></vxe-table-column>
          <vxe-table-column field="couponDescribe" title="优惠券描述"></vxe-table-column>
          <vxe-table-column title="停售" width="80px">
            <template #default="{ row }">
              <vxe-button type="text" icon="el-icon-setting" @click="removeEvent(row)"></vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page="tablePage1.currentPage"
          :page-size="tablePage1.pageSize"
          :total="tablePage1.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange1"
        >
        </vxe-pager>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已停售的优惠券</span>
      </div>
      <div>
        <vxe-table
          :data="tableData2"
          ref="xTable2"
          border
          resizable
          keep-source
        >
          <vxe-table-column field="couponName" title="优惠券名称"></vxe-table-column>
          <vxe-table-column field="price" title="价格"></vxe-table-column>
          <vxe-table-column field="discount" title="折扣"></vxe-table-column>
          <vxe-table-column field="couponDescribe" title="优惠券描述"></vxe-table-column>
          <vxe-table-column title="发售" width="80px">
            <template #default="{ row }">
              <vxe-button type="text" icon="el-icon-setting" @click="removeEvent(row)"></vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page="tablePage2.currentPage"
          :page-size="tablePage2.pageSize"
          :total="tablePage2.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange2"
        >
        </vxe-pager>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'queryCoupon',
  data() {
    return {
      tableData1: [],
      tableData2: [],
      tablePage1: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      },
      tablePage2: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      }
    }
  },
  created() {
    // 初始化 查询自行车信息
    this.findCoupon(1)
    this.findCoupon(0)
  },
  methods: {
    //查询在售优惠券
    findCoupon(state) {
      var pageNo = ''
      var pageSize = ''
      if(state === 1) {
        pageNo = this.tablePage1.currentPage
        pageSize = this.tablePage1.pageSize
      }else {
        pageNo = this.tablePage2.currentPage
        pageSize = this.tablePage2.pageSize
      }
      axios({
        url: 'http://localhost:9001/coupon/findAllCoupon',
        method: 'GET',
        params: {
          state: state,
          pageNo: pageNo,
          pageSize: pageSize
        }
      }).then(response => {
        if (response.data.code === 20000) {
          if (state === 1) {
            this.tableData1 = response.data.data.data
            this.tablePage1.totalResult = response.data.data.total
          } else {
            this.tableData2 = response.data.data.data
            this.tablePage2.totalResult = response.data.data.total
          }
        } else {
          this.$message({
            message: '查询失败',
            type: 'error'
          })
        }
      })
    },
    // 两个编辑按钮
    removeEvent(row) {
      var state = ''
      if (row.state === 0) {
        state = 1
      } else {
        state = 0
      }
      this.$confirm('确定要更改么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: 'http://localhost:9001/coupon/updateCouponState',
          method: 'post',
          data: {
            couponId: row.couponId,
            state: state
          }
        }).then(response => {
          if (response.data.code === 20000) {
            this.$message({
              message: '成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '失败',
              type: 'error'
            })
          }
          this.findCoupon(1)
          this.findCoupon(0)
        })
      }).catch(() => {
        return false
      })
    },
    //切换分页
    handlePageChange1({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage1.currentPage = currentPage
      this.tablePage1.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findCoupon(1)
    },
    //切换分页
    handlePageChange2({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage2.currentPage = currentPage
      this.tablePage2.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findCoupon(0)
    }
  }
}
</script>

<style scoped>

</style>
