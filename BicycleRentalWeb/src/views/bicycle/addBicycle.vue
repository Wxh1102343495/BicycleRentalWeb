<template>
  <div class="app">
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="自行车名称">
        <el-input v-model="form.bicycleName"></el-input>
      </el-form-item>
<!--      <el-form-item label="所在停车点">-->
<!--        <div class="block">-->
<!--          <el-select v-model="form.location" placeholder="请选择停车点" :clearable="true">-->
<!--            <el-option-->
<!--              v-for="item in location"-->
<!--              :key="item.id"-->
<!--              :label="item.province + item.area + item.city + item.locationInfo"-->
<!--              :value="item.id"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
<!--      </el-form-item>-->
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
        <el-input type="textarea" v-model="form.describ"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="notSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'addBicycle',
  data() {
    return {
      // 表单
      form: {
        bicycleName: '',
        photo: '',
        describ: '',
        hourRent: 0,
        dayRent: 0,
        monthRent: 0
      }
    }
  },
  methods: {

    // 表单提交
    onSubmit() {
      axios({
        url: 'http://localhost:9001/bicycle/addBicycle',
        method: 'POST',
        data: {
          bicycleName: this.form.bicycleName,
          photo: this.form.photo,
          describ: this.form.describ,
          hourRent: this.form.hourRent,
          dayRent: this.form.dayRent,
          monthRent: this.form.monthRent
        }
      }).then(response => {
        if (response.data.code === 20000) {
          this.$message({
            message: '添加自行车成功!',
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加自行车失败!',
            type: 'error'
          })
        }
        this.init()
      })
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
    },
    //取消按钮
    notSubmit() {
      this.init()
    },
    //初始化
    init() {
      this.form.bicycleName = ''
      this.form.photo = ''
      this.form.describ = ''
      this.form.hourRent = 0
      this.form.dayRent = 0
      this.form.monthRent = 0
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
