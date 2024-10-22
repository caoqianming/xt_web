<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addDept"
          v-auth="'dept.create'"
        ></el-button>
      </div>
      <div class="right-panel">
        <div class="right-panel-search">
          <el-input v-model="query.search" placeholder="部门名称" @keyup.enter="handleQuery"></el-input>
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
        :isTree="true"
        :apiObj="apiObj"
        row-key="id"
        @selection-change="selectionChange"
        stripe
        default-expand-all
        hidePagination
      >
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column
          label="部门名称"
          prop="name"
          min-width="200"
        ></el-table-column>
        <el-table-column label="部门类型" prop="type" min-width="200">
          <template #default="scope">
            {{ deptTypeOptions[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          prop="create_time"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="200">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="editDept(scope.row, scope.$index)"
              v-auth="'dept.update'"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delDept(scope.row, scope.$index)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                  size="small"
                  v-auth="'dept.delete'"
                  v-if="!scope.row.children"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </scTable>
    </el-main>
  </el-container>
  <el-dialog :title="titleMap[type]" v-model="limitedVisible" :width="600">
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="上级部门">
        <el-cascader
          v-model="addForm.parent"
          :options="group"
          :props="groupsProps"
          :show-all-levels="false"
          clearable
          style="width: 100%"
          @change="handleChange"
        ></el-cascader>
        <!--<el-input v-model="addForm.parent" clearable></el-input>-->
      </el-form-item>
      <!-- <el-form-item label="类型">
				<el-select v-model="addForm.type" placeholder="Select" style="width: 100%;">
					<el-option label="公司" value="company"></el-option>
					<el-option label="部门" value="dept"></el-option>
				</el-select>
			</el-form-item> -->
      <el-form-item label="排序">
        <el-input-number
          v-model="addForm.sort"
          controls-position="right"
          :min="1"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="limitedVisible = false">取 消</el-button>
      <el-button type="primary" :loading="isSaving" @click="submitHandle()"
        >保 存</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { genTree } from "@/utils/verificate";
export default {
  name: "dept",
  data() {
    return {
      dialog: {
        save: false,
        permission: false,
      },
      apiObj: this.$API.system.dept.list,
      selection: [],
      query: {},
      search: {
        keyword: null,
      },
      params: {},
      isSaving: false,
      limitedVisible: false,
      type: "add",
      titleMap: {
        add: "新增",
        edit: "编辑",
      },

      //表单数据
      addForm: {
        id: "",
        name: "",
        type: "dept",
        sort: 1,
        parent: "",
      },
      //验证规则
      rules: {
        name: [{ required: true, message: "请输入部门名称" }],
      },
      groupsProps: {
        // value: "id",
        multiple: false,
        emitPath: false,
        checkStrictly: true,
      },
      group: [],
      postList: [],
      temp: [],
      deptTypeOptions: {
        dept: "本部",
        rparty: "相关方",
      },
    };
  },

  mounted() {
    this.getGroup();
  },
  methods: {
    handleChange(value) {
      // this.menu.checked = check.checkedKeys;
      //debugger;
      console.log(value);
      console.log(this.addForm.parent);
    },
    //加载树数据
    async getGroup() {
      let res = await this.$API.system.dept.list.req({ page: 0 });
      this.group = genTree(res);
    },

    //添加
    addDept() {
      this.type = "add";
      this.limitedVisible = true;
    },
    //编辑
    editDept(row) {
      //	debugger;
      this.temp = [];
      this.type = "edit";
      this.addForm.id = row.id;
      this.addForm.name = row.name;
      this.addForm.parent = row.parent;
      this.addForm.type = row.type + "";
      this.addForm.sort = row.sort;
      this.limitedVisible = true;
    },

    //删除
    delDept(row) {
      let id = row.id;
      let res = this.$API.system.dept.delete.req(id);
      if (res.err_msg) {
        this.$message.error(res.err_msg);
      } else {
        this.$refs.table.refresh();
        this.$message.success("删除成功");
      }
    },
    submitHandle() {
      let that = this;
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.isSaveing = true;
          var res;
          if (this.type === "add") {
            this.$API.system.dept.create.req(that.addForm).then(res=>{
              this.isSaveing = false;
              this.limitedVisible = false;
              this.$refs.table.refresh();
            }).catch(res=>{this.isSaveing = false;});
          } else {
            this.$API.system.dept.update.req(
              that.addForm.id,
              that.addForm
            ).then(res=>{
              this.isSaveing = false;
              this.limitedVisible = false;
              this.$refs.table.refresh();
            }).catch(res=>{this.isSaveing = false;});
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
      this.$refs.table.queryData(this.query);
    },

    findParents(arr, parent) {
      let that = this;
      arr.forEach((item) => {
        if (item.id === parent) {
          that.temp.push(item.id);
          if (item.parent !== null) {
            this.findParents(arr, item.parent);
          } else {
            return that.temp;
          }
        }
      });
      return that.temp;
    },
    treeData(postList) {
      let posts = [];
      postList.forEach((item) => {
        let obj = new Object();
        obj.id = item.id;
        obj.sort = item.sort;
        obj.label = item.name;
        obj.type = item.type;
        obj.parent = item.parent;
        obj.create_time = item.create_time;
        posts.push(obj);
      });
      let obj = posts.reduce((res, v) => ((res[v.id] = v), res), {}); //Object
      let arr = [];
      for (let item of posts) {
        if (item.parent == null) {
          arr.push(item);
          continue;
        }
        let parent = obj[item.parent];
        parent.children = parent.children ? parent.children : [];
        parent.children.push(item);
      }
      return arr;
    },
  },
};
</script>
<style>
</style>
