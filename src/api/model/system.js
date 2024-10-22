import config from "@/config"
import http from "@/utils/request"

export default {
	myschedule: {
		list: {
			url: `${config.API_URL}/system/myschedule/`,
			name: "获取列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/myschedule/`,
			name: "新增",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		delete: {
			name: "删除",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/myschedule/${id}/`);
			}
		}
	},
	dept: {
		list: {
			url: `${config.API_URL}/system/dept/`,
			name: "获取部门列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/dept/`,
			name: "新增部门",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新部门信息",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/dept/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除部门",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/dept/${id}/`);
			}
		}
	},
	dicttype: {
		list: {
			url: `${config.API_URL}/system/dicttype/`,
			name: "获取字典类型列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/dicttype/`,
			name: "新增字典类型",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新字典类型",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/dicttype/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除字典类型",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/dicttype/${id}/`);
			}
		}
	},
	dict: {
		list: {
			url: `${config.API_URL}/system/dict/`,
			name: "获取字典列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/dict/`,
			name: "新增字典",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新字典",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/dict/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除字典",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/dict/${id}/`);
			}
		}
	},
	permission:{
		list: {
			url: `${config.API_URL}/system/permission/`,
			name: "获取菜单权限列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		codes: {
			url: `${config.API_URL}/system/permission/codes/`,
			name: "获取全部权限标识",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/permission/`,
			name: "新增菜单权限",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新菜单权限",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/permission/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除菜单权限",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/permission/${id}/`);
			}
		},
		deletes: {
			name: "批量删除菜单权限",
			url: `${config.API_URL}/system/permission/deletes/`,
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
	},
	role: {
		list: {
			url: `${config.API_URL}/system/role/`,
			name: "获取角色列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/role/`,
			name: "新增角色",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新角色",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/role/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除角色",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/role/${id}/`);
			}
		},
	},
	user: {
		list: {
			url: `${config.API_URL}/system/user/`,
			name: "获取用户列表",
			req: async function(params){
				return await http.get(this.url, params);
			}
		},
        read: {
			name: "用户详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/system/user/info/`);
			}
		},
		create: {
			url: `${config.API_URL}/system/user/`,
			name: "新增用户",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新用户",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/user/${id}/`,
					data
				);
			}
		},
		put:{
			url: `${config.API_URL}/system/user/password/`,
			name: "修改密码",
			req: async function(data){
				return await http.put(this.url,data);
			}
		},
		delete: {
			name: "删除用户",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/user/${id}/`);
			}
		},
		rPassword: {
			name: "重置密码",
			req: async function( id){
				return await http.post(`${config.API_URL}/system/user/${id}/reset_password/`);
			}
		}
	},
	post: {
		list: {
			url: `${config.API_URL}/system/post/`,
			name: "获取岗位列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/post/`,
			name: "新增岗位",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新岗位",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/post/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除岗位",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/post/${id}/`);
			}
		}
	},
	postrole: {
		list: {
			url: `${config.API_URL}/system/post_role/`,
			name: "获取岗位列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/post_role/`,
			name: "新增岗位",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		delete: {
			name: "删除岗位",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/post_role/${id}/`);
			}
		}
	},
	task: {
		list: {
			url: `${config.API_URL}/system/ptask/`,
			name: "定时任务列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		item: {
			name: "定时任务详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/system/ptask/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/system/ptask/`,
			name: "创建定时任务",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		update: {
			name: "更新定时任务",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/ptask/${id}/`,
					data
				);
			}
		},
		updateToggle: {
			name: "修改启用禁用状态",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/system/ptask/${id}/toggle/`,
					data
				);
			}
		},
		delete: {
			name: "删除定时任务",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/ptask/${id}/`);
			}
		},
		deletes: {
			url: `${config.API_URL}/system/ptask/deletes/`,
			name: "批量删除定时任务",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		runOnce: {
			name: "执行一次",
			req: async function(data, id){
				return await http.post(`${config.API_URL}/system/ptask/${id}/run_once/`,data);
			}
		},
		result: {
			url: `${config.API_URL}/system/ptask_result/`,
			name: "任务执行结果列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		resultItem: {
			name: "任务执行结果详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/system/ptask_result/${id}/`);
			}
		},
	},
	apk:{
		read: {
			url: `${config.API_URL}/system/apk/`,
			name: "apk信息",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/apk/`,
			name: "apk创建",
			req: async function(data){
				return await http.post(this.url, data);
			}
		}
	},
	userPost:{
		list: {
			url: `${config.API_URL}/system/user_post/`,
			name: "用户/岗位关系",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		create: {
			url: `${config.API_URL}/system/user_post/`,
			name: "新增用户/岗位关系",
			req: async function(data){
				return await http.post(this.url,data);
			}
		},
		delete: {
			name: "删除用户/岗位关系",
			req: async function(id){
				return await http.delete(`${config.API_URL}/system/user_post/${id}/`);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	config: {
		base: {
			url: `${config.API_URL}/system/base_config/`,
			name: "账户信息",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		getInfo: {
			url: `${config.API_URL}/system/config/`,
			name: "获取系统信息",
			req: async function(){
				return await http.get(this.url);
			}
		},
		updateInfo: {
			url: `${config.API_URL}/system/config/`,
			name: "更新系统信息",
			req: async function(data){
				return await http.put(this.url, data);
			}
		},
	}
}
