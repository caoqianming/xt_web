<template>
<el-container>
	<el-header>
		<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd"></el-button>
			</div>
	</el-header>
		<el-main class="nopadding">
		
		<scTable
			:data="list" ref="table"
			row-key="id" stripe highlightCurrentRow hidePagination hideDo
		>
			<el-table-column label="#" type="index"></el-table-column>
			<el-table-column label="ID" prop="id" width="160"></el-table-column>
			<el-table-column label="名称" prop="name"></el-table-column>
			<!-- <el-table-column label="定时器(s)" prop="timer" width="100"></el-table-column> -->
			<el-table-column label="源状态">
				<template #default="scope">
					<span v-if="scope.row.source_state_">{{scope.row.source_state_.name}}</span>
				</template>
			</el-table-column>
			<el-table-column label="目的状态">
				<template #default="scope">
					<span v-if="scope.row.destination_state_">{{scope.row.destination_state_.name}}</span>
				</template>
			</el-table-column>
			<el-table-column label="提交时调用">
			<template #default="scope">
			{{ scope.row.on_submit_func }}
			</template>
			</el-table-column>
			<el-table-column label="创建时间" width="160">
				<template #default="scope">{{ scope.row.create_time }}</template>
			</el-table-column>
			<el-table-column
				align="center"
				label="操作"
				width="220px"
			>
				<template #default="scope">
					<el-button @click="handleEdit(scope.row)" link size="small" type="primary">
						编辑
					</el-button>
					<el-button
						type="danger"
						link
						size="small"
						@click="handleDelete(scope.row)"
					>
						删除
					</el-button>
				</template>
			</el-table-column>
		</scTable>
		<el-dialog
			v-model="dialogVisible"
			:title="titleMap[type]"
		>
			<el-form
				ref="Form"
				:model="addForm"
				label-width="130px"
				label-position="right"
			>
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" placeholder="名称"/>
				</el-form-item>
				<el-form-item label="定时器（单位秒）" prop="timer">
					<el-input v-model="addForm.timer" type="number" placeholder="0"/>
				</el-form-item>
				<el-form-item label="源状态" prop="source_state">
					<el-select v-model="addForm.source_state" placeholder="请选择" style="width:100%">
						<el-option
							v-for="item in stateList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="目的状态" prop="destination_state">
					<el-select v-model="addForm.destination_state" placeholder="请选择" style="width:100%">
						<el-option
							v-for="item in stateList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="条件表达式" prop="condition_expression">
					<!--<vue-json-editor
						style="width:100%"
						v-model="addForm.condition_expression"
						:showBtns="false"
						:mode="'code'"
						lang="zh"
						@json-change="onJsonChange"
					/>-->
					<JsonEditorVue class="editorJson" v-model="addForm.condition_expression"/>
				</el-form-item>
				<el-form-item label="属性类型" prop="attribute_type">
					<el-select style="width: 100%" v-model="addForm.attribute_type" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否校验必填" prop="field_require_check">
					<el-switch v-model="addForm.field_require_check"></el-switch>
				</el-form-item>
				<el-form-item label="提交时调用" prop="on_submit_func">
					<el-input v-model="addForm.on_submit_func" placeholder="提交时调用"/>
				</el-form-item>
			</el-form>
			<div style="text-align: right">
				<el-button type="danger" @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitHandle('Form')">确认</el-button>
			</div>
		</el-dialog>
	</el-main>
</el-container>

</template>

<script>
	// import vueJsonEditor from 'vue-json-editor'
	import JsonEditorVue from 'json-editor-vue3'
	export default {
		name: "transform",
		components: { JsonEditorVue },
		data() {
			return {
				id: sessionStorage.getItem('jinYuWorkflowId'),
				type: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
				},
				editId: null,
				list: [],
				options: [{
					value: 1,
					label: '同意'
				}, {
					value: 2,
					label: '拒绝'
				}, {
					value: 3,
					label: '其他'
				}],
				addForm: {
					name: '',
					timer: '',
					source_state: '',
					destination_state: '',
					condition_expression: {},
					field_require_check: false,
				},
				stateList: [],
				dialogVisible: false,
			}
		},
		mounted() {
			this.getList();
			this.getStateList();
		},
		methods: {
			onJsonChange (value) {
				console.log('更改value:', value);
				// 实时保存
				this.addForm.condition_expression = value;
				console.log(this.addForm.condition_expression)
			},
			// 检查json
			checkJson(){
				if (this.hasJsonFlag == false){
					alert("json验证失败");
					return false
				} else {
					alert("json验证成功");
					return true
				}
			},
			handleAdd() {
				this.type = 'add';
				this.dialogVisible = true;
			},
			handleEdit(row) {
				this.type = 'edit';
				this.editId = row.id;
				this.dialogVisible = true;
				this.addForm = Object.assign({}, row);
			},
			handleDelete(row) {
				this.$API.wf.transition.delete.req(row.id).then(res=>{
					this.getList()
				})
			},
			async getList() {
				let res = await this.$API.wf.workflow.transitions.req(this.id);
				this.list = res;
			},
			async getStateList() {
				let res = await this.$API.wf.workflow.states.req(this.id);
				console.log(res);
				this.stateList = res;
			},
			async submitHandle(){
				let that = this;
				let res = null;
				if (that.type === 'add') {
					debugger;
					that.addForm.workflow = this.id;
					res = await that.$API.wf.transition.create.req(that.addForm);
				} else {
					res = await that.$API.wf.transition.update.req(that.editId, that.addForm);
				}
				if(res.err_msg){
					that.isSaveing = false;
				}else{
					that.isSaveing = false;
					that.dialogVisible = false;
					that.getList();
				}
				this.$refs.Form.validate((valid) => {
					if (valid) {
						
					}
				})
			},
		},
	}
</script>

<style scoped>
.editorJson{
	width: 100%;
}
</style>
