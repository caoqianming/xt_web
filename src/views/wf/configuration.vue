<template>
	<el-container>
		<el-tabs style="width: 100%; height:100%" type="border-card" v-model="activeName" id="workflowElTabs" @tab-click="handleClick">
			<el-tab-pane label="状态" name="state">
				<state  v-if="activeName==='state'"></state>
			</el-tab-pane>

			<el-tab-pane label="流转" name="transform">
				<transform  v-if="activeName==='transform'"></transform>
			</el-tab-pane>

			<el-tab-pane label="自定义字段" name="customField">
				<field v-if="activeName==='customField'"></field>
			</el-tab-pane>
		</el-tabs>
	</el-container>
</template>

<script>
	import field from './field'
	import state from './state'
	import transform from './transform'

	export default {
		name: 'configuration',
		components: {
			field,
			state,
			transform
		},
		data() {
			return {
				workflow:null,
				activeName:'state',
			}
		},
		mounted() {
			this.workflow = sessionStorage.getItem('jinYuWorkflowId');
		},
		methods: {
			handleClick(tab,event){
				debugger;
				console.log(tab,event);
			},
		}
	}
</script>
<style>
	#workflowElTabs > .el-tabs__content{
		height:calc(100% - 40px);
	}
	#workflowElTabs .el-tab-pane{
		height: calc(100% - 20px);

	}
</style>


