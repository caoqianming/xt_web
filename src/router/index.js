import { createRouter, createWebHashHistory } from 'vue-router';
import { ElNotification } from 'element-plus';
import config from "@/config"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import tool from '@/utils/tool';
import systemRouter from './systemRouter';
import userRoutes from '@/config/route';
import { beforeEach, afterEach } from './scrollBehavior';

//系统路由
const routes = systemRouter

//系统特殊路由
let routes_404_r = () => { }

const router = createRouter({
	history: createWebHashHistory(),
	routes: routes
})

//设置标题
document.title = config.APP_NAME

//判断是否已加载过动态/静态路由
var isGetRouter = false;

router.beforeEach(async (to, from, next) => {

	NProgress.start()
	//动态标题
	document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`

	let token = tool.data.get("TOKEN");
	//去往登录页
	if (to.path === "/login") {
		//删除路由(替换当前layout路由)
		// router.addRoute(routes[0])
		//删除路由(404)
		routes_404_r()
		isGetRouter = false;
		next();
		return false;
	}
	//目标路由等于当前路由
	if (routes.findIndex(r => r.path === to.path) >= 0) {
		next();
		return false;
	}
	//未登录
	if (!token) {
		next({
			path: '/login'
		});
		return false;
	}

	//整页路由处理
	if (to.meta.fullpage) {
		to.matched = [to.matched[to.matched.length - 1]]
	}
	//加载动态/静态路由
	if (!isGetRouter) {
		let userMenu = [];
		if(tool.data.get('BASE_INFO').base.base_menucate=='dynamic'){
			userMenu = tool.data.get("MENU") || [];	
		}else{
			let permissions = tool.data.get("PERMISSIONS") || [];//账号页面权限
			// console.log("permissions",permissions);
			userMenu = userRoutes;//静态路由
			userMenu = treeFilter(userRoutes, node => {
				return node.meta.perms ? node.meta.perms.filter(item => permissions.indexOf(item) > -1).length > 0 : true
			});
		}
		try {
			var menuRouter = filterAsyncRouter(userMenu);
			menuRouter = flatAsyncRoutes(menuRouter);
			menuRouter.forEach(item => {
				router.addRoute("layout", item)
			});
			routes_404_r = router.addRoute(routes_404);
			if (to.matched.length == 0) {
				router.push(to.fullPath);
			}
			isGetRouter = true;
		}catch (e) {
		    
		}
		
	}
	beforeEach(to, from)
	next();
});

router.afterEach((to, from) => {
	afterEach(to, from)
	NProgress.done()
});

router.onError((error) => {
	NProgress.done();
	ElNotification.error({
		title: '路由错误',
		message: error.message
	});
});

//入侵追加自定义方法、对象
router.sc_getMenu = () => {
	if(tool.data.get('BASE_INFO').base.base_menucate=='dynamic'){
		return tool.data.get("MENU") || []
	}
	else{
		let permissions = tool.data.get("PERMISSIONS") || [];
		let userMenu = treeFilter(userRoutes, node => {
			return node.meta.perms ? node.meta.perms.filter(item => permissions.indexOf(item) > -1).length > 0 : true
		});
		userMenu = checkRoute(userMenu, permissions)
		return userMenu
	}
}

//转换
function filterAsyncRouter(routerMap) {
	const accessedRouters = []
	routerMap.forEach(item => {
		item.meta = item.meta ? item.meta : {};
		//处理外部链接特殊路由
		if (item.meta.type == 'iframe') {
			item.meta.url = item.path;
			item.path = `/i/${item.name}`;
		}
		//MAP转路由对象
		var route = {
			path: item.path,
			name: item.name?item.name:'',
			meta: item.meta?item.meta:{},
			redirect: item.redirect,
			children: item.children ? filterAsyncRouter(item.children) : null,
			component: loadComponent(item.component)
		}
		accessedRouters.push(route)
	})
	return accessedRouters
}
function loadComponent(component) {
	if (component) {
		return () => import(/* webpackChunkName: "[request]" */ `@/views/${component}`)
	} else {
		return () => import(`@/layout/other/empty`)
	}

}

//路由扁平化
function flatAsyncRoutes(routes, breadcrumb = []) {
	let res = []
	routes.forEach(route => {
		const tmp = { ...route }
		if (tmp.children) {
			let childrenBreadcrumb = [...breadcrumb]
			childrenBreadcrumb.push(route)
			let tmpRoute = { ...route }
			tmpRoute.meta.breadcrumb = childrenBreadcrumb
			delete tmpRoute.children
			res.push(tmpRoute)
			let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
			childrenRoutes.map(item => {
				res.push(item)
			})
		} else {
			let tmpBreadcrumb = [...breadcrumb]
			tmpBreadcrumb.push(tmp)
			tmp.meta.breadcrumb = tmpBreadcrumb
			res.push(tmp)
		}
	})
	return res
}

//过滤树
function treeFilter(tree, func) {
	return tree.map(node => ({ ...node })).filter(node => {

		node.children = node.children && treeFilter(node.children, func)

		return func(node) || (node.children && node.children.length)
	})
}


function hasPerm(perms_need, perms_have) {
	let has = false
	for (var m = 0; m < perms_need.length; m++) {
		if (perms_have.indexOf(perms_need[m]) > -1) {
			has = true
		}
	}
	return has
}

function checkRoute(routes, perms) {
	if (perms.indexOf('superuser') > -1) {
		return routes
	}
	for (var i = 0; i < routes.length; i++) {
		if (routes[i].meta && routes[i].meta.perms) {
			let has = hasPerm(routes[i].meta.perms, perms)
			if (!has) {
				routes.splice(i, 1)
			}
			else if (routes[i].children) {
				for (var m = 0; m < routes[i].children.length; m++) {
					let child = routes[i].children[m]
					if (child.meta && child.meta.perms) {
						let has = hasPerm(child.meta.perms, perms)
						if (!has) {
							routes[i].children.splice(m, 1)
						}
					}
				}
			}
		}else{
				routes.splice(i, 1)
			}
	}
	return routes
}

export default router
