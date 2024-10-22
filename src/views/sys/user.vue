<template>
  <el-container>
    <el-aside width="300px" v-loading="showGrouploading">
      <el-container>
        <el-header style="border-bottom: none">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="groupFilterText"
            clearable
          ></el-input>
        </el-header>
        <el-main class="nopadding">
          <el-tree
            ref="group"
            class="menu"
            node-key="id"
            :data="group"
            :current-node-key="''"
            :default-expanded-keys="idArr"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="groupFilterNode"
            @node-click="groupClick"
          ></el-tree>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left-panel">
          <el-button
            type="primary"
            icon="el-icon-plus"
            v-auth="'user.create'"
            @click="add"
          ></el-button>
          <el-select
            v-model="query.type"
            placeholder="账号类型"
            @change="handleQuery"
            clearable
            style="margin-left: 2px"
          >
            <el-option
              v-for="item in userTypeOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="query.is_deleted"
            placeholder="筛选"
            @change="handleQuery"
            clearable
            style="margin-left: 2px"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="在用" :value="deletedIs"></el-option>
            <el-option label="已删" :value="isDeleted"></el-option>
          </el-select>
        </div>
        <div class="right-panel">
          <div class="right-panel-search">
            <el-input
              v-model="query.search"
              placeholder="登录账号 / 姓名"
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
          stripe
          remoteSort
          remoteFilter
          @selection-change="selectionChange"
        >
          <el-table-column
						type="index"
						width="50"
					></el-table-column>
          <!-- <el-table-column label="ID" prop="id" width="160"></el-table-column> -->
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="登录账号" prop="username" width="140"></el-table-column>
          <el-table-column label="是否启用" prop="is_active">
            <template #default="scope">
              <el-tag type="danger" v-if="scope.row.is_deleted">已删</el-tag>
              <el-tag v-else type="success">在用</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="微信通知" width="80">
            <template #default="scope">
              <el-icon v-if="scope.row.wx_openid" color="green"
                ><CircleCheckFilled
              /></el-icon>
              <el-icon v-else color="red"><CircleCloseFilled /></el-icon>
            </template>
          </el-table-column> -->
		  <el-table-column label="账号类型" prop="type">
              <template #default="scope">
                <span>{{userTypeOptions[scope.row.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="belong_dept_name" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="岗位" prop="post_name">
            </el-table-column>
          <!-- <el-table-column label="小程序" width="80">
            <template #default="scope">
              <el-icon v-if="scope.row.wxmp_openid" color="green"
                ><CircleCheckFilled
              /></el-icon>
              <el-icon v-else color="red"><CircleCloseFilled /></el-icon>
            </template>
          </el-table-column> -->
          <el-table-column
            label="创建时间"
            prop="create_time"
            width="160"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-button
                type="primary"
                link
                size="small"
                v-if="!query.is_deleted"
                @click="formSetting(scope.row)"
                v-auth="'user.update'"
              >
                设置
              </el-button>

              <el-button
                link
                size="small"
                type="warning"
                @click="formEdit(scope.row, '2')"
                v-auth="'user.update'"
              >
                编辑
              </el-button>
              <el-button
                link
                size="small"
                type="danger"
                v-if="!query.is_deleted"
                @click="formReset(scope.row)"
                v-auth="'user.update'"
              >
                重置密码
              </el-button>
              <!-- <el-popconfirm
                title="确定删除吗？"
                @confirm="table_del(scope.row, scope.$index)"
              >
                <template #reference>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    v-auth="'user.delete'"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm> -->
            </template>
          </el-table-column>
        </scTable>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog :title="titleMap[type]" v-model="limitedVisible" :width="600">
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      label-position="left"
    >
              <el-form-item label="账户类型：" prop="type">
                <el-select v-model="addForm.type" placeholder="账号类型">
                  <el-option
                    v-for="item in userTypeOptions2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
      <el-form-item label="登录账号" prop="username">
        <el-input
          v-model="addForm.username"
          placeholder="用于登录系统"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="addForm.name"
          placeholder="请输入完整的真实姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input
          v-model="addForm.phone"
          placeholder="请输入手机号码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-switch active-color="#f56c6c" v-model="addForm.is_deleted" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="limitedVisible = false">取 消</el-button>
      <el-button
        v-if="type !== 'show'"
        type="primary"
        :loading="isSaveing"
        @click="submit()"
        >保 存
      </el-button>
    </template>
  </el-dialog>
  <save-dialog
    v-if="dialog.save"
    ref="saveDialog"
    @success="handleSaveSuccess"
    @closed="settingClose"
  ></save-dialog>
</template>

<script>
import baseUrl from "@/config";
import { genTree } from "@/utils/verificate";
import saveDialog from "./user_form.vue";
import { CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue";
//	import certDialog from './cert_form.vue'
export default {
  name: "user",
  components: {
    saveDialog,
    //	certDialog,
  },
  data() {
    return {
      dialog: {
        save: false,
        //	certSave:false,
      },
      isDeleted: true,
      deletedIs: false,
      query: {is_deleted:''},
      baseUrl: baseUrl.API_URL,
      type: "add",
      titleMap: {
        add: "新增用户",
        edit: "编辑用户",
        show: "查看",
      },
      //表单数据
      addForm: {
        username: "",
        name: "",
        phone: null,
        // belong_dept: [],
        is_active: true,
        type: "employee"
      },
      //验证规则
      rules: {
        username: [{ required: true, message: "请输入登录账号" }],
        name: [{ required: true, message: "请输入真实姓名" }],
        type: [{ required: true, message: "请选择所属账号类型" }],
      },
      //所需数据选项
      groups: [],
      groupsProps: {
        value: "id",
        multiple: false,
        checkStrictly: true,
      },
      isSaveing: false,
      limitedVisible: false,
      showGrouploading: false,
      groupFilterText: "",
      group: [],
      userList: [],
      selection: [],
      search: {
        name: null,
      },
      imageUrl: "",
      filterParams: {},
      tableParams: {},
      apiObj: this.$API.system.user.list,
      temp: [],
      postList: [],
	    userTypeOptions :{
        'employee': '正式员工',
        'remployee': '相关方',
        'visitor': '访客',
        'driver':'货车司机'
      },
      userTypeOptions2: [
        {label:"正式员工", value:"employee"},
        {label:"相关方", value:"remployee"},
        {label:"访客", value:"visitor"},
        {label:"货车司机", value:"driver"}
      ],
	  idArr: []
    };
  },
  watch: {
    groupFilterText(val) {
      this.$refs.group.filter(val);
    },
  },
  mounted() {
    this.getGroup();
  },
  methods: {
    settingClose(){
      this.dialog.save = false;
      this.$refs.table.refresh();
    },
    //加载树数据
    async getGroup() {
      let res = await this.$API.system.dept.list.req({ page: 0 });
      this.group = genTree(res);
	  this.group.forEach(m=>{
		this.idArr.push(m.id)
	  })
    },
    getImgUrl(img) {
      return "http://49.232.14.174:2226" + img;
    },
    //添加
    add() {
      this.type = "add";
      this.limitedVisible = true;
      this.addForm = {};
    },
    //重置密码
    formReset(row){
      this.$confirm(`确认重置密码吗？`,'提示', {
					type: 'warning',
					confirmButtonText: '重置',
					confirmButtonClass: 'el-button--danger'
				}).then(() => {
          this.$API.system.user.rPassword.req(row.id).then(res=>{
            this.$message.success("重置成功");
          }).catch(err=>{
            this.$message.danger(err);
          })
        })
    },
    //编辑
    formEdit(row, index) {
      console.log(row);
      this.limitedVisible = true;
      if (index === "1") {
        this.type = "show";
      } else {
        this.type = "edit";
      }
      this.addForm.id = row.id;
      this.addForm.name = row.name;
      this.addForm.username = row.username;
      this.addForm.phone = row.phone;
      this.addForm.is_active = row.is_active;
      this.addForm.type = row.type;
    },
    formSetting(row) {
      this.dialog.save = true;
      this.$nextTick(() => {
        this.$refs.saveDialog.open().setData(row);
      });
    },
    //添加证书
    //Addcertificate(row){
    //  this.dialog.certSave = true;
    //	this.$nextTick(() => {
    //		this.$refs.certDialog.open().setData(row)

    //	})

    //	},
    //查看
    table_show(row) {
      this.limitedVisible = true;
      this.type = "show";
      this.addForm.id = row.id;
    },
    //删除
    async table_del(row) {
      let res = await this.$API.system.user.delete.req(row.id);
      if (res.err_msg) {
        this.$message.error(res.err_msg);
      } else {
        this.$refs.table.refresh();
        this.$message.success("删除成功");
      }
    },
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection;
    },

    //树过滤
    groupFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //树点击事件
    groupClick(data) {
      console.log(data);
      //	debugger;
      this.$refs.table.queryData({ depts: data.id });
    },
    //搜索
    handleQuery() {
      this.$refs.table.queryData(this.query);
    },
    //表单提交方法
    submit() {
      //	debugger;
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.isSaveing = true;
          let res;

          if (this.type === "add") {
            res = await this.$API.system.user.create.req(this.addForm);
          } else if (this.type === "edit") {
            res = await this.$API.system.user.update.req(
              this.addForm.id,
              this.addForm
            );
          }
          this.isSaveing = false;
          if (res.err_msg) {
            this.$message(res.err_msg);
          } else {
            this.limitedVisible = false;
			this.$refs.table.refresh()
            this.$message.success("操作成功");
          }
        } else {
          return false;
        }
      });
    },

    //本地更新数据
    handleSaveSuccess() {
      this.$refs.table.refresh();
    },
  },
};
</script>

<style></style>
