<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-select v-model="query.result" clearable placeholder="请求结果" @change="handleQuery">
          <el-option
            v-for="item in resultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="left-panel">
        <div class="right-panel-search">
          <el-input v-model="query.search" placeholder="logId" clearable></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery"
          ></el-button>
        </div>
      </div>
    </el-header>
    <el-main class="nopadding">
      <scTable
        ref="table"
        :apiObj="apiObj"
        row-key="id"
        stripe
        highlightCurrentRow
        @row-click="rowClick"
		@resetQuery="resetQuery"
      >
        <el-table-column label="#" type="index" width="50"></el-table-column>
		<el-table-column label="id" prop="id" min-width="150"></el-table-column>
		<el-table-column
          label="target"
          prop="target"
          min-width="50"
        ></el-table-column>
        <el-table-column
          label="method"
          prop="method"
          min-width="50"
        ></el-table-column>
        <el-table-column
          label="地址"
          prop="path"
          min-width="220"
        ></el-table-column>
        <el-table-column label="状态" prop="status_code" min-width="50">
          <template #default="scope">
            <el-tag
              class="ml-2"
              type="success"
              v-if="scope.row.result === 'success'"
              >成功</el-tag
            >
            <el-tag
              class="ml-2"
              type="warning"
              v-if="scope.row.result === 'fail'"
              >失败</el-tag
            >
            <el-tag
              class="ml-2"
              type="danger"
              v-if="scope.row.result === 'error'"
              >错误</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          prop="requested_at"
          min-width="100"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <el-button type="primary" size="small">查看</el-button>
        </el-table-column>
      </scTable>
    </el-main>
    <el-drawer
      v-model="infoDrawer"
      title="日志详情"
      :size="'50%'"
      destroy-on-close
    >
      <logInfo ref="logInfo"></logInfo>
    </el-drawer>
  </el-container>
</template>
<script>
import logInfo from "./logInfo";
export default {
  name: "thirdLogs",
  components: {
    logInfo,
  },
  data() {
    return {
      apiObj: this.$API.third.thirdLog,
      query: {},
      logLists: [],
      infoDrawer: false,
      logDetailVisible: false,
      resultOptions: [
        {
          value: "success",
          label: "成功",
        },
        {
          value: "fail",
          label: "失败",
        },
        {
          value: "error",
          label: "错误",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    handleQuery() {
      	this.$refs.table.queryData(this.query);
    },
	resetQuery() {
		this.query = {}
	},
    rowClick(row) {
      this.infoDrawer = true;
      this.$nextTick(() => {
        this.$refs.logInfo.setData(row);
      });
    },
  },
};
</script>
<style scoped>
.treeMain {
  height: 280px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
}
</style>
