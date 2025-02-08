<template>
  <el-container>
    <el-main>
      <el-row :gutter="4">
        <el-col :md="5" :sm="24">
          <el-card header="CPU">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="物理核心数">{{
        cpuData.count
      }}</el-descriptions-item>
              <el-descriptions-item label="逻辑核心数">{{
          cpuData.lcount
        }}</el-descriptions-item>
              <el-descriptions-item label="当前使用率">{{ cpuData.percent }}%</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :md="5" :sm="24">
          <el-card header="内存">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总内存">{{ memoryData.total }}GB</el-descriptions-item>
              <el-descriptions-item label="已用内存">{{ memoryData.used }}GB</el-descriptions-item>
              <el-descriptions-item label="当前使用率">{{ memoryData.percent }}%</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :md="5" :sm="24">
          <el-card header="硬盘">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总大小">{{ diskData.total }}GB</el-descriptions-item>
              <el-descriptions-item label="已用大小">{{ diskData.used }}GB</el-descriptions-item>
              <el-descriptions-item label="当前使用率">{{ diskData.percent }}%</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :md="9" :sm="24">
          <el-card header="Celery&Redis">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="注册任务数">{{ celeryData.count_registered_task }}</el-descriptions-item>
              <el-descriptions-item label="Redis内存使用">{{ redisData.used_memory_human }}</el-descriptions-item>
              <el-descriptions-item label="正执行数">{{ celeryData.count_active_task }}</el-descriptions-item>
              <el-descriptions-item label="Redis峰值使用">{{ redisData.used_memory_peak_human }}</el-descriptions-item>
              <el-descriptions-item label="计划执行数">{{ celeryData.count_scheduled_task }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
      <el-card>
        <scTable ref="table" :apiObj="apiObj" row-key="id" stripe highlightCurrentRow hidePagination
          @resetQuery="resetQuery">
          <el-table-column label="#" type="index" width="50"></el-table-column>
          <el-table-column label="文件地址" prop="filepath" min-width="200"></el-table-column>
          <el-table-column label="大小(MB)" prop="size" min-width="150"></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template #default="scope">
              <el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </scTable>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      cpuData: {},
      diskData: {},
      memoryData: {},
      celeryData: {},
      redisData: {},
      apiObj: this.$API.ops.dbbackup.list,
      query: {},
    };
  },
  mounted() {
    this.serverInfo();
    this.celeryInfo();
    this.redisInfo();
  },
  methods: {
    celeryInfo() {
      this.$API.ops.celery.info.req().then(res => {
        this.celeryData = res;
      })
    },
    redisInfo() {
      this.$API.ops.redis.info.req().then(res => {
        this.redisData = res;
      })
    },
    serverInfo() {
      this.$API.ops.server.cpu.req().then(res=>{this.cpuData = res})
      this.$API.ops.server.memory.req().then(res=>{this.memoryData = res})
      this.$API.ops.server.disk.req().then(res=>{this.diskData = res})
    },
    resetQuery() {
      this.query = {};
    },
    //删除
    async table_del(row) {
      this.$API.ops.dbbackup.deletes
        .req({ filepaths: [row.filepath] })
        .then((res) => {
          this.$message.success("删除成功");
          this.$refs.table.refresh();
          return res;
        })
        .catch((err) => {
          return err;
        });
    },
  },
};
</script>