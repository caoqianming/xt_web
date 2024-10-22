<template>
	<div class="login_bg">
		<!-- <div class="right-con" :style="{backgroundImage: 'url(' + baseConfig.base_logo + ')'}"></div> -->
		<div class="login_adv"
			:style="{ 'background-image': baseConfig.base_logo_side == '' ? 'url(img/logo_side.png)' : 'url(' + baseConfig.base_logo_side + ')' }">
			<div class="login_adv__title">
				<h2 v-if="baseConfig.base_name">{{ baseConfig.base_name }}</h2>
			</div>
			<div class="login_adv__mask"></div>
			<!-- <div class="login_adv__bottom">
				© {{$CONFIG.APP_NAMES}} {{$CONFIG.APP_VER}}
			</div> -->
		</div>
		<div class="login_main">
			<div class="login_config">
				<el-button :icon="config.dark ? 'el-icon-sunny' : 'el-icon-moon'" circle type="info"
					@click="configDark"></el-button>

			</div>
			<div class="login-form">
				<div class="login-header">
					<div class="logo" v-if="baseConfig.name == 'photon'">
						<img id="photonImg" :alt="baseConfig.base_login" :src="baseConfig.base_login">
					</div>
					<div class="logo" v-else>
						<img :alt="baseConfig.base_name_short" :src="baseConfig.base_logo">
						<label>{{ baseConfig.base_name }}</label>
					</div>
				</div>
				<div>
					<el-segmented v-model="loginType" :options="loginTypeOptions" size="large">
						<template #default="{ item }">
							{{ item.label }}
						</template>
					</el-segmented>
					<div style="height: 20px"></div>
					<password-form v-if="loginType=='password'"></password-form>
					<phone-form v-if="loginType=='phone'"></phone-form>
				</div>
				<!-- <el-tabs>
					<el-tab-pane :label="$t('login.accountLogin')" lazy>
						<password-form></password-form>
					</el-tab-pane>
					<el-tab-pane :label="$t('login.mobileLogin')" lazy>
						<phone-form></phone-form>
					</el-tab-pane>

				</el-tabs> -->
				<!-- 微信登陆
				<el-divider>{{ $t('login.signInOther') }}</el-divider>
				<div class="login-oauth">
					<el-button type="success" icon="sc-icon-wechat" circle @click="wechatLogin"></el-button>
				</div>
				-->
			</div>
		</div>
	</div>
	<el-dialog v-model="showWechatLogin" :title="$t('login.wechatLoginTitle')" :width="400" destroy-on-close>
		<div class="qrCodeLogin">
			<sc-qr-code class="qrCode" :text="WechatLoginCode" :size="200"></sc-qr-code>
			<p class="msg">{{ $tc('login.wechatLoginMsg', 1) }}<br />{{ $tc('login.wechatLoginMsg', 2) }}</p>
			<div class="qrCodeLogin-result" v-if="isWechatLoginResult">
				<el-result icon="success" :title="$tc('login.wechatLoginResult', 1)"
					:sub-title="$tc('login.wechatLoginResult', 2)"></el-result>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import passwordForm from './components/passwordForm'
import phoneForm from './components/phoneForm'

export default {
	components: {
		passwordForm,
		phoneForm
	},
	data() {
		return {
			config: {
				lang: this.$TOOL.data.get('APP_LANG') || this.$CONFIG.LANG,
				dark: this.$TOOL.data.get('APP_DARK') || false
			},
			lang: [
				{
					name: '简体中文',
					value: 'zh-cn',
				},
				{
					name: 'English',
					value: 'en',
				}
			],
			baseConfig: {},
			limitedPhoto: false,
			WechatLoginCode: "",
			showWechatLogin: false,
			isWechatLoginResult: false,
			loginType:'password',
			loginTypeOptions: [
				{label: "账号登录", value: "password"},
			]
		}
	},
	watch: {
		'config.dark'(val) {
			if (val) {
				document.documentElement.classList.add("dark")
				this.$TOOL.data.set("APP_DARK", val)
			} else {
				document.documentElement.classList.remove("dark")
				this.$TOOL.data.remove("APP_DARK")
			}
		},
		'config.lang'(val) {
			this.$i18n.locale = val
			this.$TOOL.data.set("APP_LANG", val)
		}
	},
	created: function () {
		this.$TOOL.data.remove("TOKEN")
		this.$TOOL.data.remove("TOKEN_TIME")
		this.$TOOL.data.remove("TOKEN_REFRESH")
		this.$TOOL.data.remove("USER_INFO")
		this.$TOOL.data.remove("MENU")
		this.$TOOL.data.remove("PERMISSIONS")
		this.$TOOL.data.remove("DASHBOARDGRID")
		this.$TOOL.data.remove("grid")
		this.$store.commit("clearViewTags")
		this.$store.commit("clearKeepLive")
		this.$store.commit("clearIframeList")

		//console.log('%c SCUI %c Gitee: https://gitee.com/lolicode/scui', 'background:#666;color:#fff;border-radius:3px;', '')
	},
	mounted() {
		let url1 = window.location.href;
		this.project_code = url1.split('/')[3];
		this.getBaseInfo();
	},
	methods: {
		getBaseInfo() {
			let that = this;
			let req = {};
			if (that.project_code == undefined || that.project_code == '#') {
				if (process.env.NODE_ENV == 'development') {
					req.project_code = process.env.VUE_APP_PJ;
				}
			} else {
				req.project_code = that.project_code;
			}
			that.$API.system.config.base.req(req).then((res) => {
				that.baseConfig = res.base;
				if (that.baseConfig.base_right == undefined || that.baseConfig.base_right == null || that.baseConfig.base_right == "") {
					that.baseConfig.base_right = "HDRF";
				}
				if (that.baseConfig.base_login_phone == 1) {
					that.loginTypeOptions.push({label: "手机登录", value: "phone"})
				}
				that.$TOOL.data.set("BASE_INFO", res)
			})
		},
		configDark() {
			this.config.dark = this.config.dark ? false : true
		},
		configLang(command) {
			this.config.lang = command.value
		},
		wechatLogin() {
			this.showWechatLogin = true
			this.WechatLoginCode = "SCUI-823677237287236-" + new Date().getTime()
			this.isWechatLoginResult = false;
			setTimeout(() => {
				this.isWechatLoginResult = true
			}, 3000)
		}
	}
}
</script>

