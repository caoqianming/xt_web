<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="roleAdd" v-auth="'role.create'"></el-button>
				<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length!==1" @click="batch_del" v-auth="'role.delete'"></el-button> -->
				<!--<el-button type="primary" plain :disabled="selection.length!=1" @click="permission">权限设置</el-button>-->
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="query.search" placeholder="角色名称" clearable @keyup.enter="handleQuery"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="handleQuery"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" hidePagination>
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="name" min-width="100"></el-table-column>
				<el-table-column label="角色标识" prop="code" min-width="100"></el-table-column>
				<el-table-column label="角色描述" prop="description" min-width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" align="center" width="140">
					<template #default="scope">
						<el-button link size="small" @click="roleEdit(scope.row, scope.$index)" v-auth="'role.update'" type="primary">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-popconfirm title="确定删除吗？" @confirm="roleDel(scope.row, scope.$index)">
							<template #reference>
								<el-button link size="small" v-auth="'role.delete'" type="danger">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
	<el-dialog :title="titleMap[type]" v-model="limitedVisible" :width="600">
		<el-form :model="addForm" :rules="rules" ref="addForm" autocomplete =‘off’ label-width="100px" label-position="left">
			<el-form-item label="角色" prop="name" auto>
				<el-input v-model="addForm.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色标识">
				<el-input v-model="addForm.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="addForm.description" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限功能">
				<div class="treeMain">
					<el-tree
						ref="menu"
						node-key="id"
						show-checkbox
						:check-strictly="checkStrictly"
						:default-expand-all="true"
						:data="menu.list"
						:props="menu.props"
						@check="handleChange"
					></el-tree>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="limitedVisible=false" >取 消</el-button>
			<el-button v-if="type!=='show'" type="primary" :loading="isSaving" @click="submitHandle()">保 存</el-button>
		</template>
	</el-dialog>
</template>
<script>
	import {genTree} from "@/utils/verificate";
	const defaultForm = {
		id:"",
		name: "",
		code: "",
		description: "",
		perms:[],
	};
	export default {
		name: 'dept',
		data() {
			return {
				apiObj: this.$API.system.role.list,
				selection: [],
				checkList: [],
				search: {
					keyword: null
				},
				query: {},
				isSaving: false,
				limitedVisible : false,
				checkStrictly:true,
				type: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},

				//表单数据
				addForm: defaultForm,
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入角色名称'}
					],
				},
				menu: {
					list: [],
					checked: [],
					props: {
						emitPath: false,
						children: 'children',
						// label: 'name',
						/*label: (data)=>{
							return data.meta.title
						}*/
					}
				},
			}
		},
		mounted() {
			this.getList();
			this.getGroup();
		},
		methods: {
			handleChange(item, check) {
				this.menu.checked = check.checkedKeys;
			},
			// checkChange(item, check,node) {
			// 	let that = this;
			// 	if(check){//选中
			// 		if(item.parent!==null){
			// 			if(that.menu.checked.indexOf(item.parent)>-1){}else{
			// 				that.menu.checked.push(item.parent)
			// 			}
			// 			that.$refs.menu.setChecked(item.parent,true,false);
			// 		}
			// 	}
			// },
			//加载树数据
			async getGroup() {
				let res = await this.$API.system.permission.list.req({page: 0});
				this.menu.list = genTree(res);
			},
			//获取角色列表
			getList(){
				var res = this.$API.system.role.list.req();
				this.tableData = res.results;
			},
			//添加角色
			roleAdd(){
				this.limitedVisible = true;
				this.type = "add";
				this.$nextTick(()=>{
					this.$refs.menu.setCheckedKeys([])
				})
				this.addForm = Object.assign({}, defaultForm);
			},
			/*handleChange(value){
				debugger;
				console.log(value);
				console.log(this.menu.list);
			},*/
			submitHandle(){
				let that = this;
				this.addForm.perms = this.menu.checked;
				this.$refs.addForm.validate( (valid) => {
					if (valid) {
						this.isSaveing = true;
						let res;
						if(this.type==='add'){
							this.$API.system.role.create.req(that.addForm).then(res=>{
								this.isSaveing = false;
								this.limitedVisible = false;
								this.$refs.table.refresh();
							}).catch(e=>{this.isSaveing = false;})
						}else{
							this.$API.system.role.update.req(that.addForm.id,that.addForm).then(res=>{
								this.isSaveing = false;
								this.limitedVisible = false;
								this.$refs.table.refresh();
							}).catch(e=>{this.isSaveing = false;})
						}
					}
				})
			},

			//编辑角色
			roleEdit(row){
				this.type='edit';
				this.addForm.id=row.id;
				this.addForm.name=row.name;
				this.addForm.code=row.code;
				this.addForm.description=row.description;
				this.limitedVisible = true;
				this.$nextTick(()=>{
					this.$refs.menu.setCheckedKeys(row.perms)
				})
			},

			//删除角色
			async roleDel(row){
				var id = row.id;
				var res = await this.$API.system.role.delete.req(id);
				if(res.err_msg){
					this.$message.error(res.err_msg)
				}else{
					this.$refs.table.refresh();
					this.$message.success("删除成功")
				}
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//搜索
			handleQuery(){
				this.$refs.table.queryData(this.query)
			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, type){
				if(type=='add'){
					this.$refs.table.refresh()
				}else if(type=='edit'){
					this.$refs.table.refresh()
				}
			}
		}
	}
</script>
<style scoped>
	.treeMain {width: 100%;height:280px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
