<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        ></el-button>
      </div>
    </el-header>
    <el-main class="nopadding" style="height: 100%">
      <scTable
        ref="table"
        v-loading="listLoading"
        :data="list"
        row-key="id"
        stripe
        highlightCurrentRow
        hidePagination
        hideDo
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="ID" prop="id" width="160"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="是否隐藏" width="80">
          <template #default="scope">
            <span v-if="scope.row.is_hidden">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="顺序ID" prop="sort" width="80"></el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag effect="plain" v-if="scope.row.type == 0">
              普通类型
            </el-tag>
            <el-tag effect="plain" v-if="scope.row.type == 1">
              初始状态
            </el-tag>
            <el-tag effect="plain" v-if="scope.row.type == 2">
              结束状态
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="参与人类型" width="100">
          <template #default="scope">
            {{ options_[scope.row.participant_type] }}</template
          >
        </el-table-column>
        <el-table-column label="分配方式" width="100">
          <template #default="scope">
            {{ options2_[scope.row.distribute_type] }}</template
          >
        </el-table-column>
        <el-table-column label="到达调用">
          <template #default="scope">
          {{ scope.row.on_reach_func }}
        </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="160"></el-table-column>
        <el-table-column label="操作" fixed="right" align="right" width="120">
          <template #default="scope">
            <el-button link size="small" type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button link size="small" type="danger" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </scTable>
      <el-dialog v-model="dialogVisible" :title="titleMap[type]">
        <el-form
          ref="Form"
          :model="addForm"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name" placeholder="名称" />
          </el-form-item>
          <el-form-item label="标识" prop="key">
            <el-input v-model="addForm.key" placeholder="标识" />
          </el-form-item>
          <el-form-item label="是否隐藏" prop="is_hidden" label-width="120px">
            <el-switch v-model="addForm.is_hidden"></el-switch>
          </el-form-item>

          <el-form-item label="状态顺序" prop="sort">
            <el-input
              v-model="addForm.sort"
              type="number"
              placeholder="状态顺序"
            />
          </el-form-item>
          <el-form-item label="状态类型" prop="type">
            <el-select
              style="width: 100%"
              v-model="addForm.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="允许撤回"
            prop="enable_retreat"
            label-width="120px"
          >
            <el-switch v-model="addForm.enable_retreat"></el-switch>
          </el-form-item>
          <el-form-item label="参与者类型" prop="participant_type">
            <el-select
              style="width: 100%"
              v-model="addForm.participant_type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="参与者"
            prop="participant"
            v-if="addForm.participant_type == 1"
          >
            <el-select
              style="width: 100%"
              v-model="addForm.participant"
              placeholder="请选择参与者"
              filterable
            >
              <el-option
                v-for="item in staffs"
                :key="item.id"
                :label="item.name + '-' + item.phone"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.phone }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="参与者"
            prop="participant"
            v-if="addForm.participant_type == 2"
          >
            <el-select
              style="width: 100%"
              v-model="addForm.participant"
              multiple
              filterable
              placeholder="请选择参与者"
            >
              <el-option
                v-for="item in staffs"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.phone }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="参与者"
            prop="participant"
            v-if="addForm.participant_type == 7"
          >
            <!-- <el-select
              style="width: 100%"
              v-model="addForm.participant"
              placeholder="请选择字段"
            >
              <el-option
                v-for="item in fieldList"
                :key="item.id"
                :label="item.field_name"
                :value="item.field_key"
              >
              </el-option>
            </el-select> -->
            <el-input v-model="addForm.participant" placeholder="工单字段" />
          </el-form-item>
          <el-form-item
            label="参与者"
            prop="participant"
            v-if="addForm.participant_type == 6"
          >
            <el-input v-model="addForm.participant" placeholder="方法名" />
          </el-form-item>
          <el-form-item label="分配方式" prop="participant">
            <el-select
              style="width: 100%"
              v-model="addForm.distribute_type"
              placeholder="请选择分配方式"
            >
              <el-option
                v-for="item in dis_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="角色"
            prop="participant"
            v-if="addForm.participant_type == 4"
          >
            <el-select
              style="width: 100%"
              v-model="addForm.participant"
              multiple
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="岗位"
            prop="participant"
            v-if="addForm.participant_type == 10"
          >
            <el-select
              style="width: 100%"
              v-model="addForm.participant"
              multiple
              placeholder="请选择岗位"
            >
              <el-option
                v-for="item in posts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="部门过滤"
            prop="filter_dept"
            v-if="
              addForm.participant_type == 4 ||
              addForm.participant_type == 0 ||
              addForm.participant_type == 10
            "
          >
            <el-input v-model="addForm.filter_dept" placeholder="部门字段" />
          </el-form-item>
          <!-- <el-form-item label="代码选择" prop="participant" v-if="addForm.participant_type==9">
						<el-select style="width: 100%" v-model="participants" placeholder="请选择代码">
							<el-option v-for="item in codes" :key="item.func" :label="item.name" :value="item.func">
							</el-option>
						</el-select>
					</el-form-item> -->
          <el-form-item
            label="代码名"
            prop="participant"
            v-if="addForm.participant_type == 9"
          >
            <!-- <el-select style="width: 100%" v-model="participants" placeholder="请选择代码">
							<el-option v-for="item in codes" :key="item.func" :label="item.name" :value="item.func">
							</el-option>
						</el-select> -->
            <el-input v-model="addForm.participant" placeholder="方法名" />
          </el-form-item>
          <el-form-item label="抄送给" prop="participant">
            <el-select
              style="width: 100%"
              v-model="addForm.participant_cc"
              multiple
              placeholder="请选择抄送给谁"
              filterable
            >
              <el-option
                v-for="item in staffs"
                :key="item.id"
                :label="item.name + '-' + item.phone"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段状态">
            <el-button @click="addWordStateChange">添加修改</el-button>
            <el-row
              v-for="(item, $index) in stateChange"
              :key="item + $index"
              style="margin-top: 2px"
            >
              <el-col :span="11">
                <el-select
                  style="width: 100%"
                  v-model="item.name"
                  placeholder="请选择字段"
                >
                  <el-option
                    v-for="item in fieldList"
                    :key="item.id"
                    :label="item.field_name"
                    :value="item.field_key"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="height: 1px"></el-col>
              <el-col :span="8">
                <el-select
                  style="width: 100%"
                  v-model="item.value"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="item in state_fields"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="text-align: center" v-if="$index !== 0">
                <i
                  class="el-icon-remove-outline"
                  style="color: red; font-size: 16px"
                  @click.prevent="removeStateChange($index)"
                ></i>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="到达方法" prop="on_reach_func">
            <el-input v-model="addForm.on_reach_func" placeholder="到达方法" />
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button type="danger" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="submitHandle('Form')"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "state",
  data() {
    return {
      id: sessionStorage.getItem("jinYuWorkflowId"),
      listLoading: false,
      list: null,
      type: "add",
      titleMap: {
        add: "新增",
        edit: "编辑",
        show: "查看",
      },
      participant: "",
      participants: [],
      roles: [],
      posts: [],
      staffs: [],
      stateChange: [],
      fieldList: [],
      //表单数据
      addForm: {
        name: "",
        is_hidden: false,
        sort: "",
        type: "",
        participant_cc: [],
        enable_retreat: false,
        participant_type: 0,
        distribute_type: 2, //分发类型
        state_fields: {}, //字段状态是否可写
      },
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入工作流名称" }],
      },
      options_: {
        0: "无处理",
        1: "个人",
        2: "多人",
        4: "角色",
        6: "脚本",
        7: "工单的字段",
        9: "代码获取",
        10: "岗位",
      },
      options2_: {
        1: "主动接单",
        2: "直接处理",
        3: "随机分配",
        4: "全部处理",
      },
      options: [
        {
          value: 0,
          label: "普通类型",
        },
        {
          value: 1,
          label: "初始状态",
        },
        {
          value: 2,
          label: "结束状态",
        },
      ],
      typeoptions: [
        {
          value: 0,
          label: "无处理",
        },
        {
          value: 1,
          label: "个人",
        },
        {
          value: 2,
          label: "多人",
        },
        {
          value: 4,
          label: "角色",
        },
        {
          value: 6,
          label: "脚本",
        },
        {
          value: 7,
          label: "工单的字段",
        },
        {
          value: 9,
          label: "代码获取",
        },
        {
          value: 10,
          label: "岗位",
        },
      ],
      state_fields: [
        {
          value: 1,
          label: "只读",
        },
        {
          value: 2,
          label: "必填",
        },
        {
          value: 3,
          label: "可选",
        },
        {
          value: 4,
          label: "隐藏",
        },
      ],
      dis_type_options: [
        {
          label: "主动接单",
          value: 1,
        },
        {
          label: "直接处理",
          value: 2,
        },
        {
          label: "随机分配",
          value: 3,
        },
        {
          label: "全部处理",
          value: 4,
        },
      ],
      editId: null,
      dialogVisible: false,
      dialogInitNum: 0
    };
  },
  mounted() {
    this.id = sessionStorage.getItem("jinYuWorkflowId");
    this.getList();
    this.getUsers();
    this.getRole();
    this.getPost();
    this.getField();
  },
  methods: {
    //添加字段选项
    addWordStateChange() {
      this.stateChange.push({ name: "", value: "" });
    },
    //删除字段选项
    removeStateChange(index) {
      this.stateChange.splice(index, 1);
    },
    //获取员工
    async getUsers() {
      let staffs = await this.$API.system.user.list.req({ page: 0 });
      this.staffs = staffs;
    },
    //获取角色
    async getRole() {
      let roles = await this.$API.system.role.list.req({ page: 0 });
      this.roles = roles;
    },
    //获取岗位
    async getPost() {
      let posts = await this.$API.system.post.list.req({ page: 0 });
      this.posts = posts;
    },
    //获取字段
    async getField() {
      let fieldList = await this.$API.wf.workflow.customfields.req(this.id);
      this.fieldList = fieldList;
    },
    handleAdd() {
      this.type = "add";
      this.dialogVisible = true;
      // if(this.dialogInitNum === 0){
      //   this.getUsers();
      //   this.getRole();
      //   this.getPost();
      //   this.getField();
      //   this.dialogInitNum++;
      // }
    },
    async submitHandle() {
      let that = this;
      that.isSaveing = true;
      let res = null;
      if (that.type === "add") {
        that.addForm.workflow = this.id;
        res = await that.$API.wf.state.create.req(that.addForm);
      } else {
        res = await that.$API.wf.state.update.req(that.editId, that.addForm);
      }
      if (res.err_msg) {
        that.isSaveing = false;
      } else {
        that.isSaveing = false;
        that.dialogVisible = false;
        that.getList();
      }
      // this.$refs.Form.validate((valid) => {
      // 	if (valid) {
      // 		let state_fields = {};
      // 		if (this.stateChange.length > 0) {
      // 			for (let i = 0; i < this.stateChange.length; i++) {
      // 				state_fields[this.stateChange[i].name] = this.stateChange[i].value;
      // 			}
      // 		}
      // 		this.addForm.state_fields = state_fields;
      // 		this.addForm.participant = this.addForm.participant_type === 1 ? this.participant : this.participants;
      // 		that.isSaveing = true;
      // 		let res = null;
      // 		if (that.type === 'add') {
      // 			that.addForm.workflow = this.id;
      // 			res = that.$API.wf.stateAdd.post(that.addForm)
      // 		} else {
      // 			res = that.$API.wf.stateEdit.put(that.editId, that.addForm);
      // 		}
      // 		if (res.err_msg) {
      // 			that.isSaveing = false;
      // 		} else {
      // 			that.isSaveing = false;
      // 			that.dialogVisible = false;
      // 			that.getList();
      // 		}
      // 	}
      // })
    },
    handleEdit(row) {
      this.type = "edit";
      this.editId = row.id;
      this.dialogVisible = true;
      this.addForm = Object.assign({}, row);
    },
    handleDelete(row) {
      this.$API.wf.state.delete.req(row.id).then((res) => {
        this.getList();
      });
    },
    async getList() {
      this.listLoading = true
      let res = await this.$API.wf.workflow.states.req(this.id);
      this.listLoading = false
      console.log(res);
      this.list = res;
    },
  },
};
</script>

<style scoped>
</style>
