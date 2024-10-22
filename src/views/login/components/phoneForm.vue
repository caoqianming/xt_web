<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="phone" style="margin-bottom: 25px;">
			<el-input v-model="form.phone" prefix-icon="el-icon-iphone" clearable
				:placeholder="$t('login.mobilePlaceholder')">
				<template #prepend>+86</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="code" style="margin-bottom: 20px;">
			<div class="login-msg-yzm">
				<el-input v-model="form.code" prefix-icon="el-icon-unlock" clearable
					:placeholder="$t('login.smsPlaceholder')"></el-input>
				<el-button @click="getYzm" :disabled="disabled">{{ this.$t('login.smsGet') }}<span v-if="disabled">
						({{ time }})</span></el-button>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" @click="login">{{ $t('login.signIn')
				}}</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			redirect: undefined,
			form: {
				phone: "",
				code: "",
			},
			rules: {
				phone: [
					{ required: true, message: this.$t('login.mobileError') },
					{
						validator: (rule, value, callback) => {
							let reg = /^1[3456789]\d{9}$/;
							if (reg.test(value)) {
								callback();
							} else {
								callback(new Error('请输入正确的手机号'));
							}
						}
					}

				],
				code: [
					{ required: true, message: "请输入验证码" }
				]
			},
			disabled: false,
			time: 0,
			islogin: false,
		}
	},
	mounted() {

	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true,
		},
	},
	methods: {
		async getYzm() {
			let that = this;
			var validate = await this.$refs.loginForm.validateField("phone").catch(() => { })
			if (!validate) { return false }
			this.$API.auth.sms_code.req({ phone: that.form.phone }).then(res => {
				this.$message.success(this.$t('login.smsSent'))
				this.disabled = true;
				this.time = 60
				var t = setInterval(() => {
					this.time -= 1
					if (this.time < 1) {
						clearInterval(t)
						this.disabled = false
						this.time = 0
					}
				}, 1000)
			}).catch(err => {
				this.disabled = false;
				this.$message.warning(err)
			})
		},
		async login() {
			let that = this;
			this.$refs.loginForm.validate(async (valid) => {
				if (valid) {
					this.$API.auth.login_sms_code.req(that.form).then(res => {
						that.$TOOL.data.set("TOKEN", res.access);
						that.$TOOL.data.set("TOKEN_REFRESH", res.refresh);
						that.$TOOL.data.set("TOKEN_TIME", new Date().getTime());
						that.$API.auth.info.get().then(res1 => {
							that.$TOOL.data.set("USER_INFO", res1);
							that.$TOOL.data.set("PERMISSIONS", Object.keys(res1.perms));
							let base_dashboard = this.$TOOL.data.get('BASE_INFO').base.base_dashboard;

							if (base_dashboard == null || base_dashboard == undefined || base_dashboard == '') {
								base_dashboard = '/dashboard'
							}
							this.$router.replace({
								path: base_dashboard,
							});
							
						})
					}).catch(err => {
						this.disabled = false;
						this.$message.warning(err)
					})
				}
			})
		}
	}
}
</script>

<style></style>