<style scoped>
.login_bg {
	width: 100%;
	height: 100%;
	background: #fff;
	display: flex;
}

.login_adv {
	width: 40%;
	background-color: #555;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	position: relative;
}

.login_adv__title {
	color: #fff;
	padding: 40px;
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	z-index: 2;
}

.login_adv__title h2 {
	font-size: 30px;
}

.login_adv__title h4 {
	font-size: 18px;
	margin-top: 10px;
	font-weight: normal;
}

.login_adv__title p {
	font-size: 14px;
	margin-top: 10px;
	line-height: 1.8;
	color: rgba(255, 255, 255, 0.6);
}

.login_adv__title div {
	margin-top: 10px;
	display: flex;
	align-items: center;
}

.login_adv__title div span {
	margin-right: 15px;
}

.login_adv__title div i {
	font-size: 40px;
}

.login_adv__title div i.add {
	font-size: 20px;
	color: rgba(255, 255, 255, 0.6);
}

.login_adv__bottom {
	position: absolute;
	left: 0px;
	right: 0px;
	bottom: 0px;
	color: #fff;
	padding: 40px;
	background-image: linear-gradient(transparent, #000);
	z-index: 3;
}

.login_adv__mask {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 1;
}

.login_main {
	flex: 1;
	overflow: auto;
	display: flex;
}

.login-form {
	width: 410px;
	margin: auto;
	padding: 20px 0;
}

.login-header {
	margin-bottom: 40px;
	width: 460px;
}

.login-header .logo {
	display: flex;
	align-items: center;
}

/* .login-header .logo img {width: 130px;vertical-align: bottom;margin-right: 10px;} */
.login-header .logo img {
	width: 60px;
	height: 60px;
	vertical-align: bottom;
	margin-right: 10px;
}

.login-header .logo label {
	font-size: 26px;
	font-weight: bold;
}

.login-oauth {
	display: flex;
	justify-content: space-around;
}

.login-form .el-divider {
	margin-top: 40px;
}

.login-form {}

.login-form:deep(.el-tabs) .el-tabs__header {
	margin-bottom: 25px;
}

.login-form:deep(.el-tabs) .el-tabs__header .el-tabs__item {
	font-size: 14px;
}

.login-form:deep(.login-forgot) {
	text-align: right;
}

.login-form:deep(.login-forgot) a {
	color: var(--el-color-primary);
}

.login-form:deep(.login-forgot) a:hover {
	color: var(--el-color-primary-light-3);
}

.login-form:deep(.login-reg) {
	font-size: 14px;
	color: var(--el-text-color-primary);
}

.login-form:deep(.login-reg) a {
	color: var(--el-color-primary);
}

.login-form:deep(.login-reg) a:hover {
	color: var(--el-color-primary-light-3);
}

.login_config {
	position: absolute;
	top: 20px;
	right: 20px;
}
.copyright {
	position: absolute;
	bottom: 30px;
	right: 30px;
	font-size: 16px;
	color: rgb(36, 93, 116);
}

.copyright a {
	color: #fff;
}

.copyright a:hover {
	color: #fff;
}

.login-form:deep(.login-msg) {
	display: flex;
	width: 100%;
}

.login-form:deep(.login-msg) .el-input {
	flex: 1;
}

.login-form:deep(.login-msg) .el-button {
	margin-left: 10px;
	--el-button-size: 42px;
}

.login-form:deep(.login-msg-yzm) {
	display: flex;
	width: 100%;
}

.login-form:deep(.login-msg-yzm) .el-button {
	margin-left: 10px;
	--el-button-size: 42px;
}

.qrCodeLogin {
	text-align: center;
	position: relative;
	padding: 20px 0;
}

.qrCodeLogin img.qrCode {
	background: #fff;
	padding: 20px;
	border-radius: 10px;
}

.qrCodeLogin p.msg {
	margin-top: 15px;
}

.qrCodeLogin .qrCodeLogin-result {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	text-align: center;
	background: var(--el-mask-color);
}

@media (max-width: 1200px) {
	.login-form {
		width: 340px;
	}
}

@media (max-width: 1000px) {
	.login_main {
		display: block;
	}

	.login_main .login_config {
		position: static;
		padding: 20px 20px 0 20px;
		text-align: right;
	}

	.login-form {
		width: 100%;
		padding: 20px 40px;
	}

	.login_adv {
		display: none;
	}
}

#loginFaceWrap {
	width: 664px !important;
}

.testTracking {
	width: 600px;
	height: 500px;
	margin-left: 20px;
}

#photonImg {
	width: 100%;
}
</style>
