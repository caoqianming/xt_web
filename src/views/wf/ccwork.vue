<template>
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
        <el-table-column label="流水号" prop="sn" width="180"></el-table-column>
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
            <span v-if="scope.row.participant_type==2 || scope.row.participant_type == 1">
              <span v-for="item in scope.row.participant_" :key="item.id">{{ item.name}}/</span>
            </span>
            <span v-else>
              无
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          width="150"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="100">
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
      params: { category: "cc" },
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
    };
  },
  mounted() {},
  methods: {
    handleShow(row) {

    },
  },
};
</script>

<style scoped>
</style>
