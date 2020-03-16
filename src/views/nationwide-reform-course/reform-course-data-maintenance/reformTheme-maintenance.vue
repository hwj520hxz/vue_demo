<template>
  <div class="reformTheme-maintenance">
    <div class="tool-bar">
      <el-link icon="el-icon-document-add" @click="onAdd">新增</el-link>
      <div class="split-line"></div>
      <el-link icon="el-icon-circle-check" @click="toggleEnable(1)">前端展示</el-link>
      <div class="split-line"></div>
      <el-link icon="el-icon-circle-close" @click="toggleEnable(0)">取消前端展示</el-link>
    </div>
    <div class="reformTheme-container">
      <el-table
        border
        ref="table"
        :data="grid.rows"
        :height="grid.height"
        highlight-current-row
        v-loading="grid.loading"
        @row-click="onRowClick"
        @selection-change="val => grid.selectedRow =val"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="reformDate" label="改革时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column
          width="100"
          align="center"
          prop="status"
          label="是否前端展示"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '1'" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="light" placement="bottom-start" content="查看" :enterable="false">
              <el-link
                style="font-size: 20px;margin: 0 5px 0 0;"
                icon="el-icon-view"
                @click="onView(scope.row)"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="light" placement="bottom-start" content="编辑" :enterable="false">
              <el-link
                style="font-size: 20px;margin: 0 5px 0 0;"
                icon="el-icon-edit-outline"
                @click="onUpdate(scope.row)"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="light" placement="bottom-start" content="删除" :enterable="false">
              <el-link
                style="font-size: 20px;margin: 0 5px 0 0;"
                icon="el-icon-delete"
                @click="onDelete(scope.row)"
              ></el-link>
            </el-tooltip>
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
      ></el-pagination>
    </div>
    <el-dialog
      v-dialog
      width="700px"
      v-if="dialog.show"
      :visible.sync="dialog.show"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <div slot="title" class="title">
        <i :class="dialogMode.icon"></i>
        <span>改革主题维护 —— {{dialogMode.title}}</span>
      </div>
      <el-form :disabled="dialog.mode === 3" ref="form" :rules="dialog.rules" :model="dialog.data" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="改革时间" prop="reformDate">
              <el-date-picker
                type="month"
                style="width: 100%;"
                placeholder="选择日期"
                v-model="dialog.data.reformDate"
                value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                placeholder="请输入内容"
                v-model="dialog.data.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编制人" prop="userName">
              <el-input disabled v-model="dialog.data.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制时间" prop="createTime">
              <el-date-picker
                disabled
                v-model="dialog.data.createTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-show="dialog.mode !== 3" type="primary" @click="onSave" icon="fa fa-save">&nbsp;保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: '',
  data () {
    return {
      grid: {
        rows: [],
        height: null,
        loading: false,
        selectedRow: []
      },
      pagging: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialog: {
        mode: null,
        show: false,
        valueBeforeUpdate: {
          reformDate: null
        },
        data: {
          reformDate: null,
          remark: null,
          status: null,
          userId: null,
          userName: null,
          createTime: null
        },
        rules: {
          reformDate: [
            { required: true, message: '请选择改革时间！', trigger: 'blur' }
          ]
        }
      }
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
    this.featchData()
  },
  mounted () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    async featchData () {
      this.grid.loading = true
      let { data } = await this.$api.pagingData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.DevCourseMapper.queryDevCourse',
          pageNum: this.pagging.pageNum,
          pageSize: this.pagging.pageSize
        }
      })
      this.grid.loading = false
      this.grid.rows = data.data.rows
      this.pagging.total = data.data.total
      this.pagging.pageNum = data.data.pageNum
      this.pagging.pageSize = data.data.pageSize
    },
    onQuery () {
      this.pagging.pageNum = 1
      this.featchData()
    },
    onChangeCurrentPage (pageNum) {
      this.pagging.pageNum = pageNum
      this.featchData()
    },
    onChangePageSize (pageSize) {
      this.pagging.pageNum = 1
      this.pagging.pageSize = pageSize
      this.featchData()
    },
    /**
     启用 停用 操作
     */
    async toggleEnable (status) {
      if (this.grid.selectedRow.length === 0) {
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message.info('请选择主题！')
        }
        return
      }
      await this.$api.modify({
        data: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.DevCourseMapper.toggleEnable',
          status,
          ids: JSON.stringify(this.grid.selectedRow.map(item => item.id))
        }
      })
      this.featchData()
    },
    async validateBeforeAdd () {
      // if (!this.curTarget) {
      //   this.$message.info('请选择对应的类别进行新增！')
      //   return Promise.reject(new Error())
      // }
      return Promise.resolve()
    },
    async onAdd () {
      try {
        await this.validateBeforeAdd()
        let model = {
          reformTheme: '',
          reformDate: moment().format('YYYY-MM'),
          remark: '',
          userId: this.$store.state.user.userInfo.userId,
          userName: this.$store.state.user.userInfo.userName,
          createTime: moment().format('YYYY-MM-DD')
        }
        this.dialog.mode = 1
        this.dialog.show = true
        this.dialog.data = model
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    onView (row) {
      this.dialog.mode = 3
      this.dialog.show = true
      this.dialog.data = Object.assign({}, row)
    },
    async validateBeforeDelete (row) {
      // if (this.grid.selectedRow.length === 0) {
      //   this.$message.info('请选择要删除的记录！')
      //   return Promise.reject(new Error())
      // }
      return Promise.resolve()
    },
    async onDelete (row) {
      try {
        await this.validateBeforeDelete(row)
        this.$confirm('您确定要删除当前选中的记录以及下属改革事件吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.deleteDevCourse({
            params: {
              id: row.id
            }
          })
          this.featchData()
          this.$message.success('删除成功！')
          this.$emit('refreshDetail')
        }).catch(() => { })
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    onUpdate (row) {
      this.dialog.mode = 2
      this.dialog.show = true
      row.createTime = moment().format('YYYY-MM-DD')
      this.dialog.data = Object.assign({}, row)
      this.dialog.valueBeforeUpdate.reformDate = row.reformDate
    },
    async validateBeforeSave () {
      await this.$refs['form'].validate()
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.DevCourseMapper.isExists',
          isList: false,
          reformTheme: this.dialog.data.reformTheme,
          reformDate: this.dialog.data.reformDate
        }
      })
      let isChange = true
      if (this.dialog.mode === 2 && this.dialog.data.reformDate === this.dialog.valueBeforeUpdate.reformDate) {
        isChange = false
      }
      if (data.data.count > 0 && isChange) {
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message.info('当前主题已存在，请重新输入！')
        }
        return Promise.reject(new Error())
      }
      return Promise.resolve()
    },
    async onSave () {
      try {
        await this.validateBeforeSave()
        if (this.dialog.mode === 1) {
          await this.$api.add({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.nationalReform.DevCourseMapper.insertDevCourse',
              ...this.dialog.data
            }
          })
        } else {
          let model = this.dialog.data
          await this.$api.modify({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.nationalReform.DevCourseMapper.updateDevCourse',
              fid: model.id,
              reformTheme: model.reformTheme,
              reformDate: model.reformDate,
              remark: model.remark,
              userId: this.$store.state.user.userInfo.userId,
              createTime: moment().format('YYYY-MM-DD')
            }
          })
          this.$emit('queryReformDetail', { id: this.dialog.data.id, reformDate: this.dialog.data.reformDate })
        }
        this.dialog.show = false
        this.featchData()
        this.$emit('refreshDetail')
        this.$message.success(this.dialogMode.message)
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    resize () {
      this.grid.height = this.$el.clientHeight * (3 / 4)
    },
    async onRowClick (row) {
      this.$refs['table'].clearSelection()
      this.$refs['table'].toggleRowSelection(row)
      this.$emit('queryReformDetail', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.reformTheme-maintenance {
  width: 100%;
  height: 100%;
}
</style>
