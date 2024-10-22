<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd"></el-button>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :data="list" row-key="id" stripe highlightCurrentRow hidePagination>
				<el-table-column type="index" width="50"/>
				<el-table-column label="字段标识" prop="field_key"></el-table-column>
				<el-table-column label="字段名称" prop="field_name"></el-table-column>
				<el-table-column label="字段类型" prop="field_type"></el-table-column>
				<el-table-column label="顺序ID" prop="sort"></el-table-column>
				<el-table-column label="字段描述" prop="description"></el-table-column>
				<el-table-column label="创建时间" prop="create_time"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="120">
					<template #default="scope">
						<el-button link size="small" @click="handleEdit(scope.row)">编辑</el-button>
						<el-popconfirm title="确定删除吗？">
							<template #reference>
								<el-button link size="small">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</scTable>
			<el-dialog
				v-model="dialogVisible"
				:title="titleMap[type]">
				<el-form
					ref="Form"
					:model="addForm"
					label-width="80px"
					label-position="right"
					:rules="rule">
					<el-form-item label="字段标识" prop="field_key">
						<el-input v-model="addForm.field_key" placeholder="字段标识"/>
					</el-form-item>
					<el-form-item label="字段名称" prop="field_name">
						<el-input v-model="addForm.field_name" placeholder="字段名称"/>
					</el-form-item>
					<el-form-item label="字段描述" prop="description">
						<el-input v-model="addForm.description" placeholder="字段描述"/>
					</el-form-item>
					<el-form-item label="占位符" prop="placeholder">
						<el-input v-model="addForm.placeholder" placeholder="占位符"/>
					</el-form-item>
					<el-form-item label="展示标签" prop="field_type">
						<el-select style="width: 100%" v-model="addForm.field_type" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="字段标签" v-show="addForm.field_type=='select'||addForm.field_type=='selects'">
						<el-input v-model="addForm.label" placeholder="选项类型"/>
					</el-form-item>
					<el-form-item label="选项" v-show="addForm.field_type=='select'||addForm.field_type=='selects'">
						<el-button @click.prevent="addDomain" style="border: none;">
							<i class="el-icon-circle-plus-outline"></i>
							<span style="font-size:14px;">添加</span>
						</el-button>
						<el-row v-for="(domain, $index) in choiceOption" :key='$index+1' style="margin-bottom: 10px">
							<el-col :span="10">
								<template>
									<el-form-item label="id：">
										<el-input type="number" v-model="domain.id" auto-complete="off"
												  placeholder="id为整数"></el-input>
									</el-form-item>
								</template>
							</el-col>
							<el-col :span="10">
								<template>
									<el-form-item label="name：">
										<el-input v-model="domain.name" auto-complete="off"></el-input>
									</el-form-item>
								</template>

							</el-col>
							<el-col :span="3" style="text-align: center" v-if="$index!==0">
								<i
									class="el-icon-remove-outline"
									style="color: red;font-size: 16px;"
									@click.prevent="removeDomain($index,'1')"
								></i>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="顺序ID">
						<el-input v-model="addForm.sort" type="number" placeholder="顺序"/>
					</el-form-item>
					<el-form-item label="默认值">
						<el-input v-model="addForm.default_value" placeholder="默认值"/>
					</el-form-item>
					<el-form-item label="模板">
						<el-input v-model="addForm.field_template" placeholder="你有一个待办审批:{title}"/>
					</el-form-item>
					<el-form-item label="是否隐藏">
						<el-radio-group v-model="addForm.is_hidden">
							<el-radio :value="false">显示</el-radio>
							<el-radio :value="true">隐藏</el-radio>
						</el-radio-group>
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
	export default {
		name: "field",
		data() {
			return {
				id: sessionStorage.getItem('jinYuWorkflowId'),
				list: [],
				type: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				//表单数据
				addForm: {
					field_key: '',
					field_name: '',
					placeholder: '',
					field_type: '',
					sort: '',
					label: 'name',
					default_value: '',
					field_template: '',
					field_choice: [],
					is_hidden: false,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入工作流名称'}
					]
				},
				choiceOption: [{id: null, name: ""}],
				labels: [{
					label: '常规',
					value: 'name'
				}, {
					label: '名称|id',
					value: 'name|id'
				}, {
					label: '人员选择',
					value: 'user'
				}],
				options: [{
					value: 'string',
					label: '文本'
				}, {
					value: 'int',
					label: '整数'
				}, {
					value: 'float',
					label: '小数'
				}, {
					value: 'date',
					label: '日期'
				}, {
					value: 'datetime',
					label: '日期时间'
				}, {
					value: 'select',
					label: '单选'
				}, {
					value: 'selects',
					label: '多选'
				}, {
					value: 'textarea',
					label: '文本域'
				}, {
					value: 'file',
					label: '附件'
				}],
				editId: null,
				dialogVisible: false,
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			//添加字段选项
			addDomain() {
				this.choiceOption.push({id: null, name: ""})
			},
			//删除字段选项
			removeDomain(index) {
				this.choiceOption.splice(index, 1)
			},
			handleAdd() {
				this.type = 'add';
				this.dialogVisible = true;
			},
			submitHandle() {
				let that = this, choiceArr = [];
				debugger;
				this.$refs.Form.validate((valid) => {
					if (valid) {
						if (that.choiceOption[0] && that.choiceOption[0].name !== '' && that.choiceOption[0].name !== null && that.choiceOption[0].name !== undefined) {
							that.choiceOption.forEach((item) => {
								let obj = new Object();
								obj.id = parseInt(item.id);
								obj.name = item.name;
								choiceArr.push(obj);
							})
						}
						that.addForm.field_choice = choiceArr;
						that.isSaveing = true;
						let res = null;
						if (that.type === 'add') {
							debugger;
							that.addForm.workflow = this.id;
							res = that.$API.wf.customfield.create.req(that.addForm);
						} else {
							res = that.$API.wf.customfield.update.req(that.editId, that.addForm);
						}
						if (res.err_msg) {
							this.$message.error(res.err_msg)
						} else {
							that.isSaveing = false;
							that.limitedVisible = false;
							that.$refs.table.refresh();
						}

					}
				})
			},
			handleEdit(row) {
				this.type = 'edit';
				this.editId = row.id;
				this.dialogVisible = true;
				this.addForm = Object.assign({}, row);
			},
			async getList() {
				let res = await this.$API.wf.workflow.customfields.req(this.id);
				this.list = res;
			},
		},
	}
</script>

<style scoped>

</style>
