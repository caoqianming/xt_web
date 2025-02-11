<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in list" :key="item.id">
				<el-card class="task task-item" shadow="hover">
					<h2>{{item.name}}</h2>
					<ul>
						<li>
							<h4>执行方法</h4>
							<p>{{item.task}}</p>
						</li>
						<li>
							<h4>时间策略</h4>
							<p>{{item.timetype}}-{{item.schedule}}</p>
						</li>
					</ul>
					<div class="bottom">
						<div class="state">
							<el-tag v-if="item.enabled" size="small">启用</el-tag>
							<el-tag v-if="!item.enabled" size="small" type="danger">停用</el-tag>
						</div>
						<div class="handler">
							<el-popconfirm title="确定立即执行吗？" @confirm="run(item)">
								<template #reference>
									<el-button type="primary" icon="el-icon-caret-right" size="small" circle></el-button>
								</template>
							</el-popconfirm>
							<el-dropdown trigger="click">
								<el-button type="primary" icon="el-icon-more" size="small" circle plain></el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<!-- <el-dropdown-item @click="editTask(item)" v-auth="'ptask.update'">编辑</el-dropdown-item> -->
										<el-dropdown-item @click="logs(item)">日志</el-dropdown-item>
										<!-- <el-dropdown-item @click="delTask(item)" divided v-auth="'ptask.delete'">删除</el-dropdown-item> -->
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24">
				<el-card class="task task-add" @click="addTask" v-auth="'ptask.create'">
					<i class="el-icon-plus"></i>
					<p>添加计划任务</p>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
	<el-dialog :title="titleMap[mode]" v-model="visible"  destroy-on-close>
		<el-form :model="form" :rules="rules" ref="addForm" label-width="100px" label-position="left">
			<el-form-item label="任务标题" prop="name">
				<el-input v-model="form.name" placeholder="计划任务标题" clearable></el-input>
			</el-form-item>
			<el-form-item label="执行任务" prop="task">
				<el-input v-model="form.task" placeholder="执行任务" clearable></el-input>
			</el-form-item>
			<el-form-item label="定时间隔">
				<el-input v-model="form.interval" placeholder="请输入定时间隔" clearable></el-input>
			</el-form-item>
			<el-form-item label="定时命令">
				<el-input v-model="form.crontab" placeholder="请输入定时命令" clearable></el-input>
			</el-form-item>
			<el-form-item label="定时规则">
				<el-input v-model="form.args" placeholder="请输入Cron定时规则" clearable></el-input>
			</el-form-item>
			<el-form-item label="定时规则">
				<el-input v-model="form.kwargs" placeholder="请输入Cron定时规则" clearable></el-input>
			</el-form-item>
			<!--<el-form-item label="是否启用">
				<el-switch v-model="form.used" active-value="1" inactive-value="-1"></el-switch>
			</el-form-item>-->
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>

	<el-drawer title="计划任务日志" v-model="logsVisible" :size="800" direction="rtl" destroy-on-close>
		<logs :ptask="ptask"></logs>
	</el-drawer>
</template>

<script>
	import logs from './taskLogs'

	export default {
		name: 'task',
		components: {
			logs
		},
		data() {
			return {
				list: [],
				mode: "add",
				editId:null,
				titleMap: {
					add: '新增计划任务',
					edit: '编辑计划任务'
				},
				form: {
					name: "",
					task: "",
					interval: "",
					crontab: "",
					args: "",
					kwargs: "",
				},
				rules: {
					name:[
						{required: true, message: '请填写任务名称'}
					],
					task:[
						{required: true, message: '请填写任务内容'}
					]
				},
				visible: false,
				isSaving: false,
				logsVisible: false,
				ptask: ""
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList(){
				this.$API.system.task.list.req({page:0}).then(res=>{
					this.list = res
				})
			},
			addTask(){
				this.visible = true;
				this.mode = 'add';
			},
			editTask(item){
				this.visible = true;
				this.mode = 'edit';
				this.editId = item.id;
				Object.assign(this.form, item);
			},
			//表单提交方法
			submit(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.isSaveing = true;
						let res = null;
						if(this.mode==='add'){
							res = this.$API.system.task.create.req(this.form);
						}else{
							res = this.$API.system.task.update.req(this.editId,this.form);
						}
						if(res.err_msg){
							this.message.error(res.err_msg)
						}else{
							this.getList();
							this.isSaveing = false;
							this.visible = false;
							this.$message.success("操作成功");
						}
					}
				})
			},
			delTask(task){
				this.$confirm(`确认删除 ${task.title} 计划任务吗？`,'提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).then(() => {
					this.$API.system.task.delete.req(task.id).then(res=>{
						if(res.err_msg){
							this.message.error(res.err_msg)
						}else{
							this.list.splice(this.list.findIndex(item => item.id === task.id), 1);
							this.getList();
							this.$message.success("操作成功");
						}
					})
				}).catch(() => {
					//取消
				})
			},
			logs(item){
				this.ptask = item;
				this.logsVisible = true
			},
			run(task){
				this.$API.system.task.runOnce.req(task.id).then(res=>{
					console.log(res)
				})
				this.$message.success(`已成功执行计划任务：${task.title}`)
			}
		}
	}
</script>

<style scoped>
	.task {height: 210px;}
	.task-item h2 {font-size: 15px;color: #3c4a54;padding-bottom:15px;}
	.task-item li {list-style-type:none;margin-bottom: 10px;}
	.task-item li h4 {font-size: 12px;font-weight: normal;color: #999;}
	.task-item li p {margin-top: 5px;}
	.task-item .bottom {border-top: 1px solid #EBEEF5;text-align: right;padding-top:10px;display: flex;justify-content: space-between;align-items: center;}

	.task-add {display: flex;flex-direction: column;align-items: center;justify-content: center;text-align: center;cursor: pointer;color: #999;}
	.task-add:hover {color: #409EFF;}
	.task-add i {font-size: 30px;}
	.task-add p {font-size: 12px;margin-top: 20px;}
</style>
