<template>
  <div class="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ form.username }}</span>
      </div>
      <div style="margin: 10px 50px">
        <el-form class="form" ref="form" :rules="rules" :model="form" label-width="85px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" :key="passwordType" :type="passwordType" ref="password" :show-password="true"/>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="form.idNumber" type="text"></el-input>
          </el-form-item>
          <el-form-item label="电话号" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" type="number"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" type="email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存修改</el-button>
            <el-button @click="onReturn">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created () {
    this.findList()
  },
  data() {
    // 校验手机号
    const checkPhone = (rule, value, callback) => {
      const reg = /^1[345789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      form: {},
      uname: '',
      pwd: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请填写证件号码', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          { required: true, trigger: 'blur', validator: checkPhone }
        ]
      }
    }
  },
  methods: {
    // 初始化查询用户信息
    findList() {
      axios({
        url: 'http://localhost:9001/user/queryUserByUserName',
        method: 'GET',
        params: {
          username : this.name
        }
      }).then(response => {
        if (response.data.code === 20000) {
          // 一份数据存于data用于页面展示
          this.form = response.data.data
          // 一部分数存于session用于对比数据是否发生变化
          sessionStorage.setItem("initForm",JSON.stringify(response.data.data))
          //存起来判断用户名和密码是否改变
          this.uname = response.data.data.username
          this.pwd = response.data.data.password
        } else {
          this.$message({
            message: '查询用户失败!',
            type: 'error'
          })
        }
      })
    },
    //保存提交按钮
    onSubmit() {
      // 判断form表单得值是否发生变化
      if(JSON.stringify(this.form) == sessionStorage.getItem("initForm")){
        this.$message({
          message: '没有做任何修改，请修改后提交',
          type: 'error'
        })
      }else{
        //判断用户名或者密码是否有改动
        if(this.uname != this.form.username || this.pwd != this.form.password) {
          axios({
            url: 'http://localhost:9001/user/updateUser',
            method: 'POST',
            data: this.form
          }).then(response => {
            if (response.data.code === 20000) {
              this.$message({
                message: '更新成功!',
                type: 'success'
              })
              this.$store.dispatch('user/resetToken')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            } else {
              this.$message({
                message: '保存失败!',
                type: 'error'
              })
            }
          })
        } else {
          axios({
            url: 'http://localhost:9001/user/updateUser',
            method: 'POST',
            data: this.form
          }).then(response => {
            if (response.data.code === 20000) {
              this.$message({
                message: '更新成功!',
                type: 'success'
              })
              this.$router.push({
                name: 'Dashboard',
                path: '/dashboard'
              })
            } else {
              this.$message({
                message: '保存失败!',
                type: 'error'
              })
            }
          })
        }
      }
    },
    onReturn() {
      this.$message({
        message: '没有做任何修改',
        type: 'error'
      })
      this.$router.replace({path: '/'})
    }
  }
}
</script>

<style>
.el-input {
  display: inline-block;
  height: 47px;
  width: 85%;
}

.el-form-item__label {
  color: #303133;
}

.show-pwd {
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

</style>
