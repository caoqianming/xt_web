<template>
  <el-container>
    <el-aside width="45%">
      <el-container>
        <el-header>
          <div class="left-panel">
            <div style="margin-right: 20px">岗位列表</div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="add"
			  v-auth="'post.create'"
            ></el-button>
          </div>
        </el-header>
        <el-main class="nopadding">
          <scTable
            ref="table"
            :apiObj="apiObj"
            row-key="id"
            stripe
            highlightCurrentRow
            @row-click="rowClick"
            :hidePagination="true"
          >
            <!-- <el-table-column type="selection" width="50"></el-table-column> -->
            <el-table-column label="" type="index"></el-table-column>
            <el-table-column
              label="名称"
              prop="name"
              width="130"
            ></el-table-column>
            <el-table-column
              label="标识"
              prop="code"
              width="100"
            ></el-table-column>
            <el-table-column
              label="最短在岗(h)"
              prop="min_hour"
              width="100"
            ></el-table-column>
            <el-table-column
              label="最长在岗(h)"
              prop="max_hour"
              width="100"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" align="right">
              <template #default="scope">
                <el-button
                  type="warning"
                  link
                  size="small"
                  @click.stop="table_edit(scope.row)"
				    v-auth="'post.update'"
                  >编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="table_del(scope.row)"
				    v-auth="'post.delete'"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </scTable>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left-panel">
          <div style="margin-right: 20px">岗位权限</div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addPostRole"
			 v-auth="'post.update'"
          ></el-button>
          <!-- <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            @click="delPostRole"
			 v-auth="'post.delete'"
          ></el-button> -->
        </div>
      </el-header>
      <el-main class="nopadding">
        <scTable
          ref="table2"
          :apiObj="apiObj2"
          row-key="id"
          stripe
          :hidePagination="true"
        >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column label="" type="index"></el-table-column>
          <el-table-column label="所属岗位" prop="post" min-width="80">
            <template #default="scope">{{ scope.row.post_.name }}</template>
          </el-table-column>
          <el-table-column label="拥有角色" prop="role" min-width="80">
            <template #default="scope">{{ scope.row.role_.name }}</template>
          </el-table-column>
          <el-table-column label="权限范围" prop="data_range" min-width="80">
            <template #default="scope">{{
              options[scope.row.data_range]
            }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="right">
            <template #default="scope">
             
              <el-button
                type="warning"
                link
                size="small"
                @click="postRoleDel(scope.row)"
				 v-auth="'post.update'"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </scTable>
      </el-main>
    </el-container>
  </el-container>
  <save-dialog
    v-if="dialog.save"
    ref="saveDialog"
    @success="handleSaveSuccess"
    @closed="dialog.save = false"
  ></save-dialog>
  <save-role-dialog
    v-if="dialog.roleSave"
    ref="saveRoleDialog"
    @success="handleSaveRoleSuccess"
    @closed="dialog.roleSave = false"
  ></save-role-dialog>
</template>

<script>
import saveDialog from "./post_form.vue";
import saveRoleDialog from "./post_role_form.vue";
export default {
  name: "listSon",
  components: {
    saveDialog,
    saveRoleDialog,
  },
  data() {
    return {
      apiObj: this.$API.system.post.list,
      apiObj2: null,
      query: {},
      query2: {},
      dialog: {
        save: false,
        roleSave: false,
      },
      selection: [],
      postId: "",
      options: {
        10: "全部",
        20: "自定义",
        30: "同级及以下",
        40: "本级及以下",
        50: "本级",
        60: "仅本人",
      },
    };
  },
  methods: {
    rowClick(row) {
      this.apiObj2 = this.$API.system.postrole.list;
      this.postId = row.id;
      this.$refs.table2.queryData({post: row.id                         });
    },
    //窗口新增
    add() {
      this.dialog.save = true;
      this.$nextTick(() => {
        this.$refs.saveDialog.open();
      });
    },
    //窗口编辑
    table_edit(row) {
      this.dialog.save = true;
      this.$nextTick(() => {
        this.$refs.saveDialog.open("edit").setData(row);
      });
    },
    table_del(row) {
      this.$API.system.post.delete.req(row.id).then(res=>{
        this.$refs.table.refresh()
      })
    },
    //批量删除
    async batch_del() {
      var confirmRes = await this.$confirm(
        `确定删除选中的 ${this.selection.length} 项吗？`,
        "提示",
        {
          type: "warning",
          confirmButtonText: "删除",
          confirmButtonClass: "el-button--danger",
        }
      ).catch(() => {});

      if (!confirmRes) {
        return false;
      }

      var ids = this.selection.map((v) => v.id);
      this.$refs.table.removeKeys(ids);
      this.$message.success("操作成功");
    },
    //新增岗位后更新数据
    handleSaveSuccess(data, mode) {
      //为了减少网络请求，直接变更表格内存数据
      // if (mode == "add") {
      //   this.$refs.table.unshiftRow(data);
      // } else if (mode == "edit") {
      //   this.$refs.table.updateKey(data);
      // }

      //当然也可以暴力的直接刷新表格
      this.$refs.table.refresh()
    },
    //新增岗位关系后更新数据
    handleSaveRoleSuccess() {
      this.$refs.table2.refresh();
    },
    addPostRole() {
      this.dialog.roleSave = true;
      this.$nextTick(() => {
        this.$refs.saveRoleDialog.open("add").setData({ postId: this.postId });
      });
    },
    postRoleEdit(row) {
      this.dialog.roleSave = true;
      this.$nextTick(() => {
        this.$refs.saveRoleDialog.open("edit").setData(row);
      });
    },
    delPostRole() {},
    closed() {
      this.dialog.save = false;
      this.dialog.roleSave = false;
      this.postId = "";
      this.$refs.table2.refresh();
    },
    postRoleDel(row) {
      this.$confirm(`确定删除选中的岗位关系吗？`, "提示", {
        type: "warning",
      })
        .then(() => {
          this.$API.system.postrole.delete.req(row.id).then((res) => {
            if (res.err_msg) {
              this.$message.error(res.err_msg);
            } else {
              const loading = this.$loading();
              this.$refs.table2.refresh();
              loading.close();
              this.$message.success("操作成功");
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
</style>
