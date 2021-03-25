<template>
  <div class="app">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="地址选择">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          :clearable="true"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="具体位置信息">
        <el-input type="textarea" v-model="form.locationInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="notSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import axios from 'axios'

export default {
  data() {
    return {
      options: regionData,
      selectedOptions: [],
      form: {
        province: '',
        city: '',
        area: '',
        locationInfo: ''
      }
    }
  },
  methods: {
    handleChange(value) {
      this.getCodeToText(null, value)
    },
    // 案例codeStr=‘110000,110100,110101’, codeArray=[110000,110100,110101]
    // 将地区编码转为汉字
    getCodeToText(codeStr, codeArray) {
      if (null === codeStr && null === codeArray) {
        return null
      } else if (null === codeArray) {
        codeArray = codeStr.split(',')
      }
      let area = ''
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]]
          break
        case 2:
          area += CodeToText[codeArray[0]] + '/' + CodeToText[codeArray[1]]
          break
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            '/' +
            CodeToText[codeArray[1]] +
            '/' +
            CodeToText[codeArray[2]]
          this.form.province = CodeToText[codeArray[0]]
          this.form.city = CodeToText[codeArray[1]]
          this.form.area = CodeToText[codeArray[2]]
          break
        default:
          break
      }
      return area
    },
    onSubmit() {
      axios({
        url: 'http://localhost:9001/location/addLocation',
        method: 'POST',
        data:{
          province: this.form.province,
          city: this.form.city,
          area: this.form.area,
          locationInfo: this.form.locationInfo
        }
      }).then(response => {
        if(response.data.code === 20000) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
        this.notSubmit();
      })
    },
    // 取消按钮 清空所选值
    notSubmit () {
      this.selectedOptions = []
      this.form.locationInfo = ''
    }
  }
}
</script>

<style>

</style>
