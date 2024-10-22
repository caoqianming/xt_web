import config from "@/config"
import http from "@/utils/request"

export default {
	token: {
		url: `${config.API_URL}/auth/token/`,
		name: "登录获取TOKEN",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	info: {
		url: `${config.API_URL}/system/user/info/`,
		name: "获取账户信息",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	},
	sms_code: {
		url: `${config.API_URL}/auth/sms_code/`,
		name: "获取验证码",
		req: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	login_sms_code: {
		url: `${config.API_URL}/auth/login_sms_code/`,
		name: "手机验证码登录",
		req: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	reset_password: {
		url: `${config.API_URL}/auth/reset_password/`,
		name: "重置密码",
		req: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	login_face: {
		url: `${config.API_URL}/auth/login_face/`,
		name: "人脸登录",
		req: async function(data={}){
			return await http.post(this.url, data);
		}
	},
}
