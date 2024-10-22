import config from "@/config"
import http from "@/utils/request"

export default {
	upload: {
		url: `${config.API_URL}/file/`,
		name: "文件上传",
		post: async function(data, config={}){
			return await http.post(this.url, data, config);
		}
	},
	uploadFile: {
		url: `${config.API_URL}/file/`,
		name: "附件上传",
		post: async function(data, config={}){
			return await http.post(this.url, data, config);
		}
	},
	file: {
		list: {
			url: `${config.API_URL}/file`,
			name: "获取文件列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
