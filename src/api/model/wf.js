import config from "@/config"
import http from "@/utils/request"

export default {
	workflow: {
		list: {
			url: `${config.API_URL}/wf/workflow/`,
			name: "工作流列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		item: {
			name: "工作流详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/workflow/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/wf/workflow/`,
			name: "新增工作流",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		update: {
			name: "更新工作流",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/wf/workflow/${id}/`,
					data
				);
			}
		},
		clone: {
			name: "克隆工作流",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/wf/workflow/${id}/clone/`,
					data
				);
			}
		},
		delete: {
			name: "删除工作流",
			req: async function(id){
				return await http.delete(`${config.API_URL}/wf/workflow/${id}/`);
			}
		},
		init: {
			name: "新建工单初始化",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/workflow/${id}/init/`);
			}
		},
		initkey: {
			name: "新建工单初始化",
			req: async function(key){
				return await http.get( `${config.API_URL}/wf/workflow/${key}/init_key/`);
			}
		},
		customfields: {
			name: "工作流下的自定义字段",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/workflow/${id}/customfields/`);
			}
		},
		states: {
			name: "工作流下的状态节点",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/workflow/${id}/states/`);
			}
		},
		transitions: {
			name: "工作流下的流转规则",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/workflow/${id}/transitions/`);
			}
		}
	},
	ticket: {
		list: {
			url: `${config.API_URL}/wf/ticket/`,
			name: "工单列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		ticketItem: {
			name: "工单详情",
			req: async function(id){
				return await http.get(`${config.API_URL}/wf/ticket/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/wf/ticket/`,
			name: "新增工单",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		destorys: {
			url: `${config.API_URL}/wf/ticket/destorys/`,
			name: "批量物理删除",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		ticketAccept: {
			name: "接单",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/accpet/`,data);
			}
		},
		addNodeEnd: {
			name: "加签完成",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/add_node_end/`,data);
			}
		},
		addNode: {
			name: "加签",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/add_node/`,data);
			}
		},
		ticketClose: {
			name: "关闭工单",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/close/`,data);
			}
		},
		ticketDeliver: {
			name: "转交工单",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/deliver/`,data);
			}
		},
		ticketHandle: {
			name: "处理工单",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/handle/`,data);
			}
		},
		ticketRetreat: {
			name: "撤回工单",
			req: async function(id,data){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/retreat/`,data);
			}
		},
		ticketFlowlogs: {
			name: "工单流转记录",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/ticket/${id}/flowlogs/`);
			}
		},
		ticketFlowSteps: {
			name: "工单流转step, 用于显示当前状态的step图(线性结构)",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/ticket/${id}/flowsteps/`);
			}
		},
		ticketTransitions: {
			name: "获取工单可执行的操作",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/ticket/${id}/transitions/`);
			}
		},
		dutyAgg: {
			url: `${config.API_URL}/wf/ticket/duty_agg/`,
			name: "待办审批聚合",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		ticketFlow: {
			url: `${config.API_URL}/wf/ticketflow/`,
			name: "工单日志",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		ticketFlowItem: {
			name: "获取工单可执行的操作",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/ticketflow/${id}/`);
			}
		},
		retryScript: {
			name: "重试脚本",
			req: async function(id){
				return await http.post(`${config.API_URL}/wf/ticket/${id}/retry_script/`);
			}
		},
	},
	field:{
		list: {
			url: `${config.API_URL}/wf/customfield/`,
			name: "字段列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		item: {
			name: "字段详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/customfield/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/wf/customfield/`,
			name: "新增字段",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		update: {
			name: "更新字段",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/wf/customfield/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除字段",
			req: async function(id){
				return await http.delete(`${config.API_URL}/wf/customfield/${id}/`);
			}
		}
	},
	state:{
		list: {
			url: `${config.API_URL}/wf/state/`,
			name: "状态列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		item: {
			name: "状态详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/state/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/wf/state/`,
			name: "新增状态",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		update: {
			name: "更新状态",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/wf/state/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除状态",
			req: async function(id){
				return await http.delete(`${config.API_URL}/wf/state/${id}/`);
			}
		}
	},
	transition:{
		list: {
			url: `${config.API_URL}/wf/transition/`,
			name: "流转列表",
			req: async function(data){
				return await http.get(this.url, data);
			}
		},
		item: {
			name: "流转详情",
			req: async function(id){
				return await http.get( `${config.API_URL}/wf/transition/${id}/`);
			}
		},
		create: {
			url: `${config.API_URL}/wf/transition/`,
			name: "新增流转",
			req: async function(data){
				return await http.post(this.url, data);
			}
		},
		update: {
			name: "更新流转",
			req: async function(id, data){
				return await http.put(
					`${config.API_URL}/wf/transition/${id}/`,
					data
				);
			}
		},
		delete: {
			name: "删除流转",
			req: async function(id){
				return await http.delete(`${config.API_URL}/wf/transition/${id}/`);
			}
		}
	}
}
