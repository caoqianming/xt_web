<template>
	<div class="user-bar">
		<div class="screen panel-item hidden-sm-and-down" @click="screen">
			<el-icon>
				<el-icon-full-screen />
			</el-icon>
		</div>
		<!-- <div class="panel-item hidden-sm-and-down" @click="openBook">
      <el-icon>
        <el-icon-files />
      </el-icon>
    </div> -->
		<!-- <div class="msg panel-item" @click="showMsg">
      <el-badge :hidden="msgList.length == 0" :value="msgList.length" class="badge" type="danger">
        <el-icon>
          <el-icon-chat-dot-round />
        </el-icon>
      </el-badge>
      <el-drawer title="新消息" v-model="msg" style="width:400px !important" append-to-body destroy-on-close>
        <el-container>
          <el-main class="nopadding">
            <el-scrollbar>
              <ul class="msg-list">
                <li v-for="item in msgList" v-bind:key="item.id">
                  <div style="width: 100%; padding: 10px">
                    <div style="width: 35%; float: left">
                      <span style="color:red:float:left" v-for="items in item.event_.cates_" :key="items.id"
                        :label="items.name" :value="items.id">{{ items.name }}</span>
                    </div>
                    <div style="width: 32%; float: left">
                      <p>{{ item.event_.create_time }}</p>
                    </div>
                    <div style="width: 30%; float: right">
                      <el-button style="float: right" v-if="item.event_.handle_user == ''"
                        @click="createhandele(item.event_.id)">待处理</el-button>
                      <el-button style="float: right" v-else @click="handele(item.event_.id)">已处理</el-button>
                    </div>
                  </div>
                  <div style="width: 100%; padding: 10px">
                    <p>警报信息{{ item.event_.voice_msg }}</p>
                  </div>
                </li>
                <el-empty v-if="msgList.length == 0" description="暂无新消息" :image-size="100"></el-empty>
              </ul>
            </el-scrollbar>
          </el-main>
          <el-footer>
            <el-button type="primary" @click="goEvent">事件中心</el-button>
            
          </el-footer>
        </el-container>
      </el-drawer>
    </div> -->
		<!-- <el-button @click="markRead">全部设为已读</el-button> -->
		<div class="login_config">
			<el-button
				:icon="config.dark ? 'el-icon-sunny' : 'el-icon-moon'"
				circle
				type="info"
				@click="configDark"
			></el-button>
		</div>
		<el-dropdown
			class="user panel-item"
			trigger="click"
			@command="handleUser"
		>
			<div class="user-avatar">
				<el-avatar :size="34" shape="square">{{ userNameF }}</el-avatar>
				<label>{{ userName }}</label>
				<el-icon class="el-icon--right">
					<el-icon-arrow-down />
				</el-icon>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="uc">帐号信息</el-dropdown-item>
					<!-- <el-dropdown-item command="clearCache">清除缓存</el-dropdown-item> -->
					<el-dropdown-item divided command="outLogin"
						>退出登录</el-dropdown-item
					>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>

	<el-dialog
		v-model="searchVisible"
		:width="700"
		title="搜索"
		class="drawerBG"
		center
		destroy-on-close
	>
		<search @success="searchVisible = false"></search>
	</el-dialog>
</template>

<script>
import search from "./search.vue";

