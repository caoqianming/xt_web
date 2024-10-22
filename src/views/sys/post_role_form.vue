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
		  ref="form"
		  label-width="100px"
		  label-position="left"
	  >
		  <el-form-item label="权限范围">
			  <el-select
				  v-model="form.data_range"
				  placeholder="请选择权限范围"
				  style="width: 100%"
			  >
				  <el-option
					  v-for="item in rangeOptions"
					  :key="item.id"
					  :label="item.value"
					  :value="item.id"
				  />
			  </el-select>
		  </el-form-item>
		  <el-form-item label="关联岗位">
			  <el-select
				  v-model="form.post"
				  placeholder="请选择关联岗位"
				  style="width: 100%"
			  >
				  <el-option
					  v-for="item in postOptions"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id"
				  />
			  </el-select>
		  </el-form-item>
		  <el-form-item label="关联角色">
			  <el-select
				  v-model="form.role"
				  placeholder="请选择关联角色"
				  style="width: 100%"
			  >
				  <el-option
					  v-for="item in roleOptions"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id"
				  />
			  </el-select>
		  </el-form-item>
	  </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        v-if="mode !== 'show'"
        type="primary"
        :loading="isSaveing"
        @click="submit()"
        >
		  保 存
	  </el-button>
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
			data_range: 10,
			post: "",
			role: "",
		},
		//验证规则
		rules: {
			name: [{required: true, message: "请输入姓名"}],
		},
		postProps: {
			value: "id",
			multiple: true,
			checkStrictly: true,
		},
		roleOptions:[],
		postOptions:[],
		rangeOptions: [
			{id: 10, value: "全部"},
			// {id:20,value: "全部"},
			{id: 30, value: "同级及以下"},
			{id: 40, value: "本级及以下"},
			{id: 50, value: "本级"},
			{id: 60, value: "仅本人"},
		],
    };
  },
  mounted() {
	  this.getPosts();
	  this.getRole();
  },
  methods: {
    //显示
    open(mode = "add"){
    	debugger;
      this.mode = mode;
      this.visible = true;
      return this;
    },
	  //表单注入数据
	  setData(data) {
		  debugger;
		  if(data.postId){
			  this.form.post=data.postId;
		  }else{
			  Object.assign(this.form, data);
		  }
	  },
    //表单提交方法
    async submit() {
		
      var valid = await this.$refs.form.validate().catch(() => {});
      if (!valid) {
        return false;
      }
      this.isSaveing = true;
      try {
        let res;
        
          res = await this.$API.system.postrole.create.req(this.form);
        
        this.isSaveing = false;
        this.$emit("success", this.form, this.mode);
        this.visible = false;
        this.$message.success("操作成功");
        return res
      } catch (err) {
        //可以处理校验错误
        this.isSaveing = false;
        return err;
      }
    },

	  getPosts(){
		  this.$API.system.post.list.req({page:0}).then(res=>{
			  if(res.err_msg){
				  this.$message.error(res.err_msg)
			  }else{
				  this.postOptions = res;
			  }
		  })
	  },
	  getRole(){
		  this.$API.system.role.list.req({page:0}).then(res=>{
			  if(res.err_msg){
				  this.$message.error(res.err_msg)
			  }else{
				  this.roleOptions = res;
			  }
		  })
	  },
  },
};
</script>

<style>
</style>
