<template>
  <div class="app">
    <h2>用户中心</h2>
    <vxe-table
      border
      ref="xTable"
      height="500"
      :filter-config="{showIcon: false}"
      :loading="loading"
      :data="tableData">
      <vxe-table-colgroup title="用户名">
        <vxe-table-column field="username" :filters="[{data: ''}]" :filter-method="usernameFilterMethod">
          <template v-slot:header="{ column }">
            <vxe-input type="text" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @change="filterEvent(option)" placeholder="请输入" clearable></vxe-input>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
      <vxe-table-colgroup title="姓名">
        <vxe-table-column field="name" :filters="[{data: ''}]" :filter-method="usernameFilterMethod">
          <template v-slot:header="{ column }">
            <vxe-input type="text" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @change="filterEvent(option)" placeholder="请输入" clearable></vxe-input>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
      <vxe-table-colgroup title="身份证号">
        <vxe-table-column field="idNumber" :filters="[{data: ''}]" :filter-method="usernameFilterMethod">
          <template v-slot:header="{ column }">
            <vxe-input type="text" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @change="filterEvent(option)" placeholder="请输入" clearable></vxe-input>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
      <vxe-table-colgroup title="电话号">
        <vxe-table-column field="phoneNumber" :filters="[{data: ''}]" :filter-method="usernameFilterMethod">
          <template v-slot:header="{ column }">
            <vxe-input type="text" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @change="filterEvent(option)" placeholder="请输入" clearable></vxe-input>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
      <vxe-table-colgroup title="电子邮箱">
        <vxe-table-column field="email" :filters="[{data: ''}]" :filter-method="usernameFilterMethod">
          <template v-slot:header="{ column }">
            <vxe-input type="text" v-for="(option, index) in column.filters" :key="index" v-model="option.data" @change="filterEvent(option)" placeholder="请输入" clearable></vxe-input>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
      <vxe-table-colgroup title="身份">
        <vxe-table-column field="identity" :filters="[{data: ''}]" :filter-method="customEqualFilterMethod" :formatter="formatterSex">
          <template v-slot:header="{ column }">
            <vxe-select v-for="(option, index) in column.filters" :key="index" v-model="option.data" :options="identityList" @change="filterEvent(option)" placeholder="请选择" clearable transfer></vxe-select>
          </template>
        </vxe-table-column>
      </vxe-table-colgroup>
    </vxe-table>
  </div>
</template>

<script>
import axios from 'axios'
import XEUtils from 'xe-utils'

export default {
  name: "queryUser",
  data () {
    return {
      loading: false,
      // 表格数据
      tableData: [],
      // 身份标识转化
      identityList: [
        { label: '管理员', value: 'sys' },
        { label: '普通用户', value: 'user' }
      ]
    }
  },
  created () {
    this.findList()
  },
  methods: {
    findList () {
      this.loading = true
      axios({
        url: 'http://localhost:9001/user/queryUser',
        method: 'GET',
      }).then(response => {
        if (response.data.code === 20000) {
          //将返回结果赋值给页面变量
          this.tableData = response.data.data
          this.loading = false
        } else {
          this.$message({
            message: '查询用户失败!',
            type: 'error'
          })
        }
      })
    },
    // 格式化显示内容(用于身份筛选)
    formatterSex ({ cellValue }) {
      const item = this.identityList.find(item => item.value === cellValue)
      return item ? item.label : ''
    },
    // 只对 filters 有效，列的筛选方法，该方法的返回值用来决定该行是否显示（用户名）
    usernameFilterMethod ({ option, row, column }) {
      if (option.data) {
        return XEUtils.toString(row[column.property]).toLowerCase().indexOf(option.data) > -1
      }
      return true
    },
    customEqualFilterMethod ({ option, row, column }) {
      if (option.data) {
        return row[column.property] === option.data
      }
      return true
    },
    // 在身份值发生改变时触发该事件
    filterEvent (option) {
      const xTable = this.$refs.xTable
      // 设置为选中状态
      option.checked = true
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xTable.updateData()
    }
  }
}
</script>

<style scoped>

</style>
