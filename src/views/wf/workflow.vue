<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-auth="'workflow.create'"
        ></el-button>
        <!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length!==1"
						   @click="batch_del" v-auth="'workflow.delete'"></el-button> -->
      </div>
      <div class="right-panel">
        <div class="right-panel-search">
          <el-input
            v-model="query.search"
            placeholder="工作流名称"
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
      <scTable ref="table" :apiObj="apiObj" row-key="id">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="ID" prop="id" min-width="150"></el-table-column>
        <el-table-column
          label="工作流名称"
          prop="name"
          min-width="200"
        ></el-table-column>
        <el-table-column
          label="标识"
          prop="key"
          min-width="100"
        ></el-table-column>
        <el-table-column
          label="工单查看权限校验"
          prop="view_permission_check"
          min-width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.view_permission_check">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="工作流描述"
          prop="description"
          min-width="150"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="create_time"
          min-width="150"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="250">
          <template #default="scope">
            <el-button
              link
              size="small"
              type="primary"
              @click="workflowShow(scope.row)"
              v-auth="'workflow.update'"
              >配置
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              @click="workflowEdit(scope.row)"
              v-auth="'workflow.update'"
              >编辑
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              @click="handleWatch(scope)"
            >
              流程图
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="workflowDel(scope.row)"
            >
              <template #reference>
                <el-button
                  link
                  size="small"
                  type="danger"
                  v-auth="'workflow.delete'"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </scTable>
    </el-main>
  </el-container>
  <div class="svgMark" v-if="limitedWatch" @click="closeMark">
    <div class="svgWrapper">
      <div class="svgItem">
        工作流流程图<i
          class="el-dialog__close el-icon el-icon-close"
          @click="closeMark"
        ></i>
      </div>
      <div style="width: 100%; margin: auto">
        <svg
          :height="mySvgHeight"
          id="mySvg"
          style="width: 100% !important"
        ></svg>
      </div>
    </div>
  </div>
  <el-dialog :title="titleMap[type]" v-model="limitedVisible">
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="addForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="key">
        <el-input v-model="addForm.key" clearable></el-input>
      </el-form-item>
      <el-form-item label="流水前缀">
        <el-input v-model="addForm.sn_prefix" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="addForm.description"
          type="textarea"
          :rows="4"
          placeholder="描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="查看权限校验">
        <el-switch v-model="addForm.view_permission_check"></el-switch>
      </el-form-item>
      <el-form-item label="展现表单字段">
        <el-transfer
          v-model="addForm.display_form_str"
          :data="choiceOption"
          :titles="['未展示字段', '展示字段']"
          :props="{ key: 'id', label: 'field_name' }"
        />
      </el-form-item>
      <el-form-item label="标题模板">
        <el-input v-model="addForm.title_template" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容模板">
        <el-input v-model="addForm.content_template" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="limitedVisible = false">取 消</el-button>
      <el-button
        v-if="type !== 'show'"
        type="primary"
        :loading="isSaving"
        @click="submitHandle()"
        >保 存</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import dagreD3 from "dagre-d3";
import * as d3 from "d3";

