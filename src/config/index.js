const DEFAULT_CONFIG = {
	//标题
	APP_NAME: process.env.VUE_APP_TITLE,

	//首页地址
	DASHBOARD_URL: "/dashboard",

	//版本号
	APP_VER: "2.3.0",

	//内核版本号
	CORE_VER: "1.6.9",

	//接口地址
	// API_URL: process.env.NODE_ENV === 'development' && process.env.VUE_APP_PROXY === 'false' ? "/api" : process.env.VUE_APP_API_BASEURL,
	API_URL: get_api_url(),

	//端口地址
	HOST_URL: get_host_url(),

	//请求超时
	TIMEOUT: 200000,

	//TokenName
	TOKEN_NAME: "Authorization",

	//Token前缀，注意最后有个空格，如不需要需设置空字符串
	TOKEN_PREFIX: "Bearer ",

	//追加其他头
	HEADERS: {},

	//请求是否开启缓存
	REQUEST_CACHE: false,

	//布局 默认：default | 通栏：header | 经典：menu | 功能坞：dock
	//dock将关闭标签和面包屑栏
	LAYOUT: 'header',

	//菜单是否折叠
	MENU_IS_COLLAPSE: false,

	//菜单是否启用手风琴效果
	MENU_UNIQUE_OPENED: true,

	//是否开启多标签
	LAYOUT_TAGS: false,

	//语言
	LANG: 'zh-cn',

	//主题颜色
	// COLOR: '#536DFE',//gx、gz、tkx
	COLOR: '#0052d9',//bx

	//是否加密localStorage, 为空不加密，可填写AES(模式ECB,移位Pkcs7)加密
	LS_ENCRYPTION: '',

	//localStorageAES加密秘钥，位数建议填写8的倍数
	LS_ENCRYPTION_key: '2XNN4K8LC0ELVWN4',

	//控制台首页默认布局
	DEFAULT_GRID: {
		//默认分栏数量和宽度 例如 [24] [18,6] [8,8,8] [6,12,6]
		layout: [24, 24, 24],
		//小组件分布，com取值:views/home/components 文件名
		copmsList: [
			['ticket'],
			// ['eventlist'],
			['about'],

		]
	}
}
function get_api_url(){
	if(process.env.NODE_ENV === 'development' || (process.env.NODE_ENV === 'production' && window.location.host.indexOf('localhost') > -1)){
		return process.env.VUE_APP_API_BASEURL
	}
	return 'http://' + window.location.host + '/api'
}

function get_host_url(){
	if(process.env.NODE_ENV === 'development'){
		return process.env.VUE_APP_BASEURL
	}
	return 'http://' + window.location.host
}
//合并业务配置
import MY_CONFIG from "./myConfig"
Object.assign(DEFAULT_CONFIG, MY_CONFIG)

// 如果生产模式，就合并动态的APP_CONFIG
// public/config.js
if (process.env.NODE_ENV === 'production') {
	Object.assign(DEFAULT_CONFIG, APP_CONFIG)
}

export default DEFAULT_CONFIG
