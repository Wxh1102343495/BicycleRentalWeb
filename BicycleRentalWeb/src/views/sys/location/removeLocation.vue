<template>
  <div>
    <h3>租赁地点管理</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
      resizable
      keep-source
      :edit-config="{trigger: 'manual', mode: 'row'}"
    >
      <vxe-table-column field="province" title="所在省份"></vxe-table-column>
      <vxe-table-column field="city" title="所在市"></vxe-table-column>
      <vxe-table-column field="area" title="所在区"></vxe-table-column>
      <vxe-table-column field="locationInfo" title="具体位置信息" :edit-render="{name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
      <vxe-table-column title="删除">
        <template #default="{ row }">
          <vxe-button type="text" icon="el-icon-delete" @click="removeEvent(row)"></vxe-button>
        </template>
      </vxe-table-column>
      <vxe-table-column title="编辑" width="160">
        <template #default="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
          </template>
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
        pageSize: 5,// 每页条数
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
        method: 'GET',
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize,
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.tableData = response.data.data.data
          this.tablePage.totalResult = response.data.data.total
        } else {
          this.$message({
            message: '查询失败!',
            type: 'error'
          })
        }
      })
    },
    // 删除地址
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
    //编辑地址
    editRowEvent(row){
      this.$refs.xTable.setActiveRow(row)
    },
    //保存按钮
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        console.log()
        axios({
          url: 'http://localhost:9001/location/updateLocation',
          method: 'POST',
          data: {
            id: row.id,
            locationInfo: row.locationInfo
          }
        }).then(response => {
          if (response.data.code === 20000) {
            this.$message({
              message: '更新成功!',
              type: 'success'
            })
          } else {
            this.$message({
              message: '更新失败!',
              type: 'error'
            })
          }
          this.findLocation()
        })
      })
    },
    //取消按钮
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    //切换分页
    handlePageChange({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findLocation()
    },
  }
}
</script>

<style scoped>

</style>
