<template>
	<el-container>
		<el-aside width="300px" v-loading="showDicloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="dicFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="dic" class="menu" node-key="id" :data="group" :props="dicProps" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="dicFilterNode" @node-click="dicClickType">
						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">{{ node.label }}</span>
								<span class="code">{{ data.code }}</span>
								<span class="do">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small"
												   @click.stop="dicTypeEdit(data)" v-auth="'dict.update'"></el-button>
										<el-button icon="el-icon-delete" size="small"
												   @click.stop="dicTypeDel(node, data)" v-auth="'dict.delete'"></el-button>
								</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="mini" icon="el-icon-plus" style="width: 100%;" @click="addDicType" v-auth="'dict.create'">字典分类</el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="addDic" v-auth="'dicttype.create'"></el-button>
					<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del" v-auth="'dicttype.delete'"></el-button> -->
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="listApi" row-key="id" :params="listApiParams" @selection-change="selectionChange" stripe :paginationLayout="'prev, pager, next'">
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					<el-table-column label="序号" type="index" width="50"></el-table-column>
					<el-table-column label="名称" prop="name" width="360"></el-table-column>
					<el-table-column label="标识" prop="code"></el-table-column>
					<el-table-column label="排序" prop="sort"></el-table-column>
					<el-table-column label="是否有效" prop="is_used" width="80">
<template #default="scope">
              <el-icon v-if="scope.row.is_used" color="green"
                ><CircleCheckFilled
              /></el-icon>
              <el-icon v-else color="red"><CircleCloseFilled /></el-icon>
            </template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="140">
						<template #default="scope">
							<el-button link size="small" @click="editDic(scope.row)" v-auth="'dicttype.update'" type="primary">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="delDic(scope.row,scope.$index)">
								<template #reference>
									<el-button link size="small" v-auth="'dicttype.delete'" type="danger">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>
	<el-dialog :title="titleMap[mode]" v-model="visibleDicType" destroy-on-close>
		<el-form :model="typeForm" :rules="typeRules" ref="dialogTypeForm" label-width="80px">
			<el-form-item label="标识" prop="code">
				<el-input v-model="typeForm.code" clearable placeholder="字典编码"></el-input>
			</el-form-item>
			<el-form-item label="字典名称" prop="name">
				<el-input v-model="typeForm.name" clearable placeholder="字典显示名称"></el-input>
			</el-form-item>
			<!-- <el-form-item label="父路径" prop="parentId">
				<el-cascader
					v-model="typeForm.parent"
					:options="group"
					:props="dicProps"
					:show-all-levels="false" clearable></el-cascader>
			</el-form-item> -->
		</el-form>
		<template #footer>
			<el-button @click="visibleDicType=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="typeSubmit()">保 存</el-button>
		</template>
	</el-dialog>
	<el-dialog :title="titleMap[mode]" v-model="visibleDicItem" destroy-on-close>
		<el-form :model="dicForm" :rules="dicRules" ref="dicForm" label-width="100px" label-position="left">
			<el-form-item label="字典类型" prop="type">
				<el-cascader v-model="dicForm.type" :options="group" :props="dicProps" :show-all-levels="false" clearable></el-cascader>
			</el-form-item>
			<el-form-item label="字典名称" prop="name">
				<el-input v-model="dicForm.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="键值" >
				<el-input v-model="dicForm.value" clearable></el-input>
			</el-form-item>
			<el-form-item label="标识">
				<el-input v-model="dicForm.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="dicForm.description" clearable></el-input>
			</el-form-item>
			<!--<el-form-item label="类型" prop="type">
				<el-input v-model="dicForm.type" clearable></el-input>
			</el-form-item>-->
			<el-form-item label="排序">
				<el-input-number v-model="dicForm.sort" style="width: 100%;" clearable></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效">
				<el-switch v-model="dicForm.is_used"></el-switch>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visibleDicItem=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="dicSubmit()">保 存</el-button>
		</template>
	</el-dialog>

