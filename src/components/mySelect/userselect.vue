<template>
  <div style="display:flex;row nowrap">
    <!-- <el-tag
      v-for="user in userData"
      :key="user.id"
    >
      {{ user.name }}
    </el-tag>-->
    <el-button
      v-if="selectable"
      type="primary"
      circle
      size="mini"
      icon="el-icon-plus"
      @click="showDialog()"
    />
  </div>

  <el-dialog
    title="选择账号"
    width="70%"
    v-model="dialoguser"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
  <el-row :gutter="4">
    <el-col :md="multiple?18:24" :sm="24">
      <el-card header="账号列表" shadow="never">
              <el-row >
                <el-col :md="6" :sm="24">
          <el-select v-model="userTypeChecked" placeholder="人员类型" @change="handleQuery" :multiple="true">
            <el-option v-for="item in choseTypeOptions" :key="item"       :label="item.label"
      :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :md="6" :sm="24">
          <el-cascader style="width:90%" v-model="query.depts" :options="deptdata" clearable placeholder="部门/单位" @change="handleQuery" :show-all-levels="false" :props="{emitPath:false,checkStrictly: true}"/>
        </el-col>
        <el-col :md="6" :sm="24">
          <el-cascader style="width:90%" v-model="query.posts" :options="postdata" clearable placeholder="岗位" @change="handleQuery" :show-all-levels="false" :props="{emitPath:false}"/>
        </el-col>
<el-col :md="6" :sm="24">
  <div style="display:flex">
  <el-input
              v-model="query.search"
              placeholder="账户/姓名"
              clearable
              @keyup.enter="handleQuery"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery"
            ></el-button>
            </div>
