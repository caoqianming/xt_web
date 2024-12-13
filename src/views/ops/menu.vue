<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-button type="primary" icon="el-icon-plus" @click="addMenu"></el-button>
      </div>
      <div class="right-panel">
        <el-input v-model="query.search" placeholder="名称/权限标识" clearable @keyup.enter="handleQuery"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"></el-button>
      </div>
    </el-header>
    <el-main class="nopadding">
      <scTable ref="table" :isTree="true" :apiObj="apiObj" :params="params" :query="query" row-key="id"
        @selection-change="selectionChange" hidePagination @dataChange="updateOptions">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="功能名" prop="name" width="200"></el-table-column>
        <el-table-column label="类型" prop="type" width="80">
          <template #default="scope">
            <span>{{ types[scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路由名" prop="route_name" width="100"></el-table-column>
        <el-table-column label="图标" prop="icon" width="150"></el-table-column>
        <el-table-column label="组件" prop="component" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="是否隐藏" width="80">
          <template #default="scope">
            <span v-show="scope.row.is_hidden">是</span>
          </template>
        </el-table-column>
        <el-table-column label="是否全屏" width="80">
          <template #default="scope">
            <span v-show="scope.row.is_fullpage">是</span>
          </template>
        </el-table-column>
        <el-table-column label="权限标识" prop="codes" min-width="100" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag v-for="i in scope.row.codes" v-bind:key="i">{{ i }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editMenu(scope.row, scope.$index)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="delMenu(scope.row, scope.$index)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </scTable>
    </el-main>
  </el-container>
  <el-dialog :title="titleMap[type]" v-model="limitedVisible" :width="600">
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" label-position="right">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="addForm.type">
          <el-radio :value="10">模块</el-radio>
          <el-radio :value="20">页面</el-radio>
          <el-radio :value="30">接口</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能名" prop="name">
        <el-input v-model="addForm.name" clearable></el-input>
      </el-form-item>
      <span v-show="addForm.type != 30">
        <el-form-item label="路由名" prop="route_name">
          <el-input v-model="addForm.route_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="addForm.icon" clearable></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="addForm.path" clearable></el-input>
        </el-form-item>
        <span v-show="addForm.type == 20">
          <el-form-item label="组件地址" prop="component">
            <el-input v-model="addForm.component" clearable></el-input>
          </el-form-item>

          <el-form-item label="是否隐藏" prop="is_hidden">
            <el-switch v-model="addForm.is_hidden"></el-switch>
          </el-form-item>
          <el-form-item label="是否全屏" prop="is_fullpage">
            <el-switch v-model="addForm.is_fullpage"></el-switch>
          </el-form-item>
        </span>
      </span>
      <el-form-item label="权限标识">
        <el-select v-model="addForm.codes" multiple filterable allow-create default-first-option
          :reserve-keyword="false" placeholder="权限标识(回车添加多个)" style="width: 100%">
          <el-option v-for="item in permCodes" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="父级">
        <el-cascader v-model="addForm.parent" :options="group" :props="groupsProps" :show-all-levels="false" clearable
          style="width: 100%" :value-on-clear="null"></el-cascader>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="addForm.sort" controls-position="right" :min="1"
          style="width: 100%"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="limitedVisible = false">取 消</el-button>
      <el-button type="primary" :loading="isSaving" @click="submitHandle()">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { genTree } from "@/utils/verificate";
const dForm = {
  codes: [],
  type: 10,
  sort: 1,
  is_hidden: false,
  is_fullpage: false,
};
export default {
  name: "dept",
  data() {
    return {
      query: {},
      dialog: {
        save: false,
        permission: false,
      },
      apiObj: this.$API.system.permission.list,
      selection: [],
      params: {
        page: 0,
      },
      isSaving: false,
      limitedVisible: false,
      type: "add",
      titleMap: {
        add: "新增",
        edit: "编辑",
      },

      //表单数据
      addForm: this.dForm,
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入名称" }],
        type: [{ required: true, message: "请选择类型" }],
      },
      types: {
        10: "模块",
        20: "页面",
        30: "接口",
      },
      groupsProps: {
        // value: "id",
        multiple: false,
        emitPath: false,
        checkStrictly: true,
      },
      group: [],
      permList: [],
      permCodes: [],
    };
  },

  mounted() {
    this.getPermCodes();
  },
  methods: {
    updateOptions(data) {
      this.group = genTree(data)
    },
    getPermCodes() {
      this.permCodes = this.$API.system.permission.codes.req();
    },
    //添加
    addMenu() {
      this.type = "add";
      this.limitedVisible = true;
      this.addForm = Object.assign({}, dForm);
      this.$nextTick(() => {
        // this.addForm = Object.assign({}, dForm);
      });
    },
    //编辑
    editMenu(row) {
      this.type = "edit";
      this.addForm = Object.assign({}, row);
      this.limitedVisible = true;
    },

    //删除
    delMenu(id) {
      this.$confirm(`确定删除吗？`, "提示", {
        type: "warning",
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
      }).then(() => {
        this.$API.system.permission.delete.req(id).then((res) => {
          this.$refs.table.refresh();
        });
      });
    },
    submitHandle() {
      let that = this;
      this.$refs.addForm.validate((valid) => {
        //	debugger;
        if (valid) {
          this.isSaveing = true;
          if (this.type === "add") {
            this.$API.system.permission.create
              .req(that.addForm)
              .then((res) => {
                this.isSaveing = false;
                this.limitedVisible = false;
                this.$refs.table.refresh();
              })
              .catch((e) => {
                this.isSaveing = false;
              });
          } else {
            this.$API.system.permission.update
              .req(that.addForm.id, that.addForm)
              .then((res) => {
                this.isSaveing = false;
                this.limitedVisible = false;
                this.$refs.table.refresh();
              })
              .catch((e) => {
                this.isSaveing = false;
              });
          }
        }
      });
    },
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection;
    },
    //搜索
    handleQuery() {
      this.$refs.table.queryData(this.query)
    },
    //本地更新数据
    handleSaveSuccess(data, mode) {
      if (mode == "add") {
        this.$refs.table.refresh();
      } else if (mode == "edit") {
        this.$refs.table.refresh();
      }
    },
  },
};
</script>

<style>
.formAddButton {
  width: 32px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
  border-radius: 16px;
  position: absolute;
  right: 0;
  top: 0;
}

.formSaveButton,
.formDelButton {
  padding: 0;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 15px;
  position: absolute;
  left: 20px;
  top: 0;
}

.formDelButton {
  left: 60px;
}
</style>
