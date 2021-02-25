<template>
  <div class="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <div style="margin: 10px 50px">
        <el-form class="form" ref="form" :rules="rules" :model="form" label-width="85px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" :key="passwordType" :type="passwordType" ref="password"/>
            <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
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
            <el-button type="primary" @click="onSubmit">立即注册</el-button>
            <el-button @click="onReturn">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
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
      form: {
        username: '',
        password: '',
        name: '',
        idNumber: '',
        phoneNumber: '',
        email: ''
      },
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    onSubmit() {

    }
    ,
    onReturn() {

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
