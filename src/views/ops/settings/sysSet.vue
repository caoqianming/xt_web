<template>
  <el-card shadow="never" header="系统信息">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      style="margin-top: 20px"
    >
    <el-row>
      <el-col>
        <el-form-item label="系统名称">
          <el-input v-model="form.base_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="系统简称">
          <el-input v-model="form.base_name_short"></el-input>
        </el-form-item>
      </el-col>
        <el-col :md="12" :sm="24">
          <el-form-item label="系统logo">
            <sc-upload v-model="form.base_logo"  :modelValue="form.base_logo" title="系统logo" ></sc-upload>
          </el-form-item>
        </el-col>
        <el-col :md="12" :sm="24">
          <el-form-item label="登录背景图">
            <sc-upload v-model="form.base_logo_side" :modelValue="form.base_logo_side" title="登录背景图"></sc-upload>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item style="float:right">
            <el-button type="primary" @click="submitForm" :loading="saveLoading">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      saveLoading:false,
      form: {
        base_logo: "/media/default/logo.png",
        base_logo_side: "/media/default/logo_side.jpg",
        base_name: "HDRF_ADMIN",
        base_name_short: "HDRF"
      },
    };
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
    submitForm(){
      this.saveLoading = true;
      let obj = {}
      obj.base = this.form;
      this.$API.system.config.updateInfo.req(obj).then((res) => {
        this.$message.success("保存成功")
        this.saveLoading = false;
      }).catch(res=>{
        this.saveLoading = false;
      })
    },
  },
};
</script>
