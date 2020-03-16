<template>
  <div class="onlineAgen-data">
    <div class="tool-bar">
<!--      <el-link icon="el-icon-document-add" @click="onAdd" v-show="!isImporting">新增</el-link>-->
      <el-link icon="el-icon-circle-close" @click="cancelImport" v-show="isImporting">取消</el-link>
      <div class="split-line" v-show="isImporting"></div>
      <el-link icon="el-icon-edit" @click="onBatchUpdate" v-show="!isImporting">批量编辑</el-link>
      <el-link icon="el-icon-circle-check" @click="saveImport" v-show="isImporting">保存</el-link>
      <div class="split-line"></div>
      <el-link icon="el-icon-download" @click="onImport" v-show="!isImporting">导入</el-link>
      <el-link class="right-button"  v-show="!isImporting && !isShowAllData" icon="el-icon-more-outline" @click="toggleShowMore" :disabled="!isShowMoreBtnEnabled">查看更多</el-link>
      <el-link class="right-button"  v-show="!isImporting && isShowAllData" icon="el-icon-back" @click="toggleShowMore" :disabled="!isShowMoreBtnEnabled">返回</el-link>
    </div>
    <div class="grid-container">
      <el-table
        border
        ref="table"
        :row-style="highlightRow"
        :data="isImporting ? importData : isShowAllData ? grid.allRows : grid.rows"
        :height="grid.height"
        highlight-current-row
        v-loading="grid.loading"
        @selection-change="val => grid.selectedRow =val"
      >
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="month" label="采集日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
<!--            <el-date-picker v-if="isImporting"-->
<!--                            type="month"-->
<!--                            style="width: 100%;"-->
<!--                            placeholder="选择月份"-->
<!--                            v-model="scope.row.date"-->
<!--                            value-format="yyyy-MM"-->
<!--            ></el-date-picker>-->
            <span>{{ scope.row.date | emptyFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="onlineAgenNum" label="上线单位数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input  v-if="isImporting" v-model.trim="scope.row.onlineAgenNum" placeholder="请输入上线单位数"></el-input>
            <span v-else>{{ scope.row.onlineAgenNum | emptyFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="agenBillNum" label="单位开票份数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input  v-if="isImporting" v-model.trim="scope.row.agenBillNum" placeholder="请输入单位开票份数"></el-input>
            <span v-else>{{ scope.row.agenBillNum | emptyFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="50" label="操作" v-if="!isBatchUpdate">
          <template slot-scope="scope">
            <el-tooltip v-show="!isImporting" effect="light" placement="bottom-start" content="编辑" :enterable="false">
              <el-link
                style="font-size: 20px;margin: 0 5px 0 0;"
                icon="el-icon-edit-outline"
                @click="onUpdate(scope.row)"
              ></el-link>
            </el-tooltip>
            <el-tooltip v-show="isImporting" effect="light" placement="bottom-start" content="删除" :enterable="false">
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
        <span>单位上线数据维护 —— {{dialogMode.title}}</span>
      </div>
      <el-form ref="form" :rules="dialog.rules" :model="dialog.data" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集日期" prop="date">
              <el-date-picker
                  type="month"
                  style="width: 100%;"
                  placeholder="选择月份"
                  v-model="dialog.data.date"
                  value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上线单位数" prop="onlineAgenNum">
              <el-input v-model="dialog.data.onlineAgenNum" placeholder="请输入上线单位数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位开票份数" prop="agenBillNum">
              <el-input v-model="dialog.data.agenBillNum" placeholder="请输入单位开票份数"></el-input>
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
    const validateNumber = (rule, value, next) => {
      if (!value && value !== 0) {
        next('请输入数值！')
      } else if (!/^(-?\d+)$/.test(value)) {
        next('请输入整数！')
      } else if (value <= 0) {
        next('请输入大于0的整数！')
      } else {
        next()
      }
    }
    return {
      isImporting: false,
      isBatchUpdate: false,
      templateConfig: {
        excelFileName: '单位上线数据维护',
        excelHeader: ['采集日期', '上线单位数', '单位开票份数'],
        excelHeaderVal: ['date', 'onlineAgenNum', 'agenBillNum'],
        dateType: ['date', 'month']
      },
      defaultMaxMonthSpan: 12,
      isShowAllData: false,
      isShowMoreBtnEnabled: false,
      grid: {
        allRows: [],
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
        data: {
          date: null,
          onlineAgenNum: null,
          agenBillNum: null,
          userName: null
        },
        rules: {
          date: [
            { required: true, message: '请选择采集日期！', trigger: 'blur' }
          ],
          onlineAgenNum: [
            { required: true, validator: validateNumber, trigger: 'blur' }
          ],
          agenBillNum: [
            { required: true, validator: validateNumber, trigger: 'blur' }
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
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.medicalReform.OnlineAgenMapper.queryOnlineAgen'
        }
      })
      this.grid.loading = false
      this.grid.allRows = this.formatAllRow(data.data)
      this.grid.rows = this.formatData(this.grid.allRows)
      // 不在窗口中
      if (this.grid.allRows.length > this.defaultMaxMonthSpan) {
        this.isShowMoreBtnEnabled = true
      } else {
        this.isShowMoreBtnEnabled = false
      }
    },
    /**
     * 获取当前日期窗口
     */
    formatData (d) {
      let data = JSON.parse(JSON.stringify(d))
      let userId = this.$store.state.user.userInfo.userId
      let tmp = []
      // 确定日期窗口（近一年）
      for (let i = 1; i <= this.defaultMaxMonthSpan; i++) {
        let month = moment().subtract(i, 'months').format('YYYY-MM')
        let item = {
          id: '-1',
          date: month,
          onlineAgenNum: '',
          agenBillNum: '',
          updateTime: '',
          userId: userId
        }
        // 根据已有数据填充窗口
        for (let i = 0; i < data.length; i++) {
          if (moment(month).isSame(moment(data[i].date))) {
            item.id = data[i].id
            item.onlineAgenNum = data[i].onlineAgenNum
            item.agenBillNum = data[i].agenBillNum
            item.updateTime = data[i].updateTime
            item.userName = data[i].userName
            break
          }
        }
        tmp.push(item)
      }
      return tmp
    },
    /**
     * 格式化数据 插入当前日期窗口
     */
    formatAllRow (data) {
      let userId = this.$store.state.user.userInfo.userId
      let month = moment().subtract(1, 'months').format('YYYY-MM')
      let monthSpan = 1
      // let data = this.grid.allRows
      for (let i = 0; i < data.length; i++) {
        if (moment(month).isSame(data[i].date)) {
          monthSpan++
          month = moment().subtract(monthSpan, 'months').format('YYYY-MM')
        } else if (moment(month).isAfter(data[i].date)) {
          month = moment().subtract(monthSpan, 'months').format('YYYY-MM')
          let items = []
          while (!(moment(month).isSame(data[i]?.date)) && monthSpan < this.defaultMaxMonthSpan + 1) {
            let item = {
              id: '-1',
              date: month,
              onlineAgenNum: '',
              agenBillNum: '',
              userId: userId,
              updateTime: ''
            }
            items.push(item)
            monthSpan++
            month = moment().subtract(monthSpan, 'months').format('YYYY-MM')
          }
          data.splice(i, 0, ...items)
        }
        if (monthSpan === this.defaultMaxMonthSpan + 1) {
          break
        }
      }
      if (monthSpan < this.defaultMaxMonthSpan + 1) {
        let items = []
        for (let i = monthSpan; i < this.defaultMaxMonthSpan + 1; i++) {
          let month = moment().subtract(i, 'months').format('YYYY-MM')
          let item = {
            id: '-1',
            date: month,
            onlineAgenNum: '',
            agenBillNum: '',
            userId: userId,
            updateTime: ''
          }
          items.push(item)
        }
        data.splice(data.length, 0, ...items)
      }
      return data
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
          date: moment().format('YYYY-MM'),
          onlineAgenNum: '',
          agenBillNum: '',
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
                mapperId: 'com.bosssoft.monitor.dao.medicalReform.OnlineAgenMapper.deleteOnlineAgen',
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
      if (!this.dialog.data.userName) {
        this.dialog.data.userName = this.$store.state.user.userInfo.userName
      }
    },
    async validateBeforeSave () {
      await this.$refs['form'].validate()
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.medicalReform.OnlineAgenMapper.isExists',
          isList: false,
          date: this.dialog.data.date
        }
      })
      if (data.data.count > 0) {
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message.info('当前日期已存在，请重新选择！')
        }
        return Promise.reject(new Error())
      }
      return Promise.resolve()
    },
    async onSave () {
      try {
        await this.$refs['form'].validate()
        // await this.validateBeforeSave()
        if (this.dialog.mode === 1) {
          await this.$api.add({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.medicalReform.OnlineAgenMapper.insertOnlineAgen',
              ...this.dialog.data
            }
          })
        } else {
          let model = this.dialog.data
          await this.$api.modify({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.medicalReform.OnlineAgenMapper.updateOnlineAgen',
              ...model,
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
    onBatchUpdate () {
      this.isImporting = true
      this.isBatchUpdate = true
      if (this.isShowAllData) {
        this.getImportData(JSON.parse(JSON.stringify(this.grid.allRows)))
      } else {
        this.getImportData(JSON.parse(JSON.stringify(this.grid.rows)))
      }
    },
    toggleShowMore () {
      this.isShowAllData = !this.isShowAllData
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
        this.importData.push({
          ...item,
          userId: userId,
          userName: userName,
          createTime: createTime
        })
      })
    },
    cancelImport () {
      this.isImporting = false
      this.isBatchUpdate = false
      this.featchData()
    },
    async validateBeforeImportingSave () {
      for (let i = 0; i < this.importData.length; i++) {
        if (this.importData[i].onlineAgenNum && !/^(\d+)$/.test(this.importData[i].onlineAgenNum)) {
          if (document.getElementsByClassName('el-message').length === 0) {
            this.$message.error('第' + (i + 1) + '行上线单位数必须为不小于0的整数，请重新填写！')
          }
          return Promise.reject(new Error())
        }
        if (this.importData[i].agenBillNum && !/^(\d+)$/.test(this.importData[i].agenBillNum)) {
          if (document.getElementsByClassName('el-message').length === 0) {
            this.$message.error('第' + (i + 1) + '行单位开票份数必须为不小于0的整数，请重新填写！')
          }
          return Promise.reject(new Error())
        }
      }
      return Promise.resolve()
    },
    async save () {
      try {
        await this.validateBeforeImportingSave()
        let model = this.importData.filter(item => item.onlineAgenNum || item.agenBillNum)
        let jsonData = JSON.stringify(model)
        // await this.validateBeforeSave()
        let { data } = await this.$api.batchInsertOnlineAgen({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            data: jsonData
          }
        })
        if (data.success) {
          this.featchData()
          this.isImporting = false
          this.isBatchUpdate = false
          this.$message.success('更新成功！')
        } else {
          if (data.code === 520) {
            this.$confirm('数据库数据已改变，请刷新页面重新编辑', '数据不一致', {
              confirmButtonText: '刷新',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.featchData()
              this.isImporting = false
              this.isBatchUpdate = false
            }).catch(() => {
            })
          }
        }
      } catch (error) {
        error.message && this.$message.error(error.message)
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
        if (this.isBatchUpdate) {
          this.save()
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
              .catch(() => {
              })
          }
        }
      }
    },
    highlightRow ({ row, rowIndex }) {
      if (this.isImporting && !this.isBatchUpdate) {
        for (let i = 0; i < this.grid.allRows?.length; i++) {
          if (this.grid.allRows[i].date === row.date?.toString() && this.grid.allRows[i].id !== '-1') {
            row.updateTime = moment(this.grid.allRows[i].updateTime).format('YYYY-MM-DD HH:mm:ss')
            row.id = this.grid.allRows[i].id
            row.isConflict = 1
            return { color: '#F1483B' }
          } else {
            row.isConflict = 0
            row.id = '-1'
          }
        }
      } else if (this.isBatchUpdate) {
        for (let i = 0; i < this.grid.allRows?.length; i++) {
          if (this.grid.allRows[i].date === row.date?.toString()) {
            // 判断数据是否最新
            row.updateTime = moment(this.grid.allRows[i].updateTime).format('YYYY-MM-DD HH:mm:ss')
            return { color: '#000000' }
          }
        }
      }
      return { color: '#000000' }
    },
    resize () {
      this.grid.height = this.$el.clientHeight - this.$el.querySelector('.tool-bar').clientHeight - 2
    }
  }
}
</script>
<style lang="scss" scoped>
  .onlineAgen-data {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .grid-container {
      flex: 1;
    }
  }
</style>
