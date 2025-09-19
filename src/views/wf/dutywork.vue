<template>
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
	<el-container>
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
									? 'warning'
									: scope.row.act_state === 1
									? 'primary'
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
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-button
							link
							size="small"
							type="primary"
							@click="handleDetail(scope.row)"
						>
							处理
						</el-button>
						<el-button
							v-if="
								scope.row.state_.distribute_type === 1 &&
								scope.row.participant_type === 2
							"
							link
							type="success"
							size="small"
							@click="handleAccept(scope.row)"
						>
							接单
						</el-button>
						<!-- <el-button
              type="success"
              link
              size="small"
              @click="handleLogs(scope.row)"
            >
              工单日志
            </el-button> -->
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
	<el-dialog v-model="limitedFlowLogs" title="工单日志">
		<ticket-log ref="ticketLogs" :ticket="ticketId"></ticket-log>
	</el-dialog>
</template>

<script>
import ticketLog from "./details.vue";

export default {
	components: {
		ticketLog,
	},
	name: "state",
	data() {
		return {
			apiObj: this.$API.wf.ticket.list,
			params: { category: "duty" },
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
			floeLogs: [],
			ticketId: "",
			limitedFlowLogs: false,
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
		//处理
		handleDetail(row) {
		},
		//获取日志
		handleLogs(row) {
			let that = this;
			let id = row.id;
			this.ticketId = row.id;
			that.limitedFlowLogs = true;
			that.$API.wf.ticket.ticketFlow.req({ ticket: id }).then((res) => {
				if (res.err_msg) {
				} else {
					that.floeLogs = res.results;
				}
			});
		},
		handleAccept(row) {
			this.$API.wf.ticket.ticketAccept.req(row.id, {}).then((res) => {
				if (res.err_msg) {
				} else {
					this.$refs.table.refresh();
				}
			});
		},
	},
};
</script>

<style scoped></style>
