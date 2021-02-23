<template>
  <div class="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <vxe-table
        show-overflow
        height="200"
        row-id="id"
        ref="xTable"
        :loading="loading1"
        :data="tableData1">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="name" title="Name" sortable></vxe-table-column>
        <vxe-table-column field="sex" title="Sex"></vxe-table-column>
        <vxe-table-column field="age" title="Age"></vxe-table-column>
        <vxe-table-column field="rate" title="Rate"></vxe-table-column>
        <vxe-table-column title="操作" width="100" show-overflow>
          <template v-slot="{ row }">
            <vxe-button type="text" icon="el-icon-delete" @click="removeEvent(row)"></vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <vxe-pager
        :loading="loading1"
        :current-page="tablePage1.currentPage"
        :page-size="tablePage1.pageSize"
        :total="tablePage1.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange1">
      </vxe-pager>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "updateIdentity",
  data () {
    return {
      loading1: false,
      tableData1: [],
      tablePage1: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  },
  created () {
    this.findList1()
  },
  methods: {
    findList1 () {
      this.loading1 = true
      setTimeout(() => {
        this.loading1 = false
        this.tablePage1.totalResult = 6
        this.tableData1 = [
          { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
          { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
          { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
          { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
          { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai' },
          { id: 10006, name: 'Test6', nickname: 'T6', role: 'Develop', sex: '0', age: 27, address: 'Shanghai' }
        ]
      }, 300)
    },
    handlePageChange1 ({ currentPage, pageSize }) {
      this.tablePage1.currentPage = currentPage
      this.tablePage1.pageSize = pageSize
      this.findList1()
    },
    removeEvent (row) {
      this.$XModal.confirm('您确定要删除该数据?').then(type => {
        if (type === 'confirm') {
          this.$refs.xTable.remove(row)
        }
      })
    },
  }
}
</script>

<style scoped>

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.clearfix {
  color: #409EFF;
}

</style>
