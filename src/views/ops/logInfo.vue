<template>
	<el-main style="padding:0 20px;">
		<el-descriptions :column="1" border size="small">
			<el-descriptions-item label="请求接口">{{data.path}}</el-descriptions-item>
			<el-descriptions-item label="请求方法">{{data.method}}</el-descriptions-item>
			<el-descriptions-item v-if="data.target" label="target">{{data.target}}</el-descriptions-item>
			<el-descriptions-item v-if="data.result" label="状态代码">{{data.result}}</el-descriptions-item>
			<el-descriptions-item v-if="data.status_code" label="状态代码">{{data.status_code}}</el-descriptions-item>
			<el-descriptions-item label="日志id">{{data.id}}</el-descriptions-item>
			<el-descriptions-item label="日志时间">{{data.requested_at}}</el-descriptions-item>
		</el-descriptions>
		<el-collapse v-model="activeNames" style="margin-top: 20px;">
			<el-collapse-item title="详细" name="1">
				<div class="code" id="logDetail"></div>
			</el-collapse-item>
		</el-collapse>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				dataStr: '',
				activeNames: ['1'],
				typeMap: {
					'info': "info",
					'warn': "warning",
					'error': "error"
				}
			}
		},
		methods: {
			setData(data){
				this.data = data;
				let dataStr = '';
				for (let i in data) {
					let X='';
					if(typeof data[i] ==='object'){
						let temp =JSON.stringify(data[i]);
						X ='<span style="color: #43e669;margin-right: 6px;">'+i+'</span>'+ '：' + temp+'<br>';
					}else{
						let contents = [];
						let isString = typeof(data[i])=='string';
						var reg1 = new RegExp("\r\n", "g");
						var reg2 = new RegExp("\n", "g");
						var reg3 = new RegExp("\\n", "g");
						var reg4 = new RegExp("\n\n", "g");
						if(isString&&data[i].indexOf("\\n")>-1){
							debugger;
							console.log(data[i])
							 contents = data[i].replace(reg4,"<br/>");
							 console.log(contents)
						}else{
							contents = data[i];
						}
						// console.log(data[i].replace(/\r\n/g,'<br>'));
						X ='<span style="display:inline-block;color: #43e669;margin-right: 6px; white-space: pre-wrap;">'+i+'</span>'+ '：' + contents+'<br>';
					}
					dataStr +=  X;
				}
				this.dataStr = dataStr;
				document.getElementById("logDetail").innerHTML = dataStr;
			}
		}
	}
</script>

<style scoped>
	.code {
		background: #0F0F0F;
		padding:15px;
		color: #fff;
		font-size: 12px;
		border-radius: 4px;
	}
</style>
