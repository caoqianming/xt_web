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
        hidePagination
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
        <el-table-column label="操作" fixed="right" align="center" width="160">
          <template #default="scope">
            <el-button
              text
              size="small"
              type="primary"
              @click="handleShow(scope.row)"
              >查看</el-button
            >
            <!--创建人在初始状态-->
            <!-- <el-button
              v-if="
                scope.row.state_.type === 1 && userId === scope.row.create_by
              "
              type="danger"
              size="small"
              link
              @click="handleClose(scope, '2')"
            >
              关闭
            </el-button> -->
            <!--如果state_.retreat/state_.type==1处于草稿状态 -->
            <!-- <el-button
              v-if="
                scope.row.state_.enable_retreat &&
                userId === scope.row.create_by &&
                scope.row.state_.type !== 1
              "
              type="danger"
              @click="handleClose(scope, '1')"
              size="small"
              link
            >
              撤回
            </el-button> -->
          </template>
        </el-table-column>
      </scTable>
    </el-main>
    <el-dialog v-model="limitedRetreat" :title="handleTitle">
      <el-form
        ref="Form"
        :model="handleForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item :label="handleLabel">
          <el-input
            type="textarea"
            :rows="3"
            v-model="handleForm.suggestion"
            placeholder="原因"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button class="filter-item" type="" @click="handleCancel"
          >取消</el-button
        >
        <el-button class="filter-item" type="primary" @click="handleSubmit"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "state",
  data() {
    return {
      apiObj: this.$API.wf.ticket.list,
      params: { category: "owner" },
      userId: this.$TOOL.data.get("USER_INFO").id,
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
      handleForm: {
        suggestion: "",
      },
      handleLabel: "撤回原因",
      handleTitle: "撤回工单",
      ticketId: null,
      limitedRetreat: false,
    };
  },
  mounted() {},
  methods: {
    handleShow(row) {
      let cateType = row.workflow_.key;
      let projectId = null;
      if (cateType === "visit") {
        projectId = row.ticket_data.visit;
      } else if (cateType === "rpj") {
        projectId = row.ticket_data.rpj;
      } else if (cateType.indexOf("opl_") != -1) {
        projectId = row.ticket_data.opl;
        cateType = "opl";
      }
      this.$router.push({
        path: "ticketdetail",
        query: {
          id: row.id,
          type: "showMy",
          projectId: projectId,
          catetype: cateType,
        },
      });
    },
    handleClose(scope, index) {
      if (index === "1") {
        this.handleTitle = "撤回工单";
        this.handleLabel = "撤回原因";
      } else {
        this.handleTitle = "关闭工单";
        this.handleLabel = "关闭原因";
      }
      this.limitedRetreat = true;
      this.ticketId = scope.row.id;
    },
    handleCancel() {
      this.limitedRetreat = false;
    },
    handleSubmit() {
      let res = "";
      let that = this;
      that
        .$confirm("确认" + that.handleTitle + "吗?", "温馨提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          if (that.handleTitle === "撤回工单") {
            res = that.$API.wf.ticket.ticketRetreat.req(
              that.ticketId,
              that.handleForm
            );
          } else {
            res = that.$API.wf.ticket.ticketClose.req(
              that.ticketId,
              that.handleForm
            );
          }
          if (res.err_msg) {
            that.$refs.table.refresh();
          } else {
            that.limitedRetreat = false;
            that.$refs.table.refresh();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
</style>
