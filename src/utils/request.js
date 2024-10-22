import axios from 'axios';
import { ElNotification, ElMessageBox } from 'element-plus';
import sysConfig from "@/config";
import tool from '@/utils/tool';
import router from '@/router';

axios.defaults.baseURL = sysConfig.API_URL;

axios.defaults.timeout = sysConfig.TIMEOUT;

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];
// HTTP request 拦截器
axios.interceptors.request.use(
	(config) => {
		let token = tool.data.get("TOKEN");
		if(token){
			config.headers[sysConfig.TOKEN_NAME] = sysConfig.TOKEN_PREFIX + token
		}
		if(!sysConfig.REQUEST_CACHE && config.method == 'get'){
			config.params = config.params || {};
			// config.params['_'] = new Date().getTime();
		}
		Object.assign(config.headers, sysConfig.HEADERS)
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//FIX 多个API同时401时疯狂弹窗BUG
let MessageBox_401_show = false

// HTTP response 拦截器
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			if (error.response.status == 401) {
				if(error.response.data.err_code == 'no_active_account'){
					ElNotification.warning({
						title: '请求失败',
						message: "账户密码错误或已禁用"
					});
				}else{
					if (error.config.url.indexOf('auth/token/refresh/') != -1) {
					    isRefreshing = false;
						requests=[];
						router.push('/login');
						return
					}
					if (!isRefreshing) {
						isRefreshing = true;
						axios({
							method: 'post',
							url: sysConfig.API_URL+'/auth/token/refresh/',
							headers: {
								Authorization: `Bearer ${tool.data.get("TOKEN")}`,
							},
							data:{refresh:tool.data.get("TOKEN_REFRESH")}
						}).then(res=>{
							// 替换本地的token
							tool.data.set("TOKEN", res.data.access);
							tool.data.set("TOKEN_TIME", new Date().getTime()); 
							error.config.headers[sysConfig.TOKEN_NAME] = sysConfig.TOKEN_PREFIX + res.data.access;
							isRefreshing = false;
							requests.forEach(cb => cb())
							//发起后将requests置空
							requests=[];
							return axios(error.config)
						})
					}else{
						//如果正在刷新token，将发起的请求暂存在requests中
						return new Promise((resolve)=>{
							requests.push(()=>{
								resolve(axios(error.config));
							})
						})
					}		
				}
				
			} else {
				if(error.response.data.err_msg=='人脸未匹配,请调整位置'){}else{
					ElNotification.warning({
						title: '请求失败',
						message: error.response.data.err_msg || `Status:${error.response.status}，未知错误！`
					});
				}
				
			}
		} else {
			ElNotification.error({
				title: '请求错误',
				message: "请求服务器无响应！"
			});
		}
		return Promise.reject(error.response);
	}
);

var http = {

	/** get 请求
	 * @param  {string} url 接口地址
	 * @param  {object} params 请求参数
	 * @param  {object} config 参数
	 */
	get: function(url, params={}, config={}) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: url,
				params: params,
				...config
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		})
	},

	/** post 请求
	 * @param  {string} url 接口地址
	 * @param  {object} data 请求参数
	 * @param  {object} config 参数
	 */
	post: function(url, data={}, config={}) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'post',
				url: url,
				data: data,
				...config
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		})
	},

	/** put 请求
	 * @param  {string} url 接口地址
	 * @param  {object} data 请求参数
	 * @param  {object} config 参数
	 */
	put: function(url, data={}, config={}) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'put',
				url: url,
				data: data,
				...config
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		})
	},

	/** patch 请求
	 * @param  {string} url 接口地址
	 * @param  {object} data 请求参数
	 * @param  {object} config 参数
	 */
	patch: function(url, data={}, config={}) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'patch',
				url: url,
				data: data,
				...config
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		})
	},

	/** delete 请求
	 * @param  {string} url 接口地址
	 * @param  {object} data 请求参数
	 * @param  {object} config 参数
	 */
	delete: function(url, data={}, config={}) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'delete',
				url: url,
				data: data,
				...config
			}).then((response) => {
				resolve(response.data);
			}).catch((error) => {
				reject(error);
			})
		})
	},

	/** jsonp 请求
	 * @param  {string} url 接口地址
	 * @param  {string} name JSONP回调函数名称
	 */
	jsonp: function(url, name='jsonp'){
		return new Promise((resolve) => {
			var script = document.createElement('script')
			var _id = `jsonp${Math.ceil(Math.random() * 1000000)}`
			script.id = _id
			script.type = 'text/javascript'
			script.src = url
			window[name] =(response) => {
				resolve(response)
				document.getElementsByTagName('head')[0].removeChild(script)
				try {
					delete window[name];
				}catch(e){
					window[name] = undefined;
				}
			}
			document.getElementsByTagName('head')[0].appendChild(script)
		})
	}
}

export default http;
