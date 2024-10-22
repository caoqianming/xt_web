<template>
  <el-container>
    <el-header>
      <div class="left-panel"></div>
      <div class="right-panel">
        <div class="right-panel-search">
          <el-input
            v-model="query.name"
            placeholder="日志名称"
            clearable
          ></el-input>
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
        hidePagination
        @row-click="rowClick"
		@resetQuery="resetQuery"
      >
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column
          label="名称"
          prop="name"
          min-width="80"
        ></el-table-column>
        <el-table-column
          label="大小(KB)"
          prop="size"
          min-width="150"
        ></el-table-column>
      </scTable>
    </el-main>
    <el-drawer
      v-model="infoDrawer"
      title="日志详情"
      :size="'50%'"
      destroy-on-close
    >
      <div v-html="logText" style="white-space: pre-wrap; font-size: 14px"></div>
    </el-drawer>
  </el-container>
</template>
<script>
export default {
  name: "file_logs",
  data() {
    return {
      apiObj: this.$API.ops.file_logs.list,
      query: {},
      logLists: [],
      infoDrawer: false,
      logDetailVisible: false,
	  logText:null
    };
  },
  mounted() {},
  methods: {
    handleQuery() {
      this.$refs.table.queryData(this.query);
    },
	resetQuery() {
		this.query = {};
	},
    rowClick(row) {
      this.$API.ops.file_logs.detail.req(row.name).then((res) => {
		this.logText = res
	  });
      this.infoDrawer = true;
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