export default {
	components: {
		search,
	},
	data() {
		return {
			userName: "",
			userNameF: "",
			searchVisible: false,
			msg: false,
			msgList: {},
			config: {
				lang: this.$TOOL.data.get("APP_LANG") || this.$CONFIG.LANG,
				dark: this.$TOOL.data.get("APP_DARK") || false,
			},
		};
	},
	watch: {
		"config.dark"(val) {
			if (val) {
				document.documentElement.classList.add("dark");
				this.$TOOL.data.set("APP_DARK", val);
			} else {
				document.documentElement.classList.remove("dark");
				this.$TOOL.data.remove("APP_DARK");
			}
		},
	},
	created() {
		var userInfo = this.$TOOL.data.get("USER_INFO");
		this.userName = userInfo.username;
		this.userNameF = this.userName.substring(0, 1);
	},
	methods: {
		openBook() {
			window.open("/media/ehs_guide.pdf");
		},
		configDark() {
			this.config.dark = this.config.dark ? false : true;
		},
		getMyVents() {
			this.$API.ecm.myevent.list
				.req({ is_read: false, page: 0 })
				.then((res) => {
					this.msgList = res;
				});
		},
		goEvent() {
			this.$router.push({ name: "event" });
		},
		createhandele(id) {
			this.$router.push({
				name: "eventhandlefrom",
				query: {
					id: id,
				},
			});
			this.msg = false;
		},
		handele(id) {
			this.$router.push({
				name: "eventhandlefrom",
				query: {
					id: id,
				},
			});
			this.msg = false;
		},
		//个人信息
		handleUser(command) {
			if (command == "uc") {
				this.$router.push({ path: "/usercenter" });
			}
			if (command == "cmd") {
				this.$router.push({ path: "/cmd" });
			}
			if (command == "clearCache") {
				this.$confirm(
					"清除缓存会将系统初始化，包括登录状态、主题、语言设置等，是否继续？",
					"提示",
					{
						type: "info",
					}
				)
					.then(() => {
						const loading = this.$loading();
						this.$TOOL.data.clear();
						this.$router.replace({ path: "/login" });
						setTimeout(() => {
							loading.close();
							location.reload();
						}, 1000);
					})
					.catch(() => {
						//取消
					});
			}
			if (command == "outLogin") {
				this.$confirm("确认是否退出当前用户？", "提示", {
					type: "warning",
					confirmButtonText: "退出",
					confirmButtonClass: "el-button--danger",
				})
					.then(() => {
						this.$TOOL.data.remove("TOKEN");
						this.$router
							.push(`/login?redirect=${this.$route.fullPath}`)
							.then(() => {
								location.reload();
							});
					})
					.catch(() => {
						//取消退出
					});
			}
		},
		//全屏
		screen() {
			var element = document.documentElement;
			this.$TOOL.screen(element);
		},
		//显示短消息
		showMsg() {
			this.msg = true;
			this.getMyVents();
		},
		//标记已读
		markRead() {
			this.msgList = [];
		},
		//搜索
		search() {
			this.searchVisible = true;
		},
	},
};
</script>

<style scoped>
.user-bar {
	display: flex;
	align-items: center;
	height: 100%;
}

.user-bar .panel-item {
	padding: 0 10px;
	cursor: pointer;
	height: 100%;
	display: flex;
	align-items: center;
}

.user-bar .panel-item i {
	font-size: 16px;
}

.user-bar .panel-item:hover {
	background: rgba(0, 0, 0, 0.1);
}

.user-bar .user-avatar {
	height: 49px;
	display: flex;
	align-items: center;
}

.user-bar .user-avatar label {
	display: inline-block;
	margin-left: 5px;
	font-size: 14px;
	cursor: pointer;
}

.msg-list li {
	border-top: 1px solid #eee;
}

.msg-list li a {
	display: flex;
	padding: 20px;
}

.msg-list li a:hover {
	background: #ecf5ff;
}

.msg-list__icon {
	width: 40px;
	margin-right: 15px;
}

.msg-list__main {
	flex: 1;
}

.msg-list__main h2 {
	font-size: 15px;
	font-weight: normal;
	color: #333;
}

.msg-list__main p {
	font-size: 12px;
	color: #999;
	line-height: 1.8;
	margin-top: 5px;
}

.msg-list__time {
	width: 100px;
	text-align: right;
	color: #999;
}

.dark .msg-list__main h2 {
	color: #d0d0d0;
}

.dark .msg-list li {
	border-top: 1px solid #363636;
}

.dark .msg-list li a:hover {
	background: #383838;
}
</style>
