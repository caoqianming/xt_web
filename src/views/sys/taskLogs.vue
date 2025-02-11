<template>
	<el-container>
		<el-main  class="nopadding">
			<scTable ref="table" :apiObj="apiObj" :params="params">
				<el-table-column label="任务ID" prop="task_id" width="300"></el-table-column>
				<el-table-column label="执行时间" prop="date_created" width="160"></el-table-column>
				<el-table-column label="执行状态" prop="status">
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		props: {
		    ptask: {type: Object, default: () => {}}
		},
		data() {
			return {
				apiObj: this.$API.system.task.result,
				params: {task_name: this.ptask.task, periodic_task_name: this.ptask.name},
			}
		},
		mounted() {
		},
		methods: {
		}
	}
</script>

<style>
</style>
