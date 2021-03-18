<template>
  <div>
    <h3>报废自行车回收</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
    >
      <vxe-table-column field="bicycleCode" title="自行车编码" width="150px"></vxe-table-column>
      <vxe-table-column title="所在停车点">
        <template #default="{ row }">
          <span>{{row.location.province+row.location.city+row.location.area+row.location.locationInfo}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="bicycleName" title="自行车名字" width="120px"></vxe-table-column>
      <vxe-table-column title="照片">
        <template #default="{ row }">
          <img :src="row.photo" style="display: block;width: 150px;height: 80px;">
        </template>
      </vxe-table-column>
      <vxe-table-column field="describ" title="自行车描述"></vxe-table-column>
      <vxe-table-column title="操作" width="100">
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
  name: 'removeBicycle',
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
    this.findUseBicycleList()
  },
  methods: {
    // 删除自行车
    removeEvent (row) {
      this.$confirm('确定要删除这辆自行车么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: 'http://localhost:9001/bicycle/removeBicycle',
          method: 'GET',
          params: {
            bicycleCode: row.bicycleCode
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
          this.findUseBicycleList()
        })
      }).catch(() => {
        return false
      })
    },
    // 查询自行车列表
    findUseBicycleList() {
      axios.get('http://localhost:9001/bicycle/pageQueryBicycle', {
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize,
        }
      }).then(response => {
        if (response.data.code === 20000) {
          //将返回结果赋值给页面变量
          this.tableData = response.data.data.data
          this.tablePage.totalResult = response.data.data.total
        } else {
          this.$message({
            message: '查询自行车信息失败!',
            type: 'error'
          })
        }
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
