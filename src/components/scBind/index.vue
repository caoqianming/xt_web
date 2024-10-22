<template>
	<el-dialog
    title="绑定定位卡"
    destroy-on-close
    v-model="pageShow"
    @closed="closeDrawer"
	>
    <el-form ref="dialogForm" :model="form" label-width="120px">
      <el-form-item label="姓名">
        {{ bindName }}
      </el-form-item>
      <el-form-item label="绑定卡号">
        <el-select v-model="form.code" filterable style="width: 100%" :disabled="bindType == 20">
          <el-option
            v-for="item in bltList"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-if="bindType === 10" type="primary" @click="submitBindBlt"
        >绑定</el-button
      >
      <el-button v-if="bindType === 20" type="primary" @click="submitBindBlt"
        >解绑</el-button
      >
    </template>
	</el-dialog>
</template>
<script>
	export default {
		name: "employee",
    emits: ["success", "closed"],
		components: {},
		props: {
			bindType: {
				type: Number,
			},
      bindName: {
				type: String,
			},
			bindEmployee: {
				type: String,
			},
      bindBtl:{
          type: String,
      },
		},
		data() {
			return {
				form: {
            type: 10,
            code: "",
            employee: "",
        },
        pageShow:true,
        bltList: [],
        EemployeeName:'',
			};
		},
    created(){
      this.getBltList();
      this.pageShow = true;
      this.form.type = this.bindType; 
      this.EemployeeName = this.bindName; 
      this.form.code = this.bindBtl; 
      this.form.employee = this.bindEmployee; 
      if(this.bindType==10 ){
        this.form.code = ''
      }
    },
		methods: {
      getBltList() {
          let that = this;
          that.$API.third.tdevice.list.req({ type: 30, page: 0,  state:'unused', query: '{id, code}'}).then((res) => {
              that.bltList = res;
          });
      },

			submitBindBlt() {
        let that = this;
        that.$API.third.tdevice.bltBind.req(this.form).then((res) => {
            if (res.err_msg) {
            } else {
              that.pageShow=false;
              that.$emit('success',false);
            }
        });
      },
      closeDrawer(){
        this.pageShow=false;
        this.$emit('closed',false);
      },
		},
	};
</script>
