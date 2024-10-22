
<template>
  <el-container class="page-user">
    <el-aside style="width: 240px">
      <el-container>
        <el-header style="height: auto; display: block">
          <div class="user-info-top">
            <el-avatar
              :size="100"
              :src="form.base_logo"
              shape="square"
            ></el-avatar>
            <h3>{{ form.base_name }}</h3>
          </div>
        </el-header>
        <el-main class="nopadding">
          <el-menu class="menu" :default-active="page">
            <el-menu-item-group
              v-for="group in menu"
              :key="group.groupName"
              :title="group.groupName"
            >
              <el-menu-item
                v-for="item in group.list"
                :key="item.component"
                :index="item.component"
                @click="openPage"
              >
                <el-icon v-if="item.icon"
                  ><component :is="item.icon"
                /></el-icon>
                <template #title>
                  <span>{{ item.title }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <el-main>
      <Suspense>
        <template #default>
          <component :is="page" />
        </template>
        <template #fallback>
          <el-skeleton :rows="3" />
        </template>
      </Suspense>
    </el-main>
  </el-container>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "userCenter",
  components: {
    sysSet: defineAsyncComponent(() => import("./settings/sysSet.vue"))
  },
  data() {
    return {
      form: {},
      menu: [
        {
          groupName: "系统配置",
          list: [
            {
              icon: "el-icon-platform",
              title: "系统信息",
              component: "sysSet",
            },
          ],
        },
      ],
      userData: {},
      page: "sysSet",
    };
  },
  //路由跳转进来 判断from是否有特殊标识做特殊处理
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.is) {
        //删除特殊标识，防止标签刷新重复执行
        delete from.is;
        //执行特殊方法
        vm.$alert("路由跳转过来后含有特殊标识，做特殊处理", "提示", {
          type: "success",
          center: true,
        })
          .then(() => {})
          .catch(() => {});
      }
    });
  },
  mounted() {
    this.getSysConfig();
  },
  methods: {
    openPage(item) {
      this.page = item.index;
    },

    getSysConfig() {
      this.$API.system.config.getInfo.req().then(res=>{
        this.form = res.base
      })
    },
  },
};
</script>
<style scoped>
</style>
