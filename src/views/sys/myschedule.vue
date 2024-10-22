<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="table_add"
				></el-button>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable
		ref="table"
		:apiObj="apiObj"
		row-key="id"
		:query="query"
		:params="params"
		hidePagination
		hideDo
        @row-click="rowClick"
	>
		<el-table-column label="类型" prop="name" width="80">
            <template #default="scope"
								>{{ scheduleTypeEnum[scope.row.type]?.text }}
							</template>
        </el-table-column>
		<el-table-column
			label="名称"
			prop="name"
			min-width="100"
		></el-table-column>
		<el-table-column label="操作" align="center" width="80">
			<template #default="scope">
				<el-popconfirm
					title="确定删除吗？"
					@confirm="table_del(scope.row, scope.$index)"
				>
					<template #reference>
						<el-button
							link
							size="small"
							v-auth="'myschedule.delete'"
							type="danger"
                            icon="el-icon-delete"
							></el-button
						>
					</template>
				</el-popconfirm>
			</template>
		</el-table-column>
	</scTable>
		</el-main>
		<el-dialog title="创建/编辑" v-model="dialogVisible" width="80%">
		<el-form :model="saveForm" label-width="100px" ref="saveForm">
			<el-form-item label="策略类型" required>
				<el-select v-model="saveForm.type">
					<el-option
						v-for="e in scheduleTypeEnum.values"
						:key="e.key"
						:value="e.key"
						:label="e.text"
					></el-option>
				</el-select>
			</el-form-item>
			<el-divider />
			<el-form-item label="策略式" required v-if="saveForm.type == 10">
				<div style="display: flex">
					每隔
					<el-input-number
						v-model="saveForm.interval_.every"
						:min="1"
						style="margin-left: 4px"
					></el-input-number>
					<el-select
						v-model="saveForm.interval_.period"
						style="width: 200px; margin-left: 4px"
						placeholder="间隔"
					>
						<el-option
							v-for="e in schedulePeriodEnum.values"
							:key="e.key"
							:value="e.key"
							:label="e.text"
						></el-option>
					</el-select>
				</div>
			</el-form-item>
			<el-form-item label="策略式" required v-if="saveForm.type == 20">
				<div style="width: 100%">
					<div style="display: flex">
						<span style="margin-right: 4px; width: 100px">分钟</span
						><el-input
							v-model="saveForm.crontab_.minute"
						></el-input>
					</div>
					<div style="display: flex; margin-top: 4px">
						<span style="margin-right: 4px; width: 100px">小时</span
						><el-input v-model="saveForm.crontab_.hour"></el-input>
					</div>
					<div style="display: flex; margin-top: 4px">
						<span style="margin-right: 4px; width: 100px"
							>每周的天</span
						><el-input
							v-model="saveForm.crontab_.day_of_week"
						></el-input>
					</div>
					<div style="display: flex; margin-top: 4px">
						<span style="margin-right: 4px; width: 100px"
							>每月的天</span
						><el-input
							v-model="saveForm.crontab_.day_of_month"
						></el-input>
					</div>
					<div style="display: flex; margin-top: 4px">
						<span style="margin-right: 4px; width: 100px"
							>每年的月</span
						><el-input
							v-model="saveForm.crontab_.month_of_year"
						></el-input>
					</div>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button
				type="primary"
				:loading="formSaving"
				@click="formSubmit()"
				>保 存</el-button
			>
		</template>
	</el-dialog>
	</el-container>
</template>
<script>
import { scheduleTypeEnum, schedulePeriodEnum } from "@/utils/enum.js";
const defaultForm = {
	interval_: {},
	crontab_: {},
};
export default {
	name: "myschedule",
	data() {
		return {
			schedulePeriodEnum,
			scheduleTypeEnum,
			formSaving: false,
			dialogVisible: false,
			apiObj: this.$API.system.myschedule.list,
			query: {
				search: "",
			},
            params: {},
			saveForm: Object.assign({}, defaultForm),
		};
	},
	methods: {
        rowClick(item) {
            console.log(item)
            this.$emit("scheduleChose", item);
        },
		handleQuery() {
			this.$refs.table.queryData(this.query);
		},
		table_add() {
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.saveForm = Object.assign({}, defaultForm);
			});
		},
		table_del(row) {
			this.$API.system.myschedule.delete.req(row.id).then(() => {
				this.$message.success("操作成功");
				this.handleQuery();
			});
		},
		formSubmit() {
			this.formSaving = true;
			this.$refs.saveForm.validate((valid) => {
				if (valid) {
					this.$API.system.myschedule.create
						.req(this.saveForm)
						.then(() => {
							this.handleQuery();
							this.dialogVisible = false;
							this.$message.success("操作成功");
						});
				}
				this.formSaving = false;
			});
		},
	},
};
</script>
