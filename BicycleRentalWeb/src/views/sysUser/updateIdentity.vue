<template>
  <div class="app">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>管理员列表</span>
      </div>
      <vxe-table
        show-overflow
        row-id="id"
        ref="xTable"
        :loading="loading"
        :data="tableData1"
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
        :current-page="tablePage1.currentPage"
        :page-size="tablePage1.pageSize"
        :total="tablePage1.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange1"
      >
      </vxe-pager>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
      </div>
      <vxe-table
        show-overflow
        row-id="id"
        ref="xTable"
        :loading="loading"
        :data="tableData2"
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
        :current-page="tablePage2.currentPage"
        :page-size="tablePage2.pageSize"
        :total="tablePage2.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange2"
      >
      </vxe-pager>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'updateIdentity',
  computed: {
    ...mapGetters([
      'name'
    ])
  },

  data() {
    return {
      // 表格加载
      loading: false,
      // 管理员表格数据
      tableData1: [],
      // 管理员表格分页
      tablePage1: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      },
      // 用户表格数据
      tableData2: [],
      // 用户表格分页
      tablePage2: {
        currentPage: 1,// 当前页
        pageSize: 5,// 每页条数
        totalResult: 0// 总数
      }
    }
  },
  created() {
    // 初始化 查询用户信息
    this.findSysUserList()
    this.findUseUserList()
  },
  methods: {
    // 查询管理员列表
    findSysUserList() {
      this.loading = true
      axios.get('http://localhost:9001/user/pageQueryUser', {
        params: {
          pageNo: this.tablePage1.currentPage,
          pageSize: this.tablePage1.pageSize,
          identity: 'sys'
        }
      }).then(response => {
        if (response.data.code === 20000) {
          // 将数据转换成想要的展示
          response.data.data.data.forEach(item => {
            item.identity = '系统管理员'
          })
          //将返回结果赋值给页面变量
          this.tableData1 = response.data.data.data
          this.tablePage1.totalResult = response.data.data.total
          this.loading = false
        } else {
          this.$message({
            message: '查询用户失败!',
            type: 'error'
          })
        }
      })
    },
    // 查询用户列表
    findUseUserList() {
      this.loading = true
      axios.get('http://localhost:9001/user/pageQueryUser', {
        params: {
          pageNo: this.tablePage2.currentPage,
          pageSize: this.tablePage2.pageSize,
          identity: 'user'
        }
      }).then(response => {
        if (response.data.code === 20000) {
          // 将数据转换成想要的展示
          response.data.data.data.forEach(item => {
            item.identity = '普通用户'
          })
          //将返回结果赋值给页面变量
          this.tableData2 = response.data.data.data
          this.tablePage2.totalResult = response.data.data.total
          this.loading = false
        } else {
          this.$message({
            message: '查询用户失败!',
            type: 'error'
          })
        }
      })
    },
    //管理员切换分页
    handlePageChange1({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage1.currentPage = currentPage
      this.tablePage1.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findSysUserList()
    },
    //用户切换分页
    handlePageChange2({ currentPage, pageSize }) {
      //将新的当前页及每页条数赋值给全局变量
      this.tablePage2.currentPage = currentPage
      this.tablePage2.pageSize = pageSize
      //调用函数根据新的分页数据再次查询api列表
      this.findUseUserList()
    },
    // 点击编辑按钮
    editIdentity(row) {
      // 不能修改admin的权限，用户名为wangxinhui的权限和自己的权限
      if (row.username === 'wangxinhui' || row.username === this.name) {
        this.$message({
          message: '没有权限修改',
          type: 'error'
        })
        return false;
      }
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
            if (response.data.code === 20000) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '更新失败',
                type: 'error'
              })
            }
            this.findUseUserList()
            this.findSysUserList()
          })
        }).catch(() => {
          return false
        })
      } else if (ident == '系统管理员') {
        this.$confirm('确定要将他的权限修改为普通用户么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            url: 'http://localhost:9001/user/updateIdentity',
            method: 'post',
            data: {
              id: row.id,
              identity: 'user'
            }
          }).then(response => {
            if (response.data.code === 20000) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '更新失败',
                type: 'error'
              })
            }
            this.findUseUserList()
            this.findSysUserList()
          })
        }).catch(() => {
          return false
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
  text-align: center;
  font-size: 22px;
}

</style>
