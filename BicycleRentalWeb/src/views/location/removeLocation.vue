<template>
  <div>
    <h3>报废自行车回收</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
    >
      <vxe-table-column field="province" title="所在省份"></vxe-table-column>
      <vxe-table-column field="city" title="所在市"></vxe-table-column>
      <vxe-table-column field="area" title="所在区"></vxe-table-column>
      <vxe-table-column field="locationInfo" title="具体位置信息"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <vxe-button type="text" icon="el-icon-delete" @click="removeEvent(row)"></vxe-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'removeLocation',
  data() {
    return {
      tableData: [],
      tablePage: {
        currentPage: 1,// 当前页
        pageSize: 4,// 每页条数
        totalResult: 0// 总数
      }
    }
  },
  created() {
    // 初始化 查询自行车信息
    this.findLocation()
  },
  methods: {
    //查询地址信息
    findLocation() {
      axios({
        url: 'http://localhost:9001/location/queryLocation',
        method: 'GET'
      }).then(response => {
        if (response.data.code === 20000) {
          this.tableData = response.data.data
        } else {
          this.$message({
            message: '查询失败!',
            type: 'error'
          })
        }
      })
    },
    // 删除自行车
    removeEvent(row) {
      this.$confirm('确定要删除该地址么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: 'http://localhost:9001/location/removeLocation',
          method: 'GET',
          params: {
            id: row.id
          }
        }).then(response => {
          if (response.data.code === 20000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
          this.findLocation()
        })
      }).catch(() => {
        return false
      })
    },
    //切换分页
    handlePageChange({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findUseBicycleList()
    },
  }
}
</script>

<style scoped>

</style>