</template>

<script>
	import Sortable from 'sortablejs'

	export default {
		name: 'dic',
		data() {
			return {
				mode: "addType",
				titleMap: {
					addType: '新增字典类型',
					editType: '编辑字典类型',
					addItem: '新增字典',
					editItem: '编辑字典',
				},
				visibleDicType: false,
				visibleDicItem: false,
				showDicloading: false,
				dicList: [],
				dicFilterText: '',
				dicProps: {
					label: 'name',
					value:'id',
					multiple: false,
					checkStrictly: true,
				},
				editId: null,
				listApi: null,
				listApiParams: {},
				temp: [],
				group: [],
				selection: [],
				typeForm:{
					name:'',
					code:'',
					parent:''
				},
				typeRules:{
					code: [
						{required: true, message: '请输入编码'}
					],
					name: [
						{required: true, message: '请输入字典名称'}
					]
				},
				dicForm:{
					name:'',
					value:'',
					code:'',
					description:'',
					type:'',
					sort:'',
					is_used:true,
					parent:'',
				},
				dicRules:{
					// code: [
					// 	{required: true, message: '请输入字典标识'}
					// ],
					name: [
						{required: true, message: '请输入字典名称'}
					],
					type: [
						{required: true, message: '请输入字典类型'}
					]
				},
			}
		},
		watch: {
			dicFilterText(val) {
				this.$refs.dic.filter(val);
			}
		},
		mounted() {
			this.getDicType();
			// this.rowDrop()
		},
		methods: {
			//加载树数据
			async getDicType(){
				let res = await this.$API.system.dicttype.list.req({page:0});
				this.showDicloading = false;
				this.dicList = res;
				//获取第一个节点,设置选中 & 加载明细列表
				// let firstNode = this.dicList[0];
				// if(firstNode){
				// 	this.$nextTick(() => {
				// 		this.$refs.dic.setCurrentKey(firstNode.id)
				// 	});
				// 	this.listApiParams = {
				// 		id: firstNode.id
				// 	};
				// 	this.listApi = this.$API.system.dict.list;
				// }
				let postList = res;
				let posts = [];
				postList.forEach(item => {
					posts.push(item)
				});
				let obj = posts.reduce((res, v) => (res[v.id] = v , res), {});//Object
				let arr = [];
				for (let item of posts) {
					if (item.parent == null) {
						arr.push(item);
						continue
					}
					let parent = obj[item.parent];
					parent.children = parent.children ? parent.children : [];
					parent.children.push(item);
				}
				this.group = arr;
			},
			//树过滤
			dicFilterNode(value, data){
				if (!value) return true;
				var targetText = data.name + data.code;
				return targetText.indexOf(value) !== -1;
			},
			//增加字典类型
			addDicType(){
				this.mode = 'addType';
				this.visibleDicType = true;
			},
			//字典类型提交
			typeSubmit(){
				this.$refs.dialogTypeForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						this.typeForm.parent = this.typeForm.parent[0]?this.typeForm.parent[0]:'';
						let res=null;
						if(this.mode==='addType'){
							res = await this.$API.system.dicttype.create.req(this.typeForm);
						}else{
							res = await this.$API.system.dicttype.update.req(this.editId,this.typeForm);
						}
						this.isSaveing = false;
						if(res.name){
							this.visibleDicType = false;
							this.getDicType();
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//编辑字典类型
			dicTypeEdit(data){
				this.mode = 'editType';
				this.visibleDicType = true;
				console.log('parent:'+data.parent);
				this.editId=data.id;
				this.typeForm.name=data.name;
				this.typeForm.code=data.code;
				let parents = this.findParents(this.dicList,data.parent);
				this.typeForm.parent=parents.reverse();
			},
			findParents(arr,parent){
				let that = this;
			//	debugger;
				arr.forEach(item=>{
					debugger;
					if(item.id===parent){
						that.temp.push(item.id);
						if(item.parent!==null){
							this.findParents(arr,item.parent)
						}else{
							return that.temp
						}
					}
				});
				return that.temp
			},
			//点击字典类型
			dicClickType(data){
				this.listApi = this.$API.system.dict.list;
				this.$refs.table.queryData({
					type: data.id
				})
			},
			//删除字典类型
			dicTypeDel(node, data){
				this.$confirm(`确定删除 ${data.name} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					this.showDicloading = true;
					//删除节点是否为高亮当前 是的话 设置第一个节点高亮
					/*var dicCurrentKey = this.$refs.dic.getCurrentKey();
					this.$refs.dic.remove(data.id);
					if(dicCurrentKey == data.id){
						var firstNode = this.dicList[0];
						if(firstNode){
							this.$refs.dic.setCurrentKey(firstNode.id);
							this.$refs.table.upData({
								code: firstNode.code
							})
						}
					}*/
					let res = this.$API.system.dicttype.delete.req(data.id);
				//	debugger;
					console.log(res);
					this.getDicType();
					this.showDicloading = false;
					this.$message.success("操作成功")
				}).catch(() => {
				})
			},
			//行拖拽
			rowDrop(){
				const _this = this;
				const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody')
				Sortable.create(tbody, {
					handle: ".move",
					animation: 300,
					ghostClass: "ghost",
					onEnd({ newIndex, oldIndex }) {
						const tableData = _this.$refs.table.tableData;
						const currRow = tableData.splice(oldIndex, 1)[0];
						tableData.splice(newIndex, 0, currRow);
						_this.$message.success("排序成功")
					}
				})
			},
			//添加字典
			addDic(){
				this.mode = 'addItem' ;
				this.visibleDicItem = true;
			},
			//提交字典
			dicSubmit(){
				let that = this;
				that.$refs.dicForm.validate((valid) => {
					if (valid) {
						that.dicForm.type = typeof that.dicForm.type==='string'?that.dicForm.type:that.dicForm.type[0];
						if(that.mode === 'addItem'){
							that.$API.system.dict.create.req(this.dicForm).then(res=>{
								that.visibleDicItem = false;
								that.$refs.table.refresh()
							})
						}else{
							that.$API.system.dict.update.req(this.editId,this.dicForm).then(res=>{
								that.visibleDicItem = false;
								that.$refs.table.refresh()
							})
						}
					}
				})
			},
			//编辑字典
			editDic(row){
				this.editId = row.id;
				this.mode = 'editItem' ;
				this.visibleDicItem = true;
				this.dicForm.name=row.name;
				this.dicForm.code=row.code;
				this.dicForm.value=row.value;
				this.dicForm.type=row.type;
				this.dicForm.sort=row.sort;
				this.dicForm.is_used=row.is_used;
				this.dicForm.description=row.description;
				/*let parents = this.findParents(this.dicList,row.parent);
				this.dicForm.parent=parents.reverse();*/
			},
			//删除字典
			async delDic(row,index){
				var delId = row.id;
				var res = await this.$API.system.dict.delete.req(delId);
				if(res.err_msg){
					this.$message.error(res.err_msg)
				}else{
					this.$refs.table.refresh();
					this.$message.success("删除成功")
				}
			},

			//表格内开关事件
			changeSwitch(val, row){
				//1.还原数据
				row.yx = row.yx == '1'?'0':'1';
				//2.执行加载
				row.$switch_yx = true;
				//3.等待接口返回后改变值
				setTimeout(()=>{
					delete row.$switch_yx;
					row.yx = val;
					this.$message.success(`操作成功id:${row.id} val:${val}`)
				}, 500)
			},
		}
	}
</script>

<style scoped>
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
	.custom-tree-node .code {font-size: 12px;color: #999;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node .do i {margin-left:5px;color: #999;padding:5px;}
	.custom-tree-node .do i:hover {color: #333;}
	.custom-tree-node:hover .code {display: none;}
	.custom-tree-node:hover .do {display: inline-block;}
</style>
