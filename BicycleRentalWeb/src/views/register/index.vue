<template>
  <div id="app">
    <div id="main">
      <h2>新用户注册</h2>
      <el-form class="form" ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="form.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" type="text"></el-input>
        </el-form-item>
        <el-form-item label="电话号" prop="phone">
          <el-input v-model="form.phone" type="number"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" type="email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    // 校验两次密码是否一致
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      form: {
        userName: '',
        password: '',
        name: '',
        idCard: '',
        phone: '',
        email: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        repassword: [
          {required: true, trigger: 'blur', validator: validatePass}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        idCard: [
          { required: true, message: '请填写证件号码', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }
        ],
        phone: [
          {required: true, trigger: 'blur', validator: checkPhone}
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

#app {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/login_image/login_bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}

#main {
  margin: 0 auto;
  width: 40%;
}

h2 {
  text-align: center;
  //color: #409EFF;
  margin-bottom: 10px;
}

.el-textarea__inner, .el-input__inner {
  background: transparent;
}

.el-form-item__label {
  color: #303133;
}
</style>
