<template>
	<el-container>
		<el-header>
        <div class="left-panel">
          <el-select
            v-model="query.workflow"
            placeholder="审批流"
            @change="handleQuery"
            clearable
            style="margin-left: 2px"
          >
            <el-option
              v-for="item in wfOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="query.script_run_last_result"
            placeholder="任务执行状态"
            @change="handleQuery"
            clearable
            style="margin-left: 2px"
          >
            <el-option
              v-for="item in rsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建时间始"
            end-placeholder="创建时间止"
            style="margin-left: 2px"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="handleQuery"
            clearable
          />
        </div>
    </el-header>
		<el-main class="nopadding">
			<scTable
				ref="table"
				:apiObj="apiObj"
				:params="params"
				row-key="id"
				stripe
				highlightCurrentRow
			>
				<el-table-column
					label="流水号"
					prop="sn"
					width="180"
				></el-table-column>
				<el-table-column
					label="工单标题"
					prop="title"
					width="180"
					:show-overflow-tooltip="true"
				></el-table-column>

				<el-table-column label="工作流" prop="title">
					<template #default="scope">
						{{ scope.row.workflow_.name }}
					</template>
				</el-table-column>
				<el-table-column label="所在节点">
					<template #default="scope">
						{{ scope.row.state_.name }}
					</template>
				</el-table-column>
				<el-table-column label="进行状态" prop="sort">
					<template #default="scope">
						<el-tag
							:type="
								scope.row.act_state === 0
									? ''
									: scope.row.act_state === 1
									? ''
									: scope.row.act_state === 2
									? 'danger'
									: scope.row.act_state === 3
									? 'danger'
									: scope.row.act_state === 5
									? 'danger'
									: scope.row.act_state === 4
									? 'success'
									: ''
							"
							>{{ act_states[scope.row.act_state] }}</el-tag
						>
					</template>
				</el-table-column>
				<el-table-column label="可处理人" :show-overflow-tooltip="true">
					<template #default="scope">
						<span
							v-if="
								scope.row.participant_type == 2 ||
								scope.row.participant_type == 1
							"
						>
							<span
								v-for="item in scope.row.participant_"
								:key="item.id"
								>{{ item.name }}/</span
							>
						</span>
						<span v-else> 无 </span>
					</template>
				</el-table-column>
				<el-table-column
					label="创建时间"
					prop="create_time"
					width="150"
				></el-table-column>
				<el-table-column
					label="操作"
					fixed="right"
					align="center"
					width="100"
				>
					<template #default="scope">
						<el-button
							text
							size="small"
							type="primary"
							@click="handleShow(scope.row)"
							>查看</el-button
						>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
</template>

<script>
export default {
	name: "state",
	data() {
		return {
			apiObj: this.$API.wf.ticket.list,
			params: { category: "worked" },
			act_states: {
				0: "草稿中",
				1: "进行中",
				2: "被退回",
				3: "被撤回",
				4: "已完成",
				5: "已关闭",
			},
			participant_: {
				0: "无处理人",
				1: "个人",
				2: "多人",
			},
			wfOptions: [],
			rsOptions: [
						{ value: true, label: "成功" },
						{ value: false, label: "失败" },
					],
			query: {},
			timeRange: [],
		};
	},
	mounted() {
		this.getWfOptions();
	},
	methods: {
		getWfOptions() {
			this.$API.wf.workflow.list.req({ page: 0 }).then((res) => {
				this.wfOptions = res;
			});
		},
		handleQuery() {
				if (this.timeRange) {
					this.query.start_create = this.timeRange[0];
					this.query.end_create = this.timeRange[1];
				} else {
					this.query.end_create = null;
					this.query.start_create = null;
				}
				this.$refs.table.queryData(this.query);
		},
		handleShow(row) {
			let cateType = row.workflow_.key;
			let projectId = null;
			if (cateType === "visit") {
				projectId = row.ticket_data.visit;
			} else if (cateType === "rpj") {
				projectId = row.ticket_data.rpj;
			} else if (cateType.indexOf("opl_") != -1) {
				projectId = row.ticket_data.opl;
				cateType = "opl";
			} else if (cateType == "routepack") {
				projectId = row.ticket_data.t_id;
			}
			this.$router.push({
				path: "ticketdetail",
				query: {
					id: row.id,
					type: "show",
					projectId: projectId,
					catetype: cateType,
				},
			});
		},
	},
};
</script>

<style scoped></style>
