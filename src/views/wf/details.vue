<template>
  <el-container>
    <el-main class="nopadding">
      <el-table
        :data="logs"
        fit
        stripe
        style="width: 100%"
        max-height="300"
        highlight-current-row
      >
        <el-table-column label="进行状态">
          <template #default="scope">
            <span>{{ scope.row.state_.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型">
          <template #default="scope">
            <span>{{ interveneTypeOptions[scope.row.intervene_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template #default="scope">
            <span v-if="scope.row.participant_">{{
              scope.row.participant_.name
            }}</span>
            <span v-if="scope.row.participant_str">{{
              scope.row.participant_str
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作属性">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.transition_attribute == 1"
              >同意</el-tag
            >
            <el-tag
              type="danger"
              v-else-if="scope.row.transition_attribute == 2"
              >拒绝</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作意见" prop="suggestion" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="更新时间" prop="update_time">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<!--工单处理详情组件-->
<script>
export default {
  name: "detail",
  props: {
    ticket: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      logs: [],
      ticketId: null,
      interveneTypeOptions: {
        0: "正常处理",
        1: "转交",
        2: "加签",
        3: "加签完成",
        4: "接单",
        5: "评论",
        6: "删除",
        7: "强制关闭",
        8: "强制修改状态",
        9: "hook",
        10: "撤回",
        11: "抄送",
      },
    };
  },
  mounted() {
    debugger;
    this.ticketId = this.ticket;
    this.getFlowlogss();
  },
  methods: {
    getFlowlogss() {
      let that = this;
      this.$API.wf.ticket.ticketFlowlogs.req(that.ticketId).then((res) => {
        if (res.err_msg) {
        } else {
          that.logs = res;
        }
      });
    },
  },
};
</script>

