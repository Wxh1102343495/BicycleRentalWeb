<template>
  <div class="app">
    <el-cascader
      size="large"
      :options="options"
      v-model="selectedOptions"
      @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
import { regionData  } from 'element-china-area-data'
export default {
  data() {
    return {
      options: regionData,
      selectedOptions: []
    }
  },
  methods: {
    handleChange (value) {
      console.log(this.selectedOptions)
      console.log(value)
    },
  }
}
</script>

<style>

</style>
