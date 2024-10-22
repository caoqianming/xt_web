import config from "@/config"
import http from "@/utils/request"

export default {
	logs: {
		list: {
			url: `${config.API_URL}/monitor/request_log/`,
			name: "请求日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		audit: {
			url: `${config.API_URL}/monitor/auditlog/`,
			name: "审计日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		}
	},
	dbbackup: {
		list: {
			url: `${config.API_URL}/monitor/dbbackup/`,
			name: "数据库备份",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		deletes: {
			url: `${config.API_URL}/monitor/dbbackup/`,
			name: "数据库备份",
			req: async function(data){
				return await http.delete(this.url, data);
			}
		}
	},
	file_logs: {
		list: {
			url: `${config.API_URL}/monitor/log/`,
			name: "文件日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		detail: {
			name: "文件日志",
			req: async function(name){
				return await http.get(`${config.API_URL}/monitor/log/${name}/`);
			}
		}
	},
	server: {
		info: {
			name: "服务器状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/monitor/server/`);
			}
		}
	},
	celery: {
		info: {
			name: "celery状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/monitor/celery/`);
			}
		}
	},
	redis: {
		info: {
			name: "redis状态",
			req: async function(name){
				return await http.get(`${config.API_URL}/monitor/redis/`);
			}
		}
	},
}
