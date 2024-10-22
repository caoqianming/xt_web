<template>
  <el-card shadow="never" header="修改密码">
    <el-form
      ref="elForm" :model="formData" :rules="rules"
      label-width="100px"
     
      label-position="left"
      style="margin-top: 20px"
    >
     <el-form-item label="旧密码" prop="old_password">
    <el-input v-model="formData.old_password" placeholder="请输入旧密码" clearable show-password
      :style="{width: '100%'}"></el-input>
      <div class="el-form-item-msg">必须提供当前登录用户密码才能进行更改</div>
  </el-form-item>
  <el-form-item label="新密码" prop="new_password1">
    <el-input v-model="formData.new_password1" placeholder="请输入包含英文、数字、特殊符号（ @#$%^&+=! ）的8位以上密码" clearable show-password
      :style="{width: '100%'}"></el-input>
  </el-form-item>
  <el-form-item label="确认新密码" prop="new_password2">
    <el-input v-model="formData.new_password2" placeholder="请再次输入新密码" clearable show-password
      :style="{width: '100%'}"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button @click="resetForm">重置</el-button>
  </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
	import scPasswordStrength from '@/components/scPasswordStrength'
export default {
  components: {
			scPasswordStrength
		},
  data() {
    return {
      formData: {
          old_password: undefined,
        new_password1: undefined,
        new_password2: undefined,
      },
      rules: {
        old_password: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur",
          },
        ],
        new_password1: [
						{ required: true, message: '请输入新密码'},
						{validator: (rule, value, callback) => {
              let reg1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&.+=!])(?!.*\s).{8,}$/;
              if (reg1.test(value)) {
								callback();
							}else{	
                callback(new Error('请输入包含英文、数字、特殊符号（ @#$%^&+=! ）的8位以上密码'));
							}
						}}
					],
        new_password2: [
						{ required: true, message: '请再次输入新密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.formData.new_password1) {
								callback(new Error('两次输入密码不一致'));
							}else{
								callback();
							}
						}}
					],
      },
    };
  },
  mounted(){
				let reg1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&.+=!])(?!.*\s).{8,}$/;
        let str = 'a1aa.....'
  },
   methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
		
        this.$API.system.user.put.req(this.formData).then(async(res)=>{
            this.$message({
          message: '密码修改成功,请重新登陆',
          type: 'success'
        })
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login`)
        })
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
};
</script>

<style>
</style>
