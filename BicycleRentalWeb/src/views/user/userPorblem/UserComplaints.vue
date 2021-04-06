<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>意见投诉</span>
    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="匿名投诉">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="投诉类型">
        <el-radio-group v-model="form.type">
          <el-radio label="1">自行车投诉建议</el-radio>
          <el-radio label="2">系统投诉建议</el-radio>
          <el-radio label="3">服务投诉建议</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="具体描述">
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'UserComplaints',
  // 获取登录信息中用户名
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      form: {
        delivery: '',
        type: '',
        describe: ''
      }
    }
  },
  methods: {
    onSubmit() {
      if(this.form.type !== "" && this.form.describe !== "") {
        axios({
          url: `http://localhost:9001/advise/addAdvise?username=${this.name}`,
          method: 'POST',
          data: {
            type: this.form.type,
            describe: this.form.describe,
          }
        }).then(response => {
          if (response.data.code === 20000) {
            this.$message({
              message: '上报成功!我们会尽快与您联系',
              type: 'success'
            })
          }
          this.init()
        })
      }else {
        this.$message({
          message: '必须填写相关信息',
          type: 'error'
        })
      }
    },
    init() {
      this.form.type = ''
      this.form.describe = ''
    }
  }
}
</script>

<style scoped>

</style>
