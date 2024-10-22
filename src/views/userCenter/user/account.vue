<template>
  <el-card shadow="never" header="账户信息">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      style="margin-top: 20px"
    >
        <el-form-item label="账号">
          <el-input v-model="form.username" readonly></el-input>
          <div class="el-form-item-msg">账号信息用于登录，系统不允许修改</div>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly></el-input>
        </el-form-item>

        <el-form-item label="主岗">
          <el-tag v-if="form.belong_dept_name">{{form.belong_dept_name}}</el-tag>
          <el-tag v-if="form.post_name" type="success">{{form.post_name}}</el-tag>
          <el-tag v-if="form.is_superuser">超级管理员</el-tag>
        </el-form-item>
        <!-- </el-col>
		
      </el-row> -->
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.getUserlogin();
  },
  methods: {
    openPage(item) {
      this.page = item.index;
    },

    getUserlogin() {
      this.form = this.$TOOL.data.get("USER_INFO");
    },
  },
};
</script>
