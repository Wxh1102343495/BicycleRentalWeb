<template>
  <div class="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <vxe-table
        show-overflow
        row-id="id"
        ref="xTable"
        :loading="loading"
        :data="tableData"
      >
        <vxe-table-column field="username" title="用户名" sortable></vxe-table-column>
        <vxe-table-column field="name" title="姓名"></vxe-table-column>
        <vxe-table-column field="phoneNumber" title="电话号"></vxe-table-column>
        <vxe-table-column field="email" title="电子邮件"></vxe-table-column>
        <vxe-table-column field="identity" title="权限"></vxe-table-column>
        <vxe-table-column title="修改权限" width="100" show-overflow>
          <template v-slot="{ row }">
            <vxe-button type="text" icon="el-icon-edit-outline" @click="editIdentity(row)"></vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <vxe-pager
        :loading="loading"
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        :total="tablePage.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'updateIdentity',
  data() {
    return {
      // 表格加载
      loading: false,
      // 表格数据
      tableData: [],
      // 表格分页
      tablePage: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      }
    }
  },
  created() {
    // 初始化 查询用户信息
    this.findUserList()
  },
  methods: {
    // 分页查询用户列表
    findUserList() {
      this.loading = true
      axios.get('http://localhost:9001/user/pageQueryUser', {
        params: {
          pageNo: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }).then(response => {
        if (response.data.code === 20000) {
          // 将数据转换成想要的展示
          response.data.data.data.forEach(item => {
            if (item.identity == 'sys') {
              item.identity = '系统管理员'
            } else if (item.identity == 'user') {
              item.identity = '普通用户'
            }
          })
          //将返回结果赋值给页面变量
          this.tableData = response.data.data.data
          this.tablePage.totalResult = response.data.data.total
          this.loading = false
        } else {
          this.$message({
            message: '查询用户失败!',
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
      this.findUserList()
    },
    editIdentity(row) {
      console.log(row)
      var ident = row.identity
      if (ident == '普通用户') {
        this.$confirm('确定要将他的权限修改为管理员么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url: 'http://localhost:9001/user/updateIdentity',
            method: 'post',
            data: {
              id: row.id,
              identity: 'sys'
            }
          }).then(response => {
            console.log(response)
          })
        }).catch(() => {
          console.log('buquedinag')
        })
      } else if (ident == '系统管理员') {
        this.$confirm('确定要将他的权限修改为普通用户么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('quding')
        }).catch(() => {
          console.log('buquedinag')
        })
      }
    }
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
