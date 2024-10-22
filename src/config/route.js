// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
const routes = [
	//工作台
	{
		name: "workSpace",
		path: "/",
		meta: {
			title: "工作台",
			icon: "sc-icon-Gongzuotai",
			type: "menu",
			perms: ["home"],
		},
		children: [
			//首页
			{
				name: "home",
				path: "/",
				meta: {
					title: "首页",
					icon: "el-icon-home-filled",
					type: "menu",
					perms: ["home"],
				},
				children: [
					{
						name: "dashboard",
						path: "/dashboard",
						meta: {
							title: "控制台",
							affix: true,
							perms: ["dashboard"],
						},
						component: "home",
					},
					{
						name: "userCenter",
						path: "/usercenter",
						meta: {
							title: "帐号信息",
							// icon: "el-icon-user",
							perms: ["userCenter"],
						},
						component: "userCenter",
					},
				],
			},
			//审批
			{
				name: "wf",
				path: "/wf",
				meta: {
					title: "审批管理",
					icon: "sc-icon-Shenpi",
					type: "menu",
					perms: ["wf"],
				},
				children: [
					{
						name: "workflow",
						path: "/wf/workflow",
						meta: {
							title: "工作流",
							// icon: "el-icon-guide",
							perms: ["workflow"],
						},
						component: "wf/workflow",
					},
					{
						name: "configuration",
						path: "/wf/configuration",
						meta: {
							title: "工作流配置",
							// icon: "el-icon-menu",
							hidden: true,
							perms: ["workflow"],
						},
						component: "wf/configuration",
					},
					{
						name: "allwork",
						path: "/wf/allwork",
						meta: {
							title: "全部审批",
							// icon: "el-icon-folder",
							perms: ["allwork"],
						},
						component: "wf/allwork",
					},
					{
						name: "ownerwork",
						path: "/wf/ownerwork",
						meta: {
							title: "我创建的",
							// icon: "el-icon-folder-add",
							perms: ["ownerwork"],
						},
						component: "wf/ownerwork",
					},
					{
						name: "duty",
						path: "/wf/dutywork",
						meta: {
							title: "待办审批",
							// icon: "el-icon-folder-opened",
							perms: ["duty"],
						},
						component: "wf/dutywork",
					},
					{
						name: "worked",
						path: "/wf/worked",
						meta: {
							title: "我处理的",
							// icon: "el-icon-expand",
							perms: ["worked"],
						},
						component: "wf/worked",
					},
					{
						name: "ccwork",
						path: "/wf/ccwork",
						meta: {
							title: "抄送我的",
							// icon: "el-icon-edit-pen",
							perms: ["ccwork"],
						},
						component: "wf/ccwork",
					},
					{
						name: "ticketdetail",
						path: "/wf/ticketdetail",
						meta: {
							title: "工单详情",
							// icon: "el-icon-menu",
							hidden: true,
							perms: ["duty"],
						},
						component: "wf/ticketdetail",
					},
				],
			},
			//系统
			{
				name: "sys",
				path: "/sys",
				meta: {
					title: "系统",
					icon: "el-icon-tools",
					type: "menu",
					perms: ["sys"],
				},
				children: [
					{
						path: "/sys/user",
						name: "user",
						meta: {
							title: "账户管理",
							// icon: "el-icon-user",
							type: "menu",
							perms: ["user"],
						},
						component: "sys/user",
					},
					{
						path: "/sys/dept",
						name: "dept",
						meta: {
							title: "部门管理",
							// icon: "sc-icon-organization",
							type: "menu",
							perms: ["dept"],
						},
						component: "sys/dept",
					},
					{
						path: "/sys/post",
						name: "post",
						meta: {
							title: "岗位管理",
							// icon: "el-icon-postcard",
							type: "menu",
							perms: ["post"],
						},
						component: "sys/post",
					},
					{
						path: "/sys/role",
						name: "role",
						meta: {
							title: "角色管理",
							// icon: "el-icon-notebook",
							type: "menu",
							perms: ["role"],
						},
						component: "sys/role",
					},
					{
						path: "/sys/myschedule",
						name: "myschedule",
						meta: {
							title: "定时策略",
							type: "menu",
							perms: ["myschedule"],
						},
						component: "sys/myschedule"
					},
					{
						path: "/sys/dict",
						name: "dict",
						meta: {
							title: "字典管理",
							// icon: "el-icon-document",
							type: "menu",
							perms: ["dict"],
						},
						component: "sys/dict",
					},
					{
						path: "/sys/task",
						name: "task",
						meta: {
							title: "计划任务",
							// icon: "el-icon-alarm-clock",
							type: "menu",
							perms: ["task"],
						},
						component: "sys/task",
					},
				],
			},
		],
	},
	//运维
	{
		name: "ops",
		path: "/ops",
		meta: {
			title: "运维",
			icon: "el-icon-tools",
			type: "menu",
			perms: ["ops"],
		},
		children: [
			{
				name: "menu",
				path: "/ops/menu",
				meta: {
					title: "功能管理",
					icon: "el-icon-fold",
					perms: ["menu"],
				},
				component: "ops/menu",
			},
			{
				name: "log",
				path: "/ops/log",
				meta: {
					title: "请求日志",
					icon: "el-icon-document",
					perms: ["log"],
				},
				component: "ops/log_request",
			},
			{
				name: "thirdLogs",
				path: "/ops/thirdLogs",
				meta: {
					title: "第三方日志",
					icon: "el-icon-document",
					perms: ["third_log"],
				},
				component: "ops/thirdLogs",
			},
			{
				name: "fileLogs",
				path: "/ops/fileLogs",
				meta: {
					title: "文件日志",
					icon: "el-icon-document",
					perms: ["file_log"],
				},
				component: "ops/fileLogs",
			},
			{
				name: "server",
				path: "/ops/server",
				meta: {
					title: "服务器",
					icon: "el-icon-document",
					perms: ["ops"],
				},
				component: "ops/server",
			},
			{
				name: "setting",
				path: "/ops/setting",
				meta: {
					title: "配置",
					icon: "el-icon-document",
					perms: ["sysconfig"],
				},
				component: "ops/setting",
			},
		],
	},
];
export default routes;
