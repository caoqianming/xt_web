import config from "@/config"
import http from "@/utils/request"

export default {
	logs: {
		list: {
			url: `${config.API_URL}/ops/request_log/`,
			name: "请求日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
	},
	dbbackup: {
		list: {
			url: `${config.API_URL}/ops/dbbackup/`,
			name: "数据库备份",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		deletes: {
			url: `${config.API_URL}/ops/dbbackup/`,
			name: "数据库备份",
			req: async function(data){
				return await http.delete(this.url, data);
			}
		}
	},
	file_logs: {
		list: {
			url: `${config.API_URL}/ops/log/`,
			name: "文件日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		detail: {
			name: "文件日志",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/log/${name}/`);
			}
		}
	},
	server: {
		cpu: {
			name: "cpu状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/server/cpu/`);
			}
		},
		memory: {
			name: "memory状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/server/memory/`);
			}
		},
		disk: {
			name: "disk状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/server/disk/`);
			}
		}
	},
	celery: {
		info: {
			name: "celery状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/celery/`);
			}
		}
	},
	redis: {
		info: {
			name: "redis状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/ops/redis/`);
			}
		}
	},
}
