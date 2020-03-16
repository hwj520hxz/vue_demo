<template>
  <div class="platform-access-maintenance">
    <div class="tool-bar">
      <el-link icon="el-icon-document-add" @click="onAdd" v-show="!isImporting">新增</el-link>
      <el-link icon="el-icon-circle-close" @click="cancelImport" v-show="isImporting">取消</el-link>
      <div class="split-line"></div>
      <el-link icon="el-icon-download" @click="onImport" v-show="!isImporting">导入</el-link>
      <el-link icon="el-icon-circle-check" @click="saveImport" v-show="isImporting">保存</el-link>
    </div>
    <div class="grid-container">
      <el-table
        border
        ref="table"
        :row-style="highlightRow"
        :data="isImporting ? importData : grid.rows"
        :height="grid.height"
        highlight-current-row
        v-loading="grid.loading"
        @selection-change="val => grid.selectedRow =val"
      >
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="rgnName" label="接入地区" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-select v-if="isImporting"
              :disabled="dialog.mode===3"
              v-model="scope.row.rgnName"
              @change="selectChange($event, scope.$index)"
              style="width: 100%;">
              <el-option
                v-for="item in placeSetting"
                :key="item.rgnCode"
                :value="item.rgnCode"
                :label="item.rgnCode + ' ' + item.rgnName">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.rgnName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accessDate"
          align="center"
          label="接入时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-date-picker v-if="isImporting"
              type="month"
              style="width: 100%;"
              placeholder="选择日期"
              v-model="scope.row.accessDate"
              value-format="yyyy-MM"
            ></el-date-picker>
            <span v-else>{{ scope.row.accessDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-tooltip v-show="!isImporting" effect="light" placement="bottom-start" content="编辑" :enterable="false">
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
                @click="onDelete(scope.row, scope.$index)"
              ></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
        <span>查验平台接入维护 —— {{dialogMode.title}}</span>
      </div>
      <el-form ref="form" :rules="dialog.rules" :model="dialog.data" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="接入地区" prop="rgnCode">
              <el-select
                :disabled="dialog.mode===3"
                v-model="dialog.data.rgnCode"
                style="width: 100%;">
                <el-option
                  v-for="item in placeSetting"
                  :key="item.rgnCode"
                  :value="item.rgnCode"
                  :label="item.rgnCode + ' ' + item.rgnName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接入时间" prop="accessDate">
              <el-date-picker
                type="month"
                style="width: 100%;"
                placeholder="选择日期"
                v-model="dialog.data.accessDate"
                value-format="yyyy-MM"
              ></el-date-picker>
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
        <el-button type="primary" @click="onSave" icon="fa fa-save">&nbsp;保存</el-button>
      </div>
    </el-dialog>
    <importDialog
      v-model="excelDailog.show"
      :templateConfig="templateConfig"
      @getImportData="getImportData"
    >
    </importDialog>
  </div>
</template>
<script>
import moment from 'moment'
import importDialog from '@/components/import-dialog'
export default {
  name: '',
  components: {
    importDialog
  },
  data () {
    return {
      isImporting: false,
      templateConfig: {
        excelFileName: '查验平台接入维护',
        excelHeader: ['接入地区编码', '接入地区名称', '接入日期'],
        excelHeaderVal: ['rgnCode', 'rgnName', 'accessDate'],
        dateType: ['accessDate', 'month']
      },
      placeSetting: [],
      grid: {
        rows: [],
        height: null,
        loading: false,
        selectedRow: []
      },
      excelDailog: {
        show: false
      },
      importData: [],
      dialog: {
        mode: null,
        show: false,
        valueBeforeUpdate: {
          rgnCode: null,
          accessDate: null
        },
        data: {
          rgnName: null,
          accessDate: null
        },
        rules: {
          rgnCode: [
            { required: true, message: '请选择接入地区！', trigger: 'blur' }
          ],
          accessDate: [
            { required: true, message: '请选择接入时间！', trigger: 'blur' }
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
    this.featchRgn()
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
    async featchRgn () {
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.queryRegion'
        }
      })
      this.placeSetting = data.data
    },
    async featchData () {
      this.grid.loading = true
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.queryCheckAccess'
        }
      })
      this.grid.loading = false
      this.grid.rows = data.data
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
          rgnCode: '',
          accessDate: moment().format('YYYY-MM'),
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
    async validateBeforeDelete (row) {
      // if (this.grid.selectedRow.length === 0) {
      //   this.$message.info('请选择要删除的记录！')
      //   return Promise.reject(new Error())
      // }
      return Promise.resolve()
    },
    async onDelete (row, index) {
      try {
        await this.validateBeforeDelete(row)
        this.$confirm('您确定要删除当前选中的记录吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if (this.isImporting) {
            this.importData.splice(index, 1)
          } else {
            await this.$api.remove({
              params: {
                mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.deleteCheckAccess',
                id: row.id
              }
            })
            this.featchData()
            this.$message.success('删除成功！')
          }
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
      this.dialog.valueBeforeUpdate.accessDate = row.accessDate
      this.dialog.valueBeforeUpdate.rgnCode = row.rgnCode
    },
    async validateBeforeSave () {
      await this.$refs['form'].validate()
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.isExists',
          isList: false,
          rgnCode: this.dialog.data.rgnCode,
          accessDate: this.dialog.data.accessDate
        }
      })
      let isChange = true
      if (this.dialog.mode === 2 && this.dialog.data.rgnCode === this.dialog.valueBeforeUpdate.rgnCode) {
        isChange = false
      }
      if (data.data.count > 0 && isChange) {
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message.info('当前地区已存在，请重新选择！')
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
              mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.insertCheckAccess',
              ...this.dialog.data
            }
          })
        } else {
          let model = this.dialog.data
          await this.$api.modify({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.nationalReform.CheckAccessMapper.updateCheckAccess',
              fid: model.id,
              rgnCode: model.rgnCode,
              accessDate: model.accessDate,
              userId: this.$store.state.user.userInfo.userId,
              createTime: moment().format('YYYY-MM-DD')
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
    onImport () {
      this.excelDailog.show = true
    },
    getImportData (data) {
      this.excelDailog.show = false
      this.isImporting = true
      let userId = this.$store.state.user.userInfo.userId
      let userName = this.$store.state.user.userInfo.userName
      let createTime = moment().format('YYYY-MM-DD')
      this.importData = []
      data.forEach(item => {
        if (item.accessDate) {
          this.importData.push({
            ...item,
            userId: userId,
            userName: userName,
            createTime: createTime
          })
        }
      })
    },
    cancelImport () {
      this.isImporting = false
      this.featchData()
    },
    async save () {
      let checkAccess = JSON.stringify(this.importData)
      // await this.validateBeforeSave()
      let { data } = await this.$api.batchInsertCheckAccess({
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          data: checkAccess
        }
      })
      if (data.success) {
        this.featchData()
        this.isImporting = false
        this.$message.success('导入成功！')
      } else {
        if (data.code === 520) {
          this.$confirm('数据库数据已改变，请刷新页面重新编辑', '数据不一致', {
            confirmButtonText: '刷新',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.featchData()
            this.isImporting = false
          }).catch(() => {
          })
        }
      }
    },
    async saveImport () {
      let conflictNum = 0
      this.importData.forEach(item => {
        if ('isConflict' in item && item.isConflict === 1) {
          conflictNum++
        }
      })
      if (conflictNum === 0) {
        await this.save()
      } else {
        if (document.getElementsByClassName('el-message').length === 0) {
          const h = this.$createElement
          this.$msgbox({
            title: '重复数据',
            message: h('div', null, [
              h('div', null, conflictNum + '条数据在系统中已存在，继续导入将覆盖已有数据'),
              h('i', { style: 'color:red; font-size: 10px' }, '注：红色序号即为重复数据')
            ]),
            showCancelButton: true,
            confirmButtonText: '继续导入',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => this.save())
            .catch(() => { })
        }
      }
    },
    highlightRow ({ row, rowIndex }) {
      if (this.isImporting) {
        for (let i = 0; i < this.grid.rows?.length; i++) {
          if (this.grid.rows[i].rgnCode === row.rgnCode.toString()) {
            // 判断数据是否最新
            row.updateTime = moment(this.grid.rows[i].updateTime).format('YYYY-MM-DD HH:mm:ss')
            row.id = this.grid.rows[i].id
            row.isConflict = 1
            return { color: '#F1483B' }
          } else {
            row.isConflict = 0
            row.id = '-1'
          }
        }
      }
      return { color: '#000000' }
    },
    selectChange (val, index) {
      let item = {}
      item = this.placeSetting.find(item => {
        return item.rgnCode === val
      })
      this.importData[index].rgnCode = item.rgnCode
      this.importData[index].rgnName = item.rgnName
    },
    resize () {
      this.grid.height = this.$el.clientHeight - this.$el.querySelector('.tool-bar').clientHeight - 2
    }
  }
}
</script>
<style lang="scss" scoped>
.platform-access-maintenance {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .grid-container {
    flex: 1;
  }
}
</style>
