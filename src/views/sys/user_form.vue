<template>
  <el-drawer
    title="用户岗位关系"
    v-model="visible"
    :size="1000"
    destroy-on-close
    @closed="closeDrawer"
  >
    <el-container v-loading="loading">
      <!--<sc-title title="详细信息"></sc-title>-->
      <el-main style="padding: 0 20px 20px 20px">
        <el-form
          ref="dialogForm"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-row>
            <el-col :md="12" :sm="24">
              <el-form-item label="姓名：" prop="name">
                <span>{{ form.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="登录账号：" prop="name">
                <span>{{ form.username }}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="手机号：" prop="phone">
                <span>{{ form.phone }}</span>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="24">
              <el-form-item label="是否启用：">
                <span>{{ job_states[form.is_active] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--drag-sort -->
        <sc-form-table
          v-model="userPostForm.list"
          :addTemplate="addTemplate"
          placeholder="暂无数据"
        >
          <!-- <el-table-column prop="val" label="名称" min-width="150">
						<template #default="scope">
							<span v-if="scope.row.id">{{scope.row.name}}</span>
							<el-input v-else v-model="scope.row.name" placeholder="名称"></el-input>
						</template>
					</el-table-column> -->
          <el-table-column prop="val" label="排序" min-width="80">
            <template #default="scope">
              <span v-if="scope.row.id">{{ scope.row.sort }}</span>
              <el-input
                v-else
                v-model="scope.row.sort"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="部门" min-width="150">
            <template #default="scope">
              <span v-if="scope.row.id && scope.row.dept_">{{
                scope.row.dept_.name
              }}</span>
              <el-cascader
                v-else
                v-model="scope.row.dept"
                :options="group"
                :props="groupsProps"
                :show-all-levels="false"
                clearable
                style="width: 100%"
                @change="groupsProps"
              ></el-cascader>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="岗位" min-width="150">
            <template #default="scope">
              <span v-if="scope.row.id">{{ scope.row.post_.name }}</span>
              <el-select
                v-else
                v-model="scope.row.post"
                filterable
                placeholder="请选择所在岗位"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="open" label="操作" width="80" align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.id"
                text
                type="danger"
                size="small"
                @click="userPostDel(scope.row.id)"
                >删除</el-button
              >
              <el-button
                v-else
                text
                type="primary"
                size="small"
                @click="createUserPost(scope.row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
        </sc-form-table>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import { genTree } from "@/utils/verificate";
export default {
  emits: ["success", "closed"],
  data() {
    return {
      addTemplate: {
        name: "",
        sort: "",
        user: "",
        post: "",
        dept: "",
      },
      userPostForm: {
        title: "用户/岗位关系",
        list: [],
      },
      loading: false,
      job_states: { true: "启用", false: "禁用" },
      visible: false,
      isSaveing: false,
      form: {},
      addForm: {
        name: "",
        sort: "",
        user: "",
        post: "",
        dept: [],
      },
      groupsProps: {
        // value: "id",
        multiple: false,
        emitPath: false,
        checkStrictly: true,
      },
      group: [],
      postOptions: [],
      selectionFilters: [],
      filtersAddTemplate: {
        text: "",
        value: "",
      },
      setFiltersVisible: false,
    };
  },
  mounted() {
    this.getPosts();
    this.getGroup();
  },
  methods: {
    getPosts() {
      this.$API.system.post.list.req({ page: 0 }).then((res) => {
        if (res.err_msg) {
          this.$message.error(res.err_msg);
        } else {
          this.postOptions = res;
        }
      });
    },
    //加载树数据
    async getGroup() {
      let res = await this.$API.system.dept.list.req({ page: 0 });
      this.group = genTree(res);
    },
    //显示
    open(mode) {
      this.mode = mode;
      this.visible = true;
      return this;
    },
    //表单注入数据
    setData(data) {
      debugger;
      Object.assign(this.form, data);
      this.getUserPostList();
    },
    closeDrawer() {
      this.visible = false;
      this.$emit("closed");
    },
    handleChange(value) {
      debugger;
      console.log(value);
      console.log(this.addForm.parent);
    },

    //设置过滤项
    setFilters(filters) {
      this.selectionFilters = filters;
      this.setFiltersVisible = true;
    },
    /////
    //用户岗位关系列表
    getUserPostList() {
      debugger;
      console.log(this.form.id);
      let obj = { user: this.form.id, page: 0 };
      this.$API.system.userPost.list.req(obj).then((res) => {
        this.userPostForm.list = res;
      });
    },
    //新增用户岗位关系
    createUserPost(row) {
      debugger;
      console.log(row);
      this.isSaveing = true;
      row.user = this.form.id;
      this.$API.system.userPost.create.req(row).then((res) => {
        this.getUserPostList();
        this.$message.success("操作成功");
      });
    },
    //用户岗位关系删除
    userPostDel(id) {
      this.$confirm(`确定删除该岗位关系吗？`, "提示", {
        type: "warning",
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
      }).then(() => {
        this.$API.system.userPost.delete.req(id).then((res) => {
          this.getUserPostList();
          this.$message.success("操作成功");
        });
      });
    },
  },
};
</script>

<style>
</style>
