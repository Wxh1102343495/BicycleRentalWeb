<template>
  <div class="app">
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="自行车名称">
        <el-input v-model="form.bicycleName"></el-input>
      </el-form-item>
      <el-form-item label="所在停车点">
        <el-select v-model="form.locationId" placeholder="请选择停车点">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自行车照片">
        <el-upload
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :http-request="httpRequest"
          :before-upload="beforeAvatarUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <img v-if="form.photo" :src="form.photo" class="avatar" style="display: block;width: 250px;height: 100px;">
        </el-upload>
      </el-form-item>
      <el-form-item label="时租费用">
        <el-input-number v-model="form.hourRent" :precision="2" :step="0.1" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="日租费用">
        <el-input-number v-model="form.dayRent" :precision="2" :step="0.1" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="月租费用">
        <el-input-number v-model="form.monthRent" :precision="2" :step="0.1" :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="自行车描述">
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addBicycle',
  data() {
    return {
      // 表单
      form: {
        bicycleName: '',
        locationId: '',
        photo: '',
        describe: '',
        hourRent: 0,
        dayRent: 0,
        monthRent: 0
      },
    }
  },
  methods: {
    // 表单提交
    onSubmit() {
      console.log('submit!')
      console.log(this.form.photo)
    },
    // 上传之前的格式设置
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //自定义上传
    httpRequest(data) {
      let that = this
      let rd = new FileReader() // 创建文件读取对象
      let file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function(e) {
        that.form.photo = this.result // this指向当前方法onloadend的作用域
      }
    }
  }
}
</script>

<style scoped>
.app {
  padding: 10px;
  margin: 10px;
}
</style>
