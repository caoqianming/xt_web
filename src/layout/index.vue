<template>
	<!-- 通栏布局 -->
	<template v-if="layout == 'header'">
		<header class="adminui-header">
			<div class="adminui-header-left">
				<div class="logo-bar">
					<!-- <span>{{ $CONFIG.APP_NAME }}</span> -->
					<img class="logo" :src="baseLogo" />
					<span>{{ baseName }}</span>
				</div>
				<ul v-if="!ismobile" class="nav">
					<li
						v-for="item in menu"
						:key="item"
						:class="pmenu.path == item.path ? 'active' : ''"
						@click="showMenu(item)"
					>
						<el-icon>
							<component :is="item.meta.icon || 'el-icon-menu'" />
						</el-icon>
						<span>{{ item.meta.title }}</span>
					</li>
				</ul>
			</div>
			<div class="adminui-header-right">
				<userbar></userbar>
			</div>
		</header>
		<section class="aminui-wrapper">
			<div
				v-if="(!ismobile && nextMenu.length > 0) || !pmenu.component"
				:class="
					menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'
				"
			>
				<div v-if="!menuIsCollapse" class="adminui-side-top">
					<h2>{{ pmenu.meta.title }}</h2>
				</div>
				<div class="adminui-side-scroll">
					<el-scrollbar>
						<el-menu
							:default-active="active"
							router
							:collapse="menuIsCollapse"
							:unique-opened="$CONFIG.MENU_UNIQUE_OPENED"
						>
							<NavMenu :navMenus="nextMenu"></NavMenu>
						</el-menu>
					</el-scrollbar>
				</div>
				<div
					class="adminui-side-bottom"
					@click="$store.commit('TOGGLE_menuIsCollapse')"
				>
					<el-icon
						><el-icon-expand v-if="menuIsCollapse" /><el-icon-fold
							v-else
					/></el-icon>
				</div>
			</div>
			<Side-m v-if="ismobile"></Side-m>
			<div class="aminui-body el-container">
				<Topbar v-if="!ismobile"></Topbar>
				<Tags v-if="!ismobile && layoutTags"></Tags>
				<div class="adminui-main" id="adminui-main">
					<router-view v-slot="{ Component }">
						<keep-alive
							:include="this.$store.state.keepAlive.keepLiveRoute"
						>
							<component
								:is="Component"
								:key="$route.fullPath"
								v-if="$store.state.keepAlive.routeShow"
							/>
						</keep-alive>
					</router-view>
					<iframe-view></iframe-view>
				</div>
			</div>
		</section>
	</template>

	<!-- 经典布局 -->
	<template v-else-if="layout == 'menu'">
		<header class="adminui-header">
			<div class="adminui-header-left">
				<div
					class="logo-bar"
					style="
						width: 202px;
						background: #ffffff;
						margin-right: 10px;
						border-radius: 5px;
					"
				>
					<img class="logo" :src="baseLogo" />
				</div>
				<div class="logo-bar">
					<span>{{ baseName }}</span>
				</div>
			</div>
			<div class="adminui-header-right">
				<userbar></userbar>
			</div>
		</header>
		<section class="aminui-wrapper">
			<div
				v-if="!ismobile"
				:class="
					menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'
				"
			>
				<div class="adminui-side-scroll">
					<el-scrollbar>
						<el-menu
							:default-active="active"
							router
							:collapse="menuIsCollapse"
							:unique-opened="$CONFIG.MENU_UNIQUE_OPENED"
						>
							<NavMenu :navMenus="menu"></NavMenu>
						</el-menu>
					</el-scrollbar>
				</div>
				<div
					class="adminui-side-bottom"
					@click="$store.commit('TOGGLE_menuIsCollapse')"
				>
					<el-icon
						><el-icon-expand v-if="menuIsCollapse" /><el-icon-fold
							v-else
					/></el-icon>
				</div>
			</div>
			<Side-m v-if="ismobile"></Side-m>
			<div class="aminui-body el-container">
				<Topbar v-if="!ismobile"></Topbar>
				<!-- <Tags v-if="!ismobile && layoutTags"></Tags> -->
				<div class="adminui-main" id="adminui-main">
					<router-view v-slot="{ Component }">
						<keep-alive
							:include="this.$store.state.keepAlive.keepLiveRoute"
						>
							<component
								:is="Component"
								:key="$route.fullPath"
								v-if="$store.state.keepAlive.routeShow"
							/>
						</keep-alive>
					</router-view>
					<iframe-view></iframe-view>
				</div>
			</div>
		</section>
	</template>

	<!-- 功能坞布局 -->
	<template v-else-if="layout == 'dock'">
		<header class="adminui-header">
			<div class="adminui-header-left">
				<div class="logo-bar">
					<span>{{ $CONFIG.APP_NAME }}</span>
				</div>
			</div>
			<div class="adminui-header-right">
				<div v-if="!ismobile" class="adminui-header-menu">
					<el-menu
						mode="horizontal"
						:default-active="active"
						router
						background-color="#222b45"
						text-color="#fff"
						active-text-color="var(--el-color-primary)"
					>
						<NavMenu :navMenus="menu"></NavMenu>
					</el-menu>
				</div>
				<Side-m v-if="ismobile"></Side-m>
				<userbar></userbar>
			</div>
		</header>
		<section class="aminui-wrapper">
			<div class="aminui-body el-container">
				<Tags v-if="!ismobile && layoutTags"></Tags>
				<div class="adminui-main" id="adminui-main">
					<router-view v-slot="{ Component }">
						<keep-alive
							:include="this.$store.state.keepAlive.keepLiveRoute"
						>
							<component
								:is="Component"
								:key="$route.fullPath"
								v-if="$store.state.keepAlive.routeShow"
							/>
						</keep-alive>
					</router-view>
					<iframe-view></iframe-view>
				</div>
			</div>
		</section>
	</template>

	<!-- 默认布局 -->
	<template v-else>
		<section class="aminui-wrapper">
			<div v-if="!ismobile" class="aminui-side-split">
				<div class="aminui-side-split-top">
					<router-link :to="$CONFIG.DASHBOARD_URL">
						<img
							class="logo"
							:title="$CONFIG.APP_NAME"
							src="img/logo-r.png"
						/>
					</router-link>
				</div>
				<div class="adminui-side-split-scroll">
					<el-scrollbar>
						<ul>
							<li
								v-for="item in menu"
								:key="item"
								:class="pmenu.path == item.path ? 'active' : ''"
								@click="showMenu(item)"
							>
								<el-icon>
									<component
										:is="item.meta.icon || el - icon - menu"
									/>
								</el-icon>
								<p>{{ item.meta.title }}</p>
							</li>
						</ul>
					</el-scrollbar>
				</div>
			</div>
			<div
				v-if="(!ismobile && nextMenu.length > 0) || !pmenu.component"
				:class="
					menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'
				"
			>
				<div v-if="!menuIsCollapse" class="adminui-side-top">
					<h2>{{ pmenu.meta.title }}</h2>
				</div>
				<div class="adminui-side-scroll">
					<el-scrollbar>
						<el-menu
							:default-active="active"
							router
							:collapse="menuIsCollapse"
							:unique-opened="$CONFIG.MENU_UNIQUE_OPENED"
						>
							<NavMenu :navMenus="nextMenu"></NavMenu>
						</el-menu>
					</el-scrollbar>
				</div>
				<div
					class="adminui-side-bottom"
					@click="$store.commit('TOGGLE_menuIsCollapse')"
				>
					<el-icon
						><el-icon-expand v-if="menuIsCollapse" /><el-icon-fold
							v-else
					/></el-icon>
				</div>
			</div>
			<Side-m v-if="ismobile"></Side-m>
			<div class="aminui-body el-container">
				<Topbar>
					<userbar></userbar>
				</Topbar>
				<Tags v-if="!ismobile && layoutTags"></Tags>
				<div class="adminui-main" id="adminui-main">
					<router-view v-slot="{ Component }">
						<keep-alive
							:include="this.$store.state.keepAlive.keepLiveRoute"
						>
							<component
								:is="Component"
								:key="$route.fullPath"
								v-if="$store.state.keepAlive.routeShow"
							/>
						</keep-alive>
					</router-view>
					<iframe-view></iframe-view>
				</div>
			</div>
		</section>
	</template>

	<div class="main-maximize-exit" @click="exitMaximize">
		<el-icon><el-icon-close /></el-icon>
	</div>

	<!-- <div class="layout-setting" @click="openSetting"><el-icon><el-icon-brush-filled /></el-icon></div> -->

	<el-drawer
		title="布局实时演示"
		v-model="settingDialog"
		:size="400"
		append-to-body
		destroy-on-close
	>
		<setting></setting>
	</el-drawer>

	<auto-exit></auto-exit>
