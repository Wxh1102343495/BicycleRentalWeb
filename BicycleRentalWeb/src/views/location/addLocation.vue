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
import { regionData,CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      options: regionData,
      selectedOptions: [
        '110000',
        '110100',
        '110102'
      ]
    }
  },
  methods: {
    handleChange (value) {
      console.log(this.selectedOptions)
      console.log(value)
    },
    // 案例codeStr=‘110000,110100,110101’, codeArray=[110000,110100,110101]
    getCodeToText(codeStr, codeArray) {
      if (null === codeStr && null === codeArray) {
        return null;
      } else if (null === codeArray) {
        codeArray = codeStr.split(",");
      }

      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]];
          break;
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            "/" +
            CodeToText[codeArray[1]] +
            "/" +
            CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      return area;
    }
  }
}
</script>

<style>

</style>
