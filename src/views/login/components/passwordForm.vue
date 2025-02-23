<template>
  <el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large">
    <el-form-item prop="user">
      <el-input v-model="form.user" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
        <!-- <template #append>
          <el-select v-model="userType" style="width: 130px">
            <el-option :label="$t('login.admin')" value="admin"></el-option>
            <el-option :label="$t('login.user')" value="user"></el-option>
          </el-select>
        </template> -->
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password
        :placeholder="$t('login.PWPlaceholder')" @keyup.enter="login"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 10px;">
      <el-col :span="12" class="login-reg">
        <!-- <el-link @click="visitors">{{$t('login.fangke')}}</el-link> -->
      </el-col>
      <el-col :span="12" class="login-forgot">
        <router-link to="/reset_password">{{ $t("login.forgetPassword") }}？</router-link>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" :loading="islogin" @click="login">{{ $t("login.signIn")
        }}</el-button>
    </el-form-item>

    <!--  <div class="login-reg">
      {{ $t("login.noAccount") }}
      <router-link to="/user_register">{{
        $t("login.createAccount")
      }}</router-link>
    </div>-->
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      redirect: undefined,
      userType: "admin",
      visitorsdialog: false,
      visitorform: {},
      form: {
        user: "admin",
        password: "admin",
        autologin: false,
      },
      rules: {
        user: [
          {
            required: true,
            message: this.$t("login.userError"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.PWError"),
            trigger: "blur",
          },
        ],
      },
      islogin: false,
    };
  },
  watch: {
    userType(val) {
      if (val == "admin") {
        this.form.user = "admin";
        this.form.password = "admin";
      } else if (val == "user") {
        this.form.user = "user";
        this.form.password = "user";
      }
    },
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() { },
  methods: {
    async login() {
      let that = this;
      var validate = await that.$refs.loginForm.validate().catch(() => { });
      if (!validate) {
        return false;
      }
      that.islogin = true;
      var data = {
        username: that.form.user,
        password: that.form.password,
      };
      //获取token
      try {
        var res = await that.$API.auth.token.post(data);
        that.$TOOL.data.set("TOKEN", res.access);
        that.$TOOL.data.set("TOKEN_REFRESH", res.refresh);
        that.$TOOL.data.set("TOKEN_TIME", new Date().getTime());
        try {
          var res1 = await that.$API.auth.info.get();
          that.$TOOL.data.set("USER_INFO", res1);
          that.$TOOL.data.set("PERMISSIONS", Object.keys(res1.perms));

          let base_dashboard = this.$TOOL.data.get('BASE_INFO').base.base_dashboard;
          // 去除重定向因客户不理解
          // if (this.redirect) {
          //   base_dashboard = this.redirect;
          // }
          // else 
          if (base_dashboard == null || base_dashboard == undefined || base_dashboard == '') {
            base_dashboard = '/dashboard'
          }
          if(this.$TOOL.data.get('BASE_INFO').base.base_menucate=='backend'){
            try{
              var res = await that.$API.system.user.routers.req({})
              this.$TOOL.data.set("MENU",res)
              console.log(res)
            } catch (err) {
            }
          }
   
            that.$router.replace({
              path: base_dashboard,
            });
          
          
        } catch (err) {
          that.islogin = false;
        }
      } catch (err) {
        that.islogin = false;
      } finally {
        that.islogin = false;
      }
    },
  },
};
</script>

<style></style>
