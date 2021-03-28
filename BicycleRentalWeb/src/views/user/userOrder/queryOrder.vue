<template>
  <div>
    <h3>报废自行车回收</h3>
    <vxe-table
      :data="tableData"
      ref="xTable"
      border
    >
      <vxe-table-column title="所在停车点">
        <template #default="{ row }">
          <span>{{ row.location.province + row.location.city + row.location.area + row.location.locationInfo }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="bicycleName" title="自行车名字"></vxe-table-column>
      <vxe-table-column title="照片">
        <template #default="{ row }">
          <img :src="row.photo" style="display: block;width: 150px;height: 80px;">
        </template>
      </vxe-table-column>
      <vxe-table-column field="describ" title="自行车描述"></vxe-table-column>
      
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
export default {
  name: 'queryOrder'
}
</script>

<style scoped>

</style>
