<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-segmented
					v-model="tvalue"
					:options="Object.keys(toptions)"
					size="default"
					@change="params.category = toptions[tvalue]; handleQuery()"
				></el-segmented>
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
					placeholder="执行状态"
					@change="handleQuery"
					clearable
					style="margin-left: 2px; width:100px"
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
				>
				<template #default="scope">
					<el-link
						@click="handleShow(scope.row)" type="primary"
						>{{ scope.row.sn }}</el-link>
				</template>
				</el-table-column>
				<el-table-column
					label="工单标题"
					prop="title"
					min-width="180"
					:show-overflow-tooltip="true"
				></el-table-column>

				<el-table-column label="工作流" prop="title" width="160">
					<template #default="scope">
						{{ scope.row.workflow_.name }}
					</template>
				</el-table-column>
				<el-table-column label="所在节点" width="160">
					<template #default="scope">
						{{ scope.row.state_.name }}
					</template>
				</el-table-column>
				<el-table-column label="进行状态" prop="sort" width="120">
					<template #default="scope">
						<el-tag :type="actStateEnum[scope.row.act_state]?.type">
                        {{ actStateEnum[scope.row.act_state]?.text }}
                    </el-tag>
					</template>
				</el-table-column>
				<el-table-column label="可处理人" :show-overflow-tooltip="true" min-width="160">
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
				<el-table-column label="操作" fixed="right" align="center" width="80">
					<template #default="scope">
						<el-button
							type="danger"
							size="small"
							@click="reStart(scope.row)"
							v-if="scope.row.script_run_last_result == false"
							>重试</el-button
						>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
		<el-drawer v-model="drawer" size="90%" :show-close="false">
			<template #header="{ close, titleId, titleClass }">
				<h4 :id="titleId" :class="titleClass">工单详情</h4>
				<el-button type="danger" @click="close">关闭</el-button>
			</template>
			<component :is="currentComponent" :ticketId="ticketId" :t_id="t_id" @closed="drawer = false"
			@success="()=>{drawer = false; $refs.table.refresh()}"></component>
		</el-drawer>
	</el-container>
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue'; // 异步组件加载
import { actStateEnum, interveneTypeEnum } from "@/utils/enum.js";
export default {
	name: "myticket",
	data() {
		return {
			actStateEnum, interveneTypeEnum,
			drawer: false,
			tvalue: "待办",
			toptions: {
				"待办": "duty",
				"我的": "owner",
				"已处理": "worked",
				"抄送我": "cc"
			},
			query: {},
			timeRange: [],
			list: [],
			apiObj: null,
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
				1: "单人",
				2: "多人",
			},
			rsOptions: [
				{ value: true, label: "成功" },
				{ value: false, label: "失败" },
			],
			wfOptions: [],
			currentComponent: null,
			ticketId: null,
			t_id: null,
		};
	},
	mounted() {
		let category = this.$route.query.category
		if (category) {
			this.tvalue = category == "duty" ? "待办" : category == "owner" ? "我的" : category == "worked" ? "已处理" : category == "cc" ? "抄送我" : "待办"
			this.params.category = category
			this.apiObj = this.$API.wf.ticket.list
		} else {
			this.tvalue = "待办"
			this.params.category = "duty"
			this.apiObj = this.$API.wf.ticket.list
		}
		this.getWfOptions();
	},
	methods: {
		getWfOptions() {
			this.$API.wf.workflow.list.req({ page: 0 }).then((res) => {
				this.wfOptions = res;
			});
		},
		reStart(row) {
			this.$API.wf.ticket.retryScript.req(row.id).then((res) => {
				this.$message.success("任务执行下发成功");
				row.script_run_last_result = true;
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
			this.drawer = true;
			this.ticketId = row.id;
			this.t_id = row.ticket_data.t_id;
			const viewPath = row.workflow_.view_path;
			// 动态 import
			this.currentComponent = markRaw(
			defineAsyncComponent(() => import(`@/views${viewPath}.vue`))
			);
		},
	},
};
</script>

<style scoped></style>
