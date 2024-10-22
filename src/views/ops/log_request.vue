<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-date-picker
        v-model="timeRange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="请求时间始"
        end-placeholder="请求时间止"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="handleQuery"
        clearable
      />
      </div>
      <div class="right-panel">
        <div class="right-panel-search">
          <el-input
            v-model="query.status_code"
            placeholder="200"
            clearable
            @keyup.enter="handleQuery"
          ></el-input>
          <el-input
            v-model="query.search"
            placeholder="地址/View"
            clearable
            @keyup.enter="handleQuery"
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
        @row-click="rowClick"
        @resetQuery="resetQuery"
      >
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column
          label="日志id"
          prop="id"
          min-width="200"
        ></el-table-column>
        <el-table-column
          label="地址"
          prop="path"
          min-width="220"
        ></el-table-column>
        <el-table-column label="method" prop="method" min-width="80">
        </el-table-column>
        <el-table-column
          label="view"
          prop="view"
          min-width="150"
        ></el-table-column>
        <el-table-column label="状态码" prop="status_code" min-width="50">
          <template #default="scope">
            <el-tag
              class="ml-2"
              type="success"
              v-if="scope.row.status_code >= 200 && scope.row.status_code < 300"
              >{{ scope.row.status_code }}</el-tag
            >
            <el-tag
              class="ml-2"
              type="warning"
              v-if="scope.row.status_code >= 400 && scope.row.status_code < 500"
              >{{ scope.row.status_code }}</el-tag
            >
            <el-tag
              class="ml-2"
              type="danger"
              v-if="scope.row.status_code >= 500"
              >{{ scope.row.status_code }}</el-tag
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
  name: "logs",
  components: {
    logInfo,
  },
  data() {
    return {
      apiObj: this.$API.ops.logs.list,
      timeRange: [],
      query: {},
      logLists: [],
      infoDrawer: false,
      logDetailVisible: false,
    };
  },
  mounted() {},
  methods: {
    handleQuery() {
       if(this.timeRange){
        this.query.start_request = this.timeRange[0]
        this.query.end_request = this.timeRange[1]
      }else{
        this.query.start_request = null
        this.query.end_request = null
      }
      this.$refs.table.queryData(this.query);
    },
    resetQuery() {
      this.query = {};
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
