<template>
  <div class="app">
    <h2>故障信息填写</h2>
    <el-form ref="form" :model="form" label-width="90px">
      <span>提示：工作人员将在两个小时内主动联系您，若出现紧急情况，请您拨打我们的的热线电话，tel：18139608032</span>
      <span>提示：自行车编号在您自行车车牌上</span>
      <el-form-item label="自行车编号">
        <el-input type="text" v-model="form.bicycleId"></el-input>
      </el-form-item>
      <el-form-item label="故障照片">
        <el-upload
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :http-request="httpRequest1"
          :before-upload="beforeAvatarUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <img v-if="form.photoOne" :src="form.photoOne" class="avatar" style="display: block;width: 250px;height: 100px;">
        </el-upload>
      </el-form-item>
      <el-form-item label="故障照片">
        <el-upload
          class="upload-demo"
          action="#"
          :show-file-list="false"
          :http-request="httpRequest2"
          :before-upload="beforeAvatarUpload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <img v-if="form.photoTwo" :src="form.photoTwo" class="avatar" style="display: block;width: 250px;height: 100px;">
        </el-upload>
      </el-form-item>
      <el-form-item label="所在位置">
        <el-input type="textarea" v-model="form.location"></el-input>
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即上报</el-button>
        <el-button @click="notSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'bicycleError',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      // 表单
      form: {
        bicycleId: '',
        photoOne: '',
        photoTwo: '',
        describe: '',
        location: '',
      }
    }
  },
  methods: {
    //故障上报
    onSubmit() {
      if(this.form.location==='' || this.form.location==='' || this.form.photoOne==='' || this.form.photoTwo==='' || this.form.describe==='') {
        this.$message({
          showClose: true,
          message: '所有信息必须全部填写',
          type: 'error'
        });
      }else {
        axios({
          url: `http://localhost:9001/errorInfo/addErrorInfo?username=${this.name}`,
          method: 'POST',
          data: {
            bicycleId: this.form.bicycleId,
            photoOne: this.form.photoOne,
            photoTwo: this.form.photoTwo,
            describe: this.form.describe,
            location: this.form.location,
          }
        }).then(response => {
          if (response.data.code === 20000) {
            this.$message({
              message: '故障上报成功!',
              type: 'success'
            })
          } else {
            this.$message({
              message: '故障上报失败!',
              type: 'error'
            })
          }
          this.init()
        })
      }
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
    httpRequest1(data) {
      let that = this
      let rd = new FileReader() // 创建文件读取对象
      let file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function(e) {
        that.form.photoOne = this.result // this指向当前方法onloadend的作用域
      }
    },
    //自定义上传
    httpRequest2(data) {
      let that = this
      let rd = new FileReader() // 创建文件读取对象
      let file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function(e) {
        that.form.photoTwo = this.result // this指向当前方法onloadend的作用域
      }
    },
    //取消按钮
    notSubmit() {
      this.init()
    },
    //初始化
    init() {
      this.form.bicycleId = ''
      this.form.photoOne = ''
      this.form.photoTwo = ''
      this.form.describe = ''
      this.form.location = ''
    }
  }
}
</script>

<style scoped>
span {
  display: block;
  margin-bottom: 15px;
  margin-left: 100px;
  font-size: 12px;
  color: red;
}
</style>
