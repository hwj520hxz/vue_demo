<template>
  <div class="role-list">
    <div class="search-bar">
      <el-form inline :model="search">
        <el-form-item label="角色名称">
          <el-input clearable v-model="search.roleName" @keyup.enter.native="onQuery"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select clearable v-model="search.status">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" icon="el-icon-search" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="table"
      v-if="grid.height"
      border
      highlight-current-row
      :height="grid.height"
      :data="grid.rows"
      v-loading="grid.loading"
      @row-click="onRowClick"
      @selection-change="val => selectedRoles =val"
    >
      <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="code" label="角色编码" width="200"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="status" align="center" label="角色状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">启用</el-tag>
          <el-tag v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-link
            style="font-size: 20px;margin: 0 5px 0 0;"
            icon="el-icon-edit-outline"
            @click="onUpdate(scope.row)"
          ></el-link>
          <el-link style="font-size: 20px;" icon="el-icon-delete" @click="onDelete(scope.row)"></el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
        layout="total, sizes, prev, pager, next"
      :page-sizes="[10,30,50]"
      :page-size="pagging.pageSize"
      :current-page="pagging.pageNum"
      :total="pagging.total"
      @size-change="onChangePageSize"
      @current-change="onChangeCurrentPage"
    />
    <el-dialog
      v-dialog
      width="640px"
      v-if="dialog.show"
      :visible.sync="dialog.show"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <div slot="title" class="title">
        <i :class="dialogMode.icon"></i>
        <span>角色维护 —— {{dialogMode.title}}</span>
      </div>
      <el-form ref="form" :rules="dialog.rules" :model="dialog.data" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色编码" prop="code">
              <el-input :disabled="dialog.mode!==1" v-model="dialog.data.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="dialog.data.name" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dialog.data.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input type="textarea" v-model="dialog.data.remark"  maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSave" icon="fa fa-save">&nbsp;保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'RoleList',
  data () {
    return {
      search: {
        status: null,
        roleName: null
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
      },
      dialog: {
        mode: null,
        show: false,
        data: {
          name: null,
          code: null,
          status: null,
          remark: null
        },
        rules: {
          code: [
            { required: true, message: '请输入角色编码' }
          ],
          name: [
            { required: true, message: '请输入角色名称' }
          ]
        }
      },
      selectedRoles: []
    }
  },
  computed: {
    dialogMode () {
      switch (this.dialog.mode) {
        case 1:
          return { title: '新增', icon: 'el-icon-document-add', message: '添加成功！' }
        case 2:
          return { title: '编辑', icon: 'el-icon-edit-outline', message: '修改成功！' }
        case 3:
          return { title: '查看', icon: 'el-icon-document' }
        default:
          return {}
      }
    }
  },
  created () {
  },
  mounted () {
    this.grid.height = this.$el.clientHeight - 75
    this.featchData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    async featchData () {
      this.grid.loading = true
      let { data } = await this.$api.pagingData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.roles',
          pageNum: this.pagging.pageNum,
          pageSize: this.pagging.pageSize,
          roleName: this.search.roleName,
          status: this.search.status
        }
      })
      this.grid.loading = false
      this.grid.rows = data.data.rows
      this.pagging.total = data.data.total
      this.pagging.pageNum = data.data.pageNum
      this.pagging.pageSize = data.data.pageSize
    },
    /**
     * 点击查询
     */
    onQuery () {
      this.pagging.pageNum = 1
      this.featchData()
    },
    /**
     * 改变当前页事件
     * @param  {number} page 页码
     */
    onChangeCurrentPage (pageNum) {
      this.pagging.pageNum = pageNum
      this.featchData()
    },
    /**
     * 改变每页显示数量事件
     * @param  {number} pageSize 页容量
     */
    onChangePageSize (pageSize) {
      this.pagging.pageNum = 1
      this.pagging.pageSize = pageSize
      this.featchData()
    },
    async onAdd () {
      let model = {
        code: moment().format('HHmmss'),
        name: null,
        remark: null,
        status: '1'
      }
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.newestCode',
          isList: false
        }
      })
      if (data.data ?.code) {
        if (Number.isInteger(parseInt(data.data.code))) {
          model.code = (parseInt(data.data.code) + 1).toString().padStart(6, '0')
        }
      }

      this.dialog.mode = 1
      this.dialog.data = model
      this.dialog.show = true
    },
    async validateBeforeDelete (row) {
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.ifUsed',
          isList: false,
          roleId: row.fid
        }
      })
      if (data.data.count > 0) {
        this.$message.info('该角色有用户在使用，不能删除！')
        return Promise.reject(new Error())
      }
    },
    async onDelete (row) {
      try {
        await this.validateBeforeDelete(row)
        this.$confirm('您确定要删除当前记录吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.remove({
            params: {
              mapperId: 'com.bosssoft.monitor.dao.RoleMapper.deleteByPrimaryKey',
              fid: row.fid
            }
          })
          this.featchData()
          this.$message.success('删除成功！')
        }).catch(() => { })
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    onUpdate (row) {
      this.dialog.mode = 2
      this.dialog.show = true
      this.dialog.data = Object.assign({}, row)
    },
    async validateBeforeSave () {
      await this.$refs['form'].validate()
      if (this.dialog.mode === 1) {
        let { data } = await this.$api.queryData({
          params: {
            mapperId: 'com.bosssoft.monitor.dao.RoleMapper.checkCode',
            isList: false,
            code: this.dialog.data.code
          }
        })
        if (data.data.count > 0) {
          this.$message.info('角色编码已存在，请重新输入！')
          return Promise.reject(new Error())
        }
      }
      return Promise.resolve()
    },
    async onSave () {
      try {
        await this.validateBeforeSave()
        if (this.dialog.mode === 1) {
          await this.$api.add({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.RoleMapper.insertSelective',
              ...this.dialog.data
            }
          })
        } else {
          let model = this.dialog.data
          await this.$api.modify({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.RoleMapper.updateByPrimaryKeySelective',
              fid: model.fid,
              name: model.name,
              status: model.status,
              remark: model.remark
            }
          })
        }
        this.dialog.show = false
        this.featchData()
        this.$message.success(this.dialogMode.message)
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    async onRowClick (row) {
      this.$refs['table'].clearSelection()
      this.$refs['table'].toggleRowSelection(row)
      this.queryMenuAndUser(row)
    },
    async queryMenuAndUser (role) {
      this.$emit('queryUser', role)
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.roleMenu',
          roleId: role.fid
        }
      })
      this.$emit('selectMenu', data.data)
    },
    toggleEnable ({ status } = {}) {
      if (this.selectedRoles.length === 0) {
        this.$message.info('请选择角色！')
        return
      }
      this.$api.modify({
        data: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.toggleEnable',
          status,
          roleIds: JSON.stringify(this.selectedRoles.map(item => item.fid))
        }
      }).then(() => {
        this.featchData()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.role-list {
  width: 100%;
  height: 100%;
}
</style>
