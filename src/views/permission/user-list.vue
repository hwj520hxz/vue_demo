<template>
  <div class="user-list">
    <div class="tool-bar">
      <el-link icon="el-icon-document-add" @click="$emit('beforeAddRoleUser')">新增角色用户</el-link>&nbsp;
    </div>
    <el-table
      border
      v-if="grid.height"
      :height="grid.height"
      :data="grid.rows"
      v-loading="grid.loading"
    >
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" label="用户名称" width="200"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userCode" label="角色账号" width="120"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="identityCode"
        align="center"
        label="身份证号"
        width="130"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="mobileNo" align="center" label="手机号" width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mainOrg" label="所属机构" width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mainPosition" label="所属岗位"></el-table-column>
      <el-table-column align="center" width="50" label="操作">
        <template slot-scope="scope">
          <el-link style="font-size: 20px;" icon="el-icon-delete" @click="onDelete(scope.row)"></el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialog
      width="900px"
      :visible.sync="dialog.show"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @open="onDialogOpen"
    >
      <div slot="title" class="title">
        <i class="el-icon-document-add"></i>
        <span>角色用户 —— 新增</span>
      </div>
      <div class="search-bar">
        <el-form inline :model="dialog.search">
          <el-form-item label="用户名称">
            <el-input clearable v-model="dialog.search.userName" @keyup.enter.native="onQuery"></el-input>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input clearable v-model="dialog.search.userCode" @keyup.enter.native="onQuery"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="onQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="userTable"
        border
        :height="365"
        :data="dialog.grid.rows"
        v-loading="dialog.grid.loading"
        @selection-change="val => selectedUsers =val"
        @row-click="row => $refs['userTable'].toggleRowSelection(row)"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" label="用户名称" width="200"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userCode" label="用户账号" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mainOrg" label="所属机构" width="200"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mainPosition" label="所属岗位"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10,30,50]"
        :page-size="dialog.pagging.pageSize"
        :current-page="dialog.pagging.pageNum"
        :total="dialog.pagging.total"
        @size-change="onChangePageSize"
        @current-change="onChangeCurrentPage"
      />
      <div slot="footer">
        <el-button type="primary" @click="onSave" icon="fa fa-save">&nbsp;保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserList',
  data () {
    return {
      grid: {
        rows: [],
        height: null,
        loading: false
      },
      dialog: {
        show: false,
        search: {
          userName: null,
          userCode: null
        },
        grid: {
          rows: [],
          height: null,
          loading: false
        },
        pagging: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      },
      selectedUsers: []
    }
  },
  created () {
  },
  mounted () {
    this.grid.height = this.$el.clientHeight - 32
  },
  methods: {
    /**
     * 获取列表数据
     */
    async featchRoleUser (role) {
      this.grid.loading = true
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.roleUser',
          roleId: role.fid
        }
      })
      this.grid.loading = false
      this.grid.rows = data.data
    },
    /**
     * 获取列表数据
     */
    async featchData () {
      this.dialog.grid.loading = true
      let { data } = await this.$api.pagingData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.UserMapper.userList',
          pageNum: this.dialog.pagging.pageNum,
          pageSize: this.dialog.pagging.pageSize,
          userName: this.dialog.search.userName,
          userCode: this.dialog.search.userCode
        }
      })
      this.dialog.grid.loading = false
      this.dialog.grid.rows = data.data.rows
      this.dialog.pagging.total = data.data.total
      this.dialog.pagging.pageNum = data.data.pageNum
      this.dialog.pagging.pageSize = data.data.pageSize
    },
    /**
     * 点击查询
     */
    onQuery () {
      this.dialog.pagging.pageNum = 1
      this.featchData()
    },
    /**
     * 改变当前页事件
     * @param  {number} page 页码
     */
    onChangeCurrentPage (pageNum) {
      this.dialog.pagging.pageNum = pageNum
      this.featchData()
    },
    /**
     * 改变每页显示数量事件
     * @param  {number} pageSize 页容量
     */
    onChangePageSize (pageSize) {
      this.dialog.pagging.pageNum = 1
      this.dialog.pagging.pageSize = pageSize
      this.featchData()
    },
    onDialogOpen () {
      this.dialog.search.userName = null
      this.dialog.search.userCode = null
      this.onQuery()
    },
    async validateBeforeSave () {
      if (this.selectedUsers.length === 0) {
        this.$message.info('请选择要添加的用户！')
        return Promise.reject(new Error())
      }
      return Promise.resolve()
    },
    async onSave () {
      try {
        await this.validateBeforeSave()
        this.$emit('addRoleUser', this.selectedUsers)
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    async onDelete (row) {
      try {
        this.$confirm('您确定要删除当前用户吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('removeRoleUser', [row.userId])
        }).catch(() => { })
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-list {
  width: 100%;
  height: 100%;
}
</style>