export default {
  name: "index",
  data() {
    return {
      apiObj: this.$API.wf.workflow.list,
      selection: [],
      checkList: [],
      choiceOption: [],
      query: {},
      mySvgHeight: null,
      editId: null,
      isSaving: false,
      limitedVisible: false,
      limitedWatch: false,
      type: "add",
      titleMap: {
        add: "新增",
        edit: "编辑",
        show: "查看",
      },
      //表单数据
      addForm: {
        name: "",
        sn_prefix: "",
        description: "",
        view_permission_check: true,
        display_form_str: [],
        title_template: "",
        content_template: "",
      },
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入工作流名称" }],
      },
      menu: {
        list: [],
        checked: ["1513426415243104256"],
        props: {
          children: "children",
          label: "name",
        },
      },
    };
  },
  mounted() {
    // this.getGroup();
  },
  methods: {
    //添加工作流
    handleAdd() {
      this.type = "add";
      this.limitedVisible = true;
    },

    submitHandle() {
      let that = this;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.isSaveing = true;
          that.submit();
        }
      });
    },

    async submit() {
      let that = this;
      let res = null;
      try {
        if (that.type === "add") {
          res = await that.$API.wf.workflow.create.req(that.addForm);
        } else {
          res = await that.$API.wf.workflow.update.req(
            that.editId,
            that.addForm
          );
        }
        that.isSaveing = false;
        that.limitedVisible = false;
        that.$refs.table.refresh();
      } catch (e) {
        that.isSaveing = false;
      }
    },

    //编辑工作流
    workflowEdit(row) {
      this.type = "edit";
      this.editId = row.id;
      this.limitedVisible = true;
      this.addForm = Object.assign({}, row);
    },

    //工作流配置
    workflowShow(row) {
      let workflow = sessionStorage.getItem("jinYuWorkflowId");
      if (workflow) {
        sessionStorage.removeItem("jinYuWorkflowId");
        sessionStorage.setItem("jinYuWorkflowId", row.id);
      } else {
        sessionStorage.setItem("jinYuWorkflowId", row.id);
      }
      this.$router.push({ path: "/wf/configuration" });
    },

    //删除工作流
    async workflowDel(row) {
      var id = row.id;
      var res = await this.$API.wf.workflow.delete.req(id);
      if (res.err_msg) {
        this.$message.error(res.err_msg);
      } else {
        this.$refs.table.refresh();
        this.$message.success("删除成功");
        // this.$alert(res.message, "提示", {type: 'error'})
      }
    },

    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection;
    },

    //搜索
    handleQuery() {
      this.$refs.table.queryData(this.query);
    },

    //根据ID获取树结构
    filterTree(id) {
      var target = null;

      function filter(tree) {
        tree.forEach((item) => {
          if (item.id == id) {
            target = item;
          }
          if (item.children) {
            filter(item.children);
          }
        });
      }

      filter(this.$refs.table.tableData);
      return target;
    },

    //本地更新数据
    handleSaveSuccess(data, type) {
      if (type == "add") {
        this.$refs.table.refresh();
      } else if (type == "edit") {
        this.$refs.table.refresh();
      }
    },

    handleWatch(scope) {
      let that = this;
      let workFlow = scope.row.id;
      that.limitedWatch = true;
      that.$nextTick(() => {
        var g = new dagreD3.graphlib.Graph().setGraph({
          rankdir: "DL",
          nodesep: 80,
          edgesep: 50, //两条线之间的距离
          ranksep: 40, //节点之间的距离
          marginx: 160,
          marginy: 20,
        });
        //获取state得到节点
        that.$API.wf.workflow.states.req(workFlow).then((response) => {
          if (!response.err_msg) {
            let nodes = response;
            // 添加节点
            nodes.forEach((item) => {
              if(item.id&&item.name){
                if(item.id===1548915292174946304){
                  debugger;
                }
                g.setNode(item.id, {
                // 节点标签
                label: item.name,
                // 节点形状
                shape: "rect",
                toolText: item.name,
                //节点样式
                style: "fill:#fff;stroke:#000",
                labelStyle: "fill:#000;",
                rx: 5, //矩形节点圆角度
                ry: 5,
              });
              }
            });
            //获取流转得到线  链接关系
            that.$API.wf.workflow.transitions.req(workFlow).then((res) => {
              if (!res.err_msg) {
                let transitionList = res;
                transitionList.forEach((transition0) => {
                  if (transition0.condition_expression.length > 0) {
                    g.setNode(transition0.source_state_.id + 100000, {
                      label: "条件表达式",
                      style: "stroke: #000;fill: #afa",
                      shape: "diamond",
                    });
                    g.setEdge(
                      transition0.source_state_.id,
                      transition0.source_state_.id + 100000,
                      {
                        // 边标签
                        label: transition0.name,
                        style: "fill:#ffffff;stroke:#c0c1c3;stroke-width:1.5px",
                      }
                    );
                    let condition_expression = transition0.condition_expression;
                    condition_expression.forEach((condition_expression0) => {
                      g.setEdge(
                        transition0.source_state_.id + 100000,
                        condition_expression0.target_state,
                        {
                          label: condition_expression0.label,
                          style:
                            "fill:#ffffff;stroke:#c0c1c3;stroke-width:1.5px",
                        }
                      );
                    });
                  }else {
                   
                    g.setEdge(
                      transition0.source_state_.id,
                      transition0.destination_state_.id,
                      {
                        // 边标签
                        label: transition0.name,
                        // 边样式
                        style: "fill:#ffffff;stroke:#c0c1c3;stroke-width:1.5px", // 根据后台数据来改变连线的颜色
                      }
                    );
                  }
                });
              //   let nodess = g._nodes;
              //   let newObj = {};
              //   for(let item in nodess){
              //     if(nodess[item]===undefined){ 
              //     }else{
              //       newObj[item] = nodess[item];
              //     }
              //   }
              //   debugger;
              //   console.log(newObj)
              // //   let list = Object.keys(nodess)
              // //   .filter((key) => nodess[key] !== null && nodess[key] !== undefined)
              // //   .reduce((acc, key) => ({ ...acc, [key]: nodess[key] }), {});
              // //  debugger;
              // //   console.log(list)
              //   g._nodes = newObj;
                console.log(g)
                g.nodes().length - 1;
                // 创建渲染器
                let render = new dagreD3.render();
                // 选择 svg 并添加一个g元素作为绘图容器.
                let svg = d3.select("#mySvg");
                let svgGroup = svg.append("g");
                // 在绘图容器上运行渲染器生成流程图.
                render(d3.select("svg g"), g);
                that.mySvgHeight =
                  document
                    .getElementsByClassName("nodes")[0]
                    .getBoundingClientRect().height + 50;
              }
            });
          }
        });
      });
    },

    closeMark() {
      this.limitedWatch = false;
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

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
  background-color: #fefefe;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  background-color: #f5f5f5;
}

.svgMark {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.3);
}

.svgWrapper {
  background: #fff;
  width: 800px;
  margin: 5vh auto;
  height: 90vh;
  text-align: center;
  border-radius: 2px;
  overflow-y: scroll;
}

.svgItem {
  padding: 20px 40px 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
}

svg {
  font-size: 14px;
}

.node rect {
  stroke: #606266;
  fill: #fff;
}

.edgePath path {
  stroke: #606266;
  fill: #333;
  stroke-width: 1.5px;
}

g.conditions > rect {
  fill: #00ffd0;
  stroke: #000;
}

.el-icon-close {
  cursor: pointer;
}
</style>

