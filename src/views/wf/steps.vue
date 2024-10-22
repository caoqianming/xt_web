<template>
  <el-steps
    :active="actives"
    spac="400px"
    align-center=""
    style="padding-top: 20px"
  >
    <el-step
      :title="item.name"
      v-for="item in flowSteps"
      :key="item.id"
    ></el-step>
  </el-steps>
</template>
<!--工单进度组件-->
<script>
export default {
  name: "workstep",
  props:{
    ticket: { type: Object, default: () => {} },
  },
  data() {
    return {
      sort: 0,
      actives: 4,
      flowSteps: [],
    };
  },
  mounted() {
    // this.workId = this.ticket?this.ticket:this.$route.query.id;
    debugger;
    console.log(this.ticket)
    this.workId = this.ticket.id;
    this.$route.query.id;
    this.getFlowSteps();
  },
  methods: {
    getFlowSteps() {
      this.$API.wf.ticket.ticketFlowSteps.req(this.workId).then((res) => {
        this.flowSteps = res;
        let state = this.ticket.state;
        let dat = this.flowSteps.filter((item) => {
          return item.id == state;
        });
        debugger;
        this.sort = dat[0].sort;
        this.actives = this.flowSteps.indexOf(dat[0]);
        if (this.flowSteps.length - this.actives > 1) {
        } else {
          this.actives = this.flowSteps.length;
        }
      });
    },
  },
};
</script>

<style>
.el-step__head.is-process .el-step__icon {
  border: 2px solid #409eff;
  background: #409eff;
  color: #ffffff;
}
.el-step__title.is-process {
  color: #409eff;
}
.el-step__main>.el-step__title {
    font-size: 12px;
    line-height: 20px!important;
}

</style>