</el-col>
      </el-row>


          <scTable
            ref="table"
            :apiObj="apiObj"
            :params="params"
            row-key="id"
            @selection-change="selectionChange"
            stripe
            hideDo
            height="400px"
            @resetQuery="resetQuery"
            @row-click="rowClick"
          >
            <el-table-column type="selection" width="50" v-if="multiple" :reserve-selection="true"></el-table-column>
            <el-table-column
              label="#"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>

            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="部门" prop="belong_dept_name"></el-table-column>
            <el-table-column label="账号类型" prop="type">
              <template #default="scope">
                <span>{{userTypeOptions[scope.row.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="create_time"
            ></el-table-column>
          </scTable>
                </el-card>
    </el-col>
    <el-col :md="6" :sm="24" v-if="multiple">
<el-card shadow="never">
      <template #header>
      <div class="card-header">
        <span>已选人员</span>
        <el-button type="danger" @click="clearChose" size="small">清空</el-button>
      </div>
    </template>
    <el-tag v-for="item, index in selection" v-bind:key="item.id" style="margin-right:4px; margin-top: 4px" size="large">{{index+1}}-{{item.name}}</el-tag>
</el-card>
    </el-col>
  </el-row>
    <!-- <el-row>
      <el-col :md="16" :sm="24">
        <el-header style="border-bottom: none">
          <div class="left-panel">
            
          </div>
          <div class="right-panel">
            <el-button type="primary" icon="el-icon-plus" @click="addUser" v-if="multiple"
              >添加选择</el-button>
          </div>
        </el-header>
        <el-main class="nopadding">
        </el-main>
        <el-row style="padding-top: 8px">
          <el-col :md="16" :sm="24" v-if="multiple">
            <span style="font-weight:bold">已选人员:</span>{{username}}
          </el-col>
          </el-row>
      </el-col>
            <el-col :md="8" :sm="24">
        <el-main class="nopadding">
          <el-tabs type="border-card" stretch="true">
            <el-tab-pane label="按部门分类">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>

              <el-tree
                class="filter-tree"
                style="padding-top: 15px"
                :data="deptdata"
                default-expand-all
                :filter-node-method="filterNode"
                ref="tree"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="按岗位分类">
              <el-input placeholder="输入关键字进行过滤" v-model="filterTexts">
              </el-input>

              <el-tree
                class="filter-tree"
                style="padding-top: 15px"
                :data="postdata"
                default-expand-all
                :filter-node-method="filterNodes"
                ref="tree"
                @node-click="handleNodeClicks"
              >
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-col>
    </el-row> -->
    <template #footer v-if="multiple">
      <el-button @click="dialoguser = false"
            >取消</el-button>
          <el-button
            v-if="mode != 'show'"
            type="primary"
            :loading="isSaveing"
            @click="confirm()"
            >确定</el-button >
    </template>
  </el-dialog>
</template>
    <script>
import { genTree } from "@/utils/verificate";
export default {
  name: "userChoose",
  components: {},
  props: {
    value: {
      // 接受外部v-model传入的值
      type: [String],
      default: "",
    },
    user: {
      // 接受外部v-model传入的值
      type: [String],
      default: "",
    },
    closable: {
      // 是否可以关闭标签
      type: Boolean,
      default: () => {
        return true;
      },
    },
    selectable: {
      // 是否可选人员
      type: Boolean,
      default: () => {
        return true;
      },
    },
    listIndex:{
      // index
      type: Number,
      default: () => {
        return null;
      },
    },
    multiple: {
      // 是否多选,默认可以多选
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      apiObj: this.$API.system.user.list,
      params: {is_active:true},
      query: {
        is_active:true,
      },
      selection: [],
      filterText: "",
      filterTexts: "",
      deptdata: [],
      postdata: [],
      username: [],
      userData: [],
      dialoguser: false,
      dataValue: this.value,
      choseData: {},
      userTypeChecked: [],
      choseTypeOptions: [
        {
          value: 'employee',
          label: '正式员工'
        },
        {
          value: 'remployee',
          label: '相关方'
        },
        {
          value: 'visitor',
          label: '访客'
        },
        {
          value: 'driver',
          label: '货车司机'
        }
      ],
      userTypeOptions :{
        'employee': '正式员工',
        'remployee': '相关方',
        'visitor': '访客'
      }
    };
  },
  mounted() {
    debugger;
    console.log('this.listIndex')
    console.log(this.listIndex)
    this.getDept();
    this.getPost();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTexts(val) {
      this.$refs.tree.filter(val);
    },
    dataValue(val) {
      this.$emit("input", val);
      console.log(val);
    },
    userData(val) {
      if (val) {
        this.change();
      }
    },
  },
  methods: {
    showDialog() {
      this.dialoguser = true;
      // this.$nextTick(function () {
      //   this.apiObj.map((item) => {
      //     if (item.id === this.user) {
      //       this.$refs.table.toggleRowSelection(item, true);
      //     }
      //   });
      // });
    },
    //加载人员
    handleQuery() {
      this.query.type__in = null;
      if(this.userTypeChecked){
        this.query.type__in = this.userTypeChecked.join(',')
      }
      this.$refs.table.queryData(this.query)
    },
    //加载部门树数据
    async getDept() {
      let res = await this.$API.system.dept.list.req({ page: 0, type__in:'dept, rparty' });
      this.deptdata = genTree(res);
    },
    //加载岗位树数据
    async getPost() {
      let res = await this.$API.system.post.list.req({ page: 0 });
      this.postdata = genTree(res);
    },
    // filterNode(value, data) {
    //   console.log(value);
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    // filterNodes(value, data) {
    //   console.log(value);
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    // //部门点击显示对应的人员
    // handleNodeClick(data) {
    //   this.query.depts = data.id
    //   this.handleQuery()
    // },
    // //岗位点击显示对应的人员
    // handleNodeClicks(data) {
    //   this.query.posts = data.id
    //   this.handleQuery()
    // },
    rowClick(row, column, event){
      if(!this.multiple){
        if(this.listIndex!==null){
        data.
        this.choseData = row;
        this.choseData.listIndex = this.listIndex;
        this.$emit("submit", this.choseData);
        this.dialoguser=false
      }else{
        this.choseData = row;
        this.$emit("submit", this.choseData);
        this.dialoguser=false
      }
        
      }
    },
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection;
    },
    //删除Tag
    // closeTag(name) {
    //   this.userData.splice(this.userData.indexOf(name), 1);
    // },

    // addUser() {
    //   this.username = [];
    //   this.userData = [];
    //   if (!this.multiple && this.selection.length > 1) {
    //     this.$message.error("对应的人员只允许选择一人！");

    //     return;
    //   }
    //   if (!this.selection || this.selection.length === 0) {
    //     this.msgError("请选择至少一个人员！");
    //     return;
    //   }
    //   this.selection.forEach((item) => {
    //     this.username.push(item.name);

    //     this.userData.push({ id: item.id, name: item.name });
    //   });
    //   console.log(this.userData);
    // },

    // change() {
    //   if (this.tags) {
    //     alert(1);
    //     this.dataValue = this.userData.map((e) => e.id).join(",");
    //     console.log(this.dataValue);
    //     this.$emit("change", this.dataValue);
    //   }
    // },
    clearChose() {
      this.$refs.table.clearSelection()
    },
    confirm() {
      this.dialoguser = false;
      // this.change(); // 触发值变化
      // this.dataValue = this.userData.map((e) => e.id).join(",");
      let data = this.selection;
      if(this.listIndex!==null){
        data.listIndex = this.listIndex;
        debugger;
        console.log(this.listIndex);
        console.log(data);
        this.$emit("submit",data);
      }else{
        this.$emit("submit",data);
      }
      
    },
    //权限设置
    // permission() {
    //   this.dialog.permission = true;
    //   this.$nextTick(() => {
    //     this.$refs.permissionDialog.open();
    //   });
    // },

    resetQuery() {
      this.query = {};
    },
  },
};
</script>
<style scoped>
.card-header{
display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
