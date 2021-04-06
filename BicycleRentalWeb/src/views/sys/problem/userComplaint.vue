<template>
  <div>
    <h3>投诉建议处理</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>未处理的投诉</span>
      </div>
      <div>
        <vxe-table
          :data="tableData1"
          ref="xTable1"
          :filter-config="{showIcon: false}"
          border
        >
          <vxe-table-column field="user.username" title="用户名"></vxe-table-column>
          <vxe-table-column field="user.phoneNumber" title="电话号"></vxe-table-column>
          <vxe-table-colgroup title="投诉类别">
            <vxe-table-column field="type" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterSex">
              <template #header="{ column }">
                <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="typeList" @change="filterEvent(option)" placeholder="请选择" clearable transfer></vxe-select>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column field="describe" title="具体描述"></vxe-table-column>
          <vxe-table-column title="已处理" width="80px">
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
        <span>已处理的投诉</span>
      </div>
      <div>
        <vxe-table
          :data="tableData2"
          ref="xTable2"
          border
          resizable
          keep-source
          :filter-config="{showIcon: false}"
        >
          <vxe-table-column field="user.username" title="用户名"></vxe-table-column>
          <vxe-table-column field="user.phoneNumber" title="电话号"></vxe-table-column>
          <vxe-table-colgroup title="投诉类别">
            <vxe-table-column field="type" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterSex">
              <template #header="{ column }">
                <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="typeList" @change="filterEvent2(option)" placeholder="请选择" clearable transfer></vxe-select>
              </template>
            </vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column field="describe" title="具体描述"></vxe-table-column>
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
  name: 'userComplaint',
  data() {
    return {
      tableData1: [],
      tableData2: [],
      //用于筛选表格
      typeList: [
        { label: '自行车类', value: '自行车类' },
        { label: '系统类', value: '系统类' },
        { label: '服务类', value: '服务类' }
      ],
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
    this.findAdvise(0)
    this.findAdvise(1)
  },
  methods: {
    //查询在售优惠券
    findAdvise(state) {
      var pageNo = ''
      var pageSize = ''
      if (state === 0) {
        pageNo = this.tablePage1.currentPage
        pageSize = this.tablePage1.pageSize
      } else {
        pageNo = this.tablePage2.currentPage
        pageSize = this.tablePage2.pageSize
      }
      axios({
        url: 'http://localhost:9001/advise/findByState',
        method: 'GET',
        params: {
          state: state,
          pageNo: pageNo,
          pageSize: pageSize
        }
      }).then(response => {
        if (response.data.code === 20000) {
          //处理显示数据
          response.data.data.data.forEach((item,index) => {
            if(item.type === 1) {
              item.type = '自行车类'
            }
            if(item.type === 2) {
              item.type = '系统类'
            }
            if(item.type === 3) {
              item.type = '服务类'
            }
          })
          if (state === 0) {
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
    removeEvent(row) {
      this.$confirm('确定要更改么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          url: 'http://localhost:9001/advise/updateState',
          method: 'post',
          data: {
            id: row.id
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
          this.findAdvise(1)
          this.findAdvise(0)
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
      this.findAdvise(0)
    },
    //切换分页
    handlePageChange2({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage2.currentPage = currentPage
      this.tablePage2.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findAdvise(1)
    },
    formatterSex ({ cellValue }) {
      const item = this.typeList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    filterEvent (option) {
      const xTable = this.$refs.xTable1
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    },
    customEqualFilterMethod ({ option, row, column }) {
      if (option.data) {
        return row[column.property] === option.data
      }
      return true
    },
    filterEvent2 (option) {
      const xTable = this.$refs.xTable2
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    },
  }
}
</script>

<style scoped>

</style>
