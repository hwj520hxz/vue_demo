<template>
  <div class="medial-bill-switch">
    <div class="left-aside">
      <el-tree
        ref="tree"
        highlight-current
        node-key="id"
        :data="tree.data"
        :default-expanded-keys="['-1']"
        :props="{label:'rgnName',children:'children'}"
        @node-click="onTreeNodeClick"
      ></el-tree>
    </div>
    <div class="right-aside">
      <div class="simple-search-grid">
        <div class="search-bar">
          <el-form inline :model="search">
            <el-form-item label="日期">
              <el-date-picker
                clearable
                type="date"
                style="width: 100%;"
                placeholder="选择日期"
                v-model="search.date"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onQuery" icon="el-icon-search" :disabled="!search.rgnCode">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tool-bar">
          <el-link icon="el-icon-document-add" @click="onAdd" v-show="!isUpdating && !isImporting" :disabled="!search.rgnCode">新增</el-link>
          <div class="split-line" v-show="!isUpdating && !isImporting"></div>
          <el-link icon="el-icon-edit-outline" @click="toggleUpdate" v-show="!isImporting && !isUpdating" :disabled="!search.rgnCode">编辑</el-link>
          <el-link icon="el-icon-circle-close" @click="toggleUpdate" v-show="!isImporting && isUpdating">取消</el-link>
          <div class="split-line" v-show="!isImporting"></div>
          <el-link icon="el-icon-circle-check" @click="onSave" :disabled="!isUpdating" v-show="!isImporting">保存</el-link>
          <el-link icon="el-icon-circle-close" @click="cancelImport" v-show="isImporting">取消</el-link>
          <div class="split-line"></div>
          <el-link icon="el-icon-download" @click="onImport" v-show="!isUpdating && !isImporting" :disabled="!search.rgnCode">导入</el-link>
          <el-link icon="el-icon-circle-check" @click="onSave" v-show="!isUpdating && isImporting">保存</el-link>
          <el-link class="right-button"  v-show="!isImporting && !isUpdating && showMore.show" :icon="showMore.icon" @click="toggleShowMore">{{showMore.label}}</el-link>
        </div>
        <div class="grid-container">

          <el-table
            border
            ref="table"
            :row-style="highlightRow"
            :data="grid.rows"
            :height="grid.height"
            highlight-current-row
            v-loading="grid.loading"
          >
            <el-table-column width="70" align="center" label="警告" v-if="isImporting || isUpdating">
              <template slot-scope="scope">
                <el-tooltip effect="light" placement="bottom-start" content="数据重复" :enterable="false">
                  <i class="el-icon-warning" v-show="scope.row.isRepeat"></i>
                </el-tooltip>
                <el-tooltip effect="light" placement="bottom-start" content="数据已存在" :enterable="false">
                  <i class="el-icon-error" v-show="scope.row.isConflict"></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
            <el-table-column prop="date" label="日期" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form v-if="isUpdating || isImporting" :model="scope.row" :rules="grid.rules" ref="date">
                  <el-form-item prop="date">
                    <el-date-picker v-if="isUpdating || isImporting"
                                    type="date"
                                    style="width: 100%;"
                                    placeholder="选择日期"
                                    v-model="scope.row.date"
                                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </el-form-item>
                </el-form>
                <span v-else>{{ scope.row.date | emptyFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ebillNum" align="center" label="电子票数" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form  v-if="isUpdating || isImporting" :model="scope.row" :rules="grid.rules" ref="ebillNum">
                  <el-form-item prop="ebillNum">
                    <el-input
                      v-model.trim="scope.row.ebillNum"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span v-else>{{ scope.row.ebillNum | emptyFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mbillNum" align="center" label="机打票数" show-overflow-tooltip>
              <template slot-scope="scope" >
                <el-form  v-if="isUpdating || isImporting" :model="scope.row" :rules="grid.rules" ref="mbillNum">
                  <el-form-item prop="mbillNum">
                    <el-input
                      v-model.trim="scope.row.mbillNum"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <span v-else>{{ scope.row.mbillNum | emptyFilter}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <importDialog
          v-model="excelDailog.show"
          :templateConfig="templateConfig"
          @getImportData="getImportData"
        >
        </importDialog>
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
            <span>医疗换开数据维护 —— {{dialogMode.title}}</span>
          </div>
          <el-form :disabled="dialog.mode === 3" ref="form" :rules="dialog.rules" :model="dialog.data" label-width="110px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="日期" prop="date">
                  <el-date-picker
                    type="date"
                    style="width: 100%;"
                    placeholder="选择日期"
                    v-model="dialog.data.date"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="电子票数" prop="ebillNum">
                  <el-input
                    placeholder="请输入电子票数"
                    v-model="dialog.data.ebillNum"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机打票数" prop="mbillNum">
                  <el-input
                    placeholder="请输入机打票数"
                    v-model="dialog.data.mbillNum"
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
            <el-button v-show="dialog.mode !== 3" type="primary" @click="saveOne" icon="fa fa-save">&nbsp;保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
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
    const validateNumberNotEmpty = (rule, value, next) => {
      if (!value && value !== 0) {
        next('请输入数值')
      } else if (!/^(-?\d+)$/.test(value)) {
        next('请输入整数！')
      } else if (value <= 0) {
        next('请输入大于0的整数！')
      } else {
        next()
      }
    }
    const validateNumber = (rule, value, next) => {
      if (!value && value !== 0) {
        next()
      } else if (!/^(-?\d+)$/.test(value)) {
        next('请输入整数！')
      } else if (value <= 0) {
        next('请输入大于0的整数！')
      } else {
        next()
      }
    }
    return {
      templateConfig: {
        excelFileName: '医疗换开数据维护',
        excelHeader: ['日期', '电子票数', '机打票数'],
        excelHeaderVal: ['date', 'ebillNum', 'mbillNum'],
        dateType: ['date', 'day']
      },
      excelDailog: {
        show: false
      },
      defaultMaxNum: 7,
      isImporting: false,
      isUpdating: false,
      showMore: {
        icon: 'el-icon-more-outline',
        label: '查看更多',
        isShowAllData: false,
        show: false
      },
      tree: {
        selectedData: null,
        data: [{
          id: '-1',
          rgnName: '全部',
          children: []
        }]
      },
      search: {
        rgnCode: null,
        date: null
      },
      grid: {
        rows: [],
        allRows: [],
        height: null,
        loading: false,
        rules: {
          date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          ebillNum: [
            { validator: validateNumber, trigger: 'blur' }
          ],
          mbillNum: [
            { validator: validateNumber, trigger: 'blur' }
          ]
        }
      },
      dialog: {
        mode: null,
        show: false,
        data: {
          date: null,
          ebillNum: null,
          mbillNum: null,
          rgnCode: null,
          userId: null,
          userName: null,
          createTime: null
        },
        rules: {
          date: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ],
          ebillNum: [
            { required: true, validator: validateNumberNotEmpty, trigger: 'blur' }
          ],
          mbillNum: [
            { required: true, validator: validateNumberNotEmpty, trigger: 'blur' }
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
    this.featchTreeData()
  },
  mounted () {
    this.resize()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    // 获取树节点数据
    async featchTreeData () {
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.medicalReform.MedicalReformMapper.queryRegion'
        }
      })
      data.data.forEach((item) => {
        item.rgnName = item.rgnCode + ' ' + item.rgnName
      })
      this.tree.data[0].children = data.data
    },
    // 树节点点击
    onTreeNodeClick (data) {
      if (data.id !== '-1') {
        this.search.rgnCode = data.rgnCode
        this.search.date = null
        this.featchData()
      } else {
        this.search.rgnCode = null
        this.search.date = null
        this.showMore.show = false
        this.grid.rows = []
        this.grid.allRows = []
      }
      this.isUpdating = false
      this.isImporting = false
    },
    // 获取列表数据
    async featchData () {
      this.grid.loading = true
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.medicalReform.MedicalChangeMapper.queryMedicalChange',
          ...this.search
        }
      })
      this.grid.loading = false
      if (this.search.date) {
        this.grid.rows = data.data
      } else {
        if (this.showMore.isShowAllData) {
          this.grid.allRows = this.grid.rows = this.formatAllRow(data.data)
        } else {
          this.grid.allRows = this.formatAllRow(data.data)
          this.grid.rows = this.formatData(this.grid.allRows)
        }
      }
      if (this.grid.allRows.length > this.defaultMaxNum) {
        this.showMore.show = true
      } else {
        this.showMore.show = false
      }
    },
    /**
     * 获取当前日期窗口
     */
    formatData (d) {
      let data = JSON.parse(JSON.stringify(d))
      let userId = this.$store.state.user.userInfo.userId
      let tmp = []
      // 确定日期窗口（近七日）
      for (let i = 1; i <= this.defaultMaxNum; i++) {
        let date = moment().subtract(i, 'days').format('YYYY-MM-DD')
        let item = {
          id: '-1',
          date: date,
          ebillNum: '',
          mbillNum: '',
          updateTime: '',
          rgnCode: this.search.rgnCode,
          userId: userId
        }
        // 根据已有数据填充窗口
        for (let i = 0; i < data.length; i++) {
          if (moment(date).isSame(data[i].date)) {
            item.id = data[i].id
            item.ebillNum = data[i].ebillNum
            item.mbillNum = data[i].mbillNum
            item.updateTime = data[i].updateTime
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
      let date = moment().subtract(1, 'days').format('YYYY-MM-DD')
      let monthSpan = 1
      // let data = this.grid.allRows
      for (let i = 0; i < data.length; i++) {
        if (moment(date).isSame(data[i].date)) {
          monthSpan++
          date = moment().subtract(monthSpan, 'days').format('YYYY-MM-DD')
        } else if (moment(date).isAfter(data[i].date)) {
          date = moment().subtract(monthSpan, 'days').format('YYYY-MM-DD')
          let items = []
          while (!(moment(date).isSame(data[i]?.date)) && monthSpan < this.defaultMaxNum + 1) {
            let item = {
              id: '-1',
              date: date,
              ebillNum: '',
              mbillNum: '',
              rgnCode: this.search.rgnCode,
              userId: userId,
              updateTime: ''
            }
            items.push(item)
            monthSpan++
            date = moment().subtract(monthSpan, 'days').format('YYYY-MM-DD')
          }
          data.splice(i, 0, ...items)
        }
        if (monthSpan === this.defaultMaxNum + 1) {
          break
        }
      }
      if (monthSpan < this.defaultMaxNum + 1) {
        let items = []
        for (let i = monthSpan; i < this.defaultMaxNum + 1; i++) {
          let date = moment().subtract(i, 'days').format('YYYY-MM-DD')
          let item = {
            id: '-1',
            date: date,
            ebillNum: '',
            mbillNum: '',
            rgnCode: this.search.rgnCode,
            userId: userId,
            updateTime: ''
          }
          items.push(item)
        }
        data.splice(data.length, 0, ...items)
      }
      return data
    },
    onQuery () {
      this.featchData()
    },
    toggleShowMore () {
      this.showMore.isShowAllData = !this.showMore.isShowAllData
      this.showMore.icon = this.showMore.isShowAllData ? 'el-icon-back' : 'el-icon-more-outline'
      this.showMore.label = this.showMore.isShowAllData ? '返回' : '查看更多'
      this.featchData()
    },
    toggleUpdate () {
      this.isUpdating = !this.isUpdating
      if (!this.isUpdating) {
        this.featchData()
      }
    },
    async validateBeforeSave () {
      this.grid.rows.forEach(item => {
        if (item.isConflict) {
          this.grid.warning.conflictCnt++
        }
        if (item.isRepeat) {
          this.grid.warning.repeatCnt++
        }
      })
    },
    async onAdd () {
      try {
        let model = {
          date: moment().format('YYYY-MM-DD'),
          ebillNum: '',
          mbillNum: '',
          rgnCode: this.search.rgnCode,
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
    async validateBeforeSaveOne () {
      await this.$refs['form'].validate()
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.medicalReform.MedicalChangeMapper.isExists',
          isList: false,
          rgnCode: this.dialog.data.rgnCode,
          date: this.dialog.data.date
        }
      })
      if (data.data.count > 0) {
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message.info('当前指标已存在，请重新选择！')
        }
        return Promise.reject(new Error())
      }
      return Promise.resolve()
    },
    // 单条保存
    async saveOne () {
      try {
        await this.validateBeforeSaveOne()
        await this.$api.add({
          data: {
            mapperId: 'com.bosssoft.monitor.dao.medicalReform.MedicalChangeMapper.insertMedicalChange',
            ...this.dialog.data
          }
        })
        this.dialog.show = false
        this.featchData()
        this.$message.success(this.dialogMode.message)
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    // 批量保存
    async onSave () {
      try {
        await this.$refs['date'].validate()
        await this.$refs['ebillNum'].validate()
        await this.$refs['mbillNum'].validate()
        let repeatCnt = 0
        let conflictCnt = 0
        this.grid.rows.forEach(item => {
          if (item.isConflict) {
            conflictCnt++
          }
          if (item.isRepeat) {
            repeatCnt++
          }
        })
        if (repeatCnt !== 0) {
          if (document.getElementsByClassName('el-message').length === 0) {
            const h = this.$createElement
            this.$msgbox({
              title: '重复数据',
              message: h('div', null, [
                h('div', null, repeatCnt + '条数据重复，请修改后再提交'),
                h('i', { style: 'color:goldenrod; font-size: 10px' }, '注：黄色即为重复数据')
              ]),
              type: 'warning'
            }).then(() => { })
              .catch(() => { })
          }
        } else if (conflictCnt !== 0 && (this.isImporting && !this.isUpdating)) {
          if (document.getElementsByClassName('el-message').length === 0) {
            const h = this.$createElement
            this.$msgbox({
              title: '已存在数据',
              message: h('div', null, [
                h('div', null, conflictCnt + '条数据在系统中已存在，强制更新将覆盖已有数据'),
                h('i', { style: 'color:#e4474d; font-size: 10px' }, '注：红色即为已存在数据')
              ]),
              showCancelButton: true,
              confirmButtonText: this.isUpdating ? '强制更新' : '继续导入',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => this.save())
              .catch(() => { })
          }
        } else {
          this.save()
        }
      } catch (error) {
        error.message && this.$message.error(error.message)
      }
    },
    async save () {
      try {
        let model = this.grid.rows.filter(item => item.ebillNum || item.mbillNum)
        let jsonData = JSON.stringify(model)
        let { data } = await this.$api.batchInsertMedicalChange({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            data: jsonData
          }
        })
        if (data.success) {
          this.featchData()
          this.isUpdating = false
          this.isImporting = false
          this.$message.success('更新成功！')
        } else {
          if (data.code === 520) {
            this.$confirm('数据库数据已改变，请刷新页面重新编辑', '数据不一致', {
              confirmButtonText: '刷新',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.featchData()
              this.isUpdating = false
              this.isImporting = false
            }).catch(() => {
            })
          }
        }
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
      this.grid.rows = []
      let userId = this.$store.state.user.userInfo.userId
      let userName = this.$store.state.user.userInfo.userName
      let createTime = moment().format('YYYY-MM-DD')
      data.forEach(item => {
        this.grid.rows.push({
          ...item,
          rgnCode: this.search.rgnCode,
          userId: userId,
          userName: userName,
          createTime: createTime
        })
      })
    },
    cancelImport () {
      this.isImporting = false
      this.featchData()
    },
    highlightRow ({ row, rowIndex }) {
      let hasConflict = false
      let hasRepeat = false
      if (this.isImporting && !this.isUpdating) {
        for (let i = 0; i < this.grid.allRows?.length; i++) {
          if (this.grid.allRows[i].date === row.date && this.grid.allRows[i].id !== '-1') {
            row.id = this.grid.allRows[i].id
            row.isConflict = true
            hasConflict = true
          }
        }
        if (!hasConflict) {
          row.isConflict = false
        }
      }
      for (let i = 0; i < this.$refs.table.data?.length; i++) {
        if (this.$refs.table.data[i].date === row.date && i !== rowIndex) {
          row.isRepeat = true
          hasRepeat = true
        }
      }
      if (!hasRepeat) {
        row.isRepeat = false
      }
      return { color: '#000000' }
    },
    resize () {
      this.grid.height = this.$el.clientHeight - this.$el.querySelector('.search-bar').clientHeight - this.$el.querySelector('.tool-bar').clientHeight - 1
    }
  }
}
</script>
<style lang="scss" scoped>
  .medial-bill-switch {
    width: 100%;
    height: 100%;
    display: flex;
    .left-aside {
      width: 250px;
      overflow: auto;
      padding: 10px;
      margin: 0 10px 0 0;
      border: 1px solid #d7d7d7;
    }
    .right-aside {
      flex: 1;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      .grid-container {
        flex: 1;
      }
    }
    .el-icon-warning {
      color: goldenrod;
      font-size: 18px;
      margin: 0 5px 0 0;
    }
    .el-icon-error {
      color: #e4474d;
      font-size: 18px;
      margin: 0 5px 0 0;
    }
  }
</style>
