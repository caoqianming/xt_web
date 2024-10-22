<template>
  <el-dialog
    :title="titleMap[mode]"
    v-model="visible"
    :width="500"
    destroy-on-close
    @closed="$emit('closed')"
  >
    <el-form
      :model="form"
      :rules="rules"
      :disabled="mode == 'show'"
      ref="dialogForm"
      label-width="100px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="form.code" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          :rows="2"
          type="textarea"
          placeholder="岗位详细说明"
        />
      </el-form-item>
      <el-form-item label="最短在岗(h)" prop="min_hour">
        <el-input-number v-model="form.min_hour" :min="0" />
      </el-form-item>
      <el-form-item label="最长在岗(h)" prop="max_hour">
        <el-input-number v-model="form.max_hour" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        v-if="mode != 'show'"
        type="primary"
        :loading="isSaveing"
        @click="submit()"
        >保 存</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
export default {
  emits: ["success", "closed"],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: "新增",
        edit: "编辑",
        show: "查看",
      },
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        speaker_on: true,
      },
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入" }],
      },
    };
  },
  mounted() {},
  methods: {
    //显示
    open(mode = "add") {
      this.mode = mode;
      this.visible = true;
      return this;
    },
    //表单提交方法
    async submit() {
      var valid = await this.$refs.dialogForm.validate().catch(() => {});
      if (!valid) {
        return false;
      }
      this.isSaveing = true;
      try {
        var res;
        if (this.mode == "add") {
          res = await this.$API.system.post.create.req(this.form);
        } else if (this.mode == "edit") {
          res = await this.$API.system.post.update.req(
            this.form.id,
            this.form
          );
        }
        this.isSaveing = false;
        this.$emit("success", this.form, this.mode);
        this.visible = false;
        this.$message.success("操作成功");
        return res;
      } catch (err) {
        //可以处理校验错误
        this.isSaveing = false;
        return err;
      }
    },
    //表单注入数据
    setData(data) {
      Object.assign(this.form, data);
    },
  },
};
</script>

<style>
</style>