</template>

<script>
import SideM from "./components/sideM.vue";
import Topbar from "./components/topbar.vue";
import Tags from "./components/tags.vue";
import NavMenu from "./components/NavMenu.vue"
import userbar from "./components/userbar.vue";
import setting from "./components/setting.vue";
import iframeView from "./components/iframeView.vue";
import autoExit from "./other/autoExit.js";
export default {
	name: "index",
	components: {
		SideM,
		Topbar,
		Tags,
		NavMenu,
		userbar,
		setting,
		iframeView,
		autoExit,
	},
	data() {
		return {
			settingDialog: false,
			menu: [],
			nextMenu: [],
			pmenu: {},
			active: "",
		};
	},
	computed: {
		baseName() {
			// let baseInFo = data[data.current];
			let baseName =
				this.$TOOL.data.get("BASE_INFO") !== null
					? this.$TOOL.data.get("BASE_INFO").base.base_name
					: "HDRF_ADMIN";
			// let baseName = baseInFo!==null?baseInFo.base.base_name:'智能管理平台';
			return baseName;
		},
		baseLogo() {
			// let baseInFo = data[data.current];
			let base_logo =
				this.$TOOL.data.get("BASE_INFO") !== null
					? this.$TOOL.data.get("BASE_INFO").base.base_logo_i
					: "img/logo.png";
			// let base_logo = baseInFo!==null?baseInFo.base.base_logo:'img/logo.png';
			return base_logo;
		},
		ismobile() {
			return this.$store.state.global.ismobile;
		},
		layout() {
			return this.$store.state.global.layout;
		},
		layoutTags() {
			return this.$store.state.global.layoutTags;
		},
		menuIsCollapse() {
			return this.$store.state.global.menuIsCollapse;
		},
	},
	created() {
		document.title = this.$store.state.global.baseName;
		this.onLayoutResize();
		window.addEventListener("resize", this.onLayoutResize);
		var menu = this.$router.sc_getMenu();
		// console.log("menu", menu);
		this.menu = this.filterUrl(menu);
		// console.log("this.menu", this.menu);
		this.showThis();
	},
	watch: {
		$route() {
			this.showThis();
		},
		layout: {
			handler(val) {
				document.body.setAttribute("data-layout", val);
			},
			immediate: true,
		},
	},
	methods: {
		openSetting() {
			this.settingDialog = true;
		},
		onLayoutResize() {
			this.$store.commit("SET_ismobile", document.body.clientWidth < 992);
		},
		//路由监听高亮
		showThis() {
			function hasPerm(perms_need, perms_have) {
				let has = false;
				for (var m = 0; m < perms_need.length; m++) {
					if (perms_have.indexOf(perms_need[m]) > -1) {
						has = true;
					}
				}
				return has;
			}
			this.pmenu = this.$route.meta.breadcrumb
				? this.$route.meta.breadcrumb[0]
				: {};
			let lists = this.pmenu.children;
			let perms = this.$TOOL.data.get("PERMISSIONS") || [];
			for (var i = 0; i < lists.length; i++) {
				if (lists[i].meta && lists[i].meta.perms) {
					let has = hasPerm(lists[i].meta.perms, perms);
					if (!has) {
						lists.splice(i, 1);
					}
				}
			}
			// console.log("this.pmenu.children", this.pmenu.children);
			this.nextMenu = this.filterUrl(this.pmenu.children);
			this.$nextTick(() => {
				this.active = this.$route.meta.active || this.$route.fullPath;
			});
		},
		//点击显示
		showMenu(route) {
			this.pmenu = route;
			this.nextMenu = this.filterUrl(route.children);
			if (
				(!route.children || route.children.length == 0) &&
				route.component
			) {
				this.$router.push({ path: route.path });
			}
		},
		//转换外部链接的路由
		filterUrl(map) {
			var newMap = [];
			map &&
				map.forEach((item) => {
					item.meta = item.meta ? item.meta : {};
					//处理隐藏
					if (item.meta.hidden || item.meta.type == "button") {
						return false;
					}
					//处理http
					if (item.meta.type == "iframe") {
						item.path = `/i/${item.name}`;
					}
					//递归循环
					if (item.children && item.children.length > 0) {
						item.children = this.filterUrl(item.children);
					}
					newMap.push(item);
				});
			return newMap;
		},
		//退出最大化
		exitMaximize() {
			document.getElementById("app").classList.remove("main-maximize");
		},
	},
};
</script>
