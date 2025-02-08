import config from "@/config"

//系统路由
const routes = [
	{
		name: "layout",
		path: "/",
		component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
		redirect: config.DASHBOARD_URL || getBaseDashboard(),
		children: []
	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/:pathMatch(.*)*",
		hidden: true,
		component: () => import(/* webpackChunkName: "404" */ '@/layout/other/404'),
	},
	{
		path: "/user_register",
		component: () => import(/* webpackChunkName: "userRegister" */ '@/views/login/userRegister'),
		meta: {
			title: "注册"
		}
	},
	{
		path: "/reset_password",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/login/resetPassword'),
		meta: {
			title: "重置密码"
		}
	}
]
function getBaseDashboard() {
	let base_dashboard = this.$TOOL.data.get('BASE_INFO').base.base_dashboard;
	if (base_dashboard == null || base_dashboard == undefined) {
		base_dashboard = '/dashboard'
	}
	return base_dashboard
}
export default routes;
