<template>
  <div class="tree-simple-search-grid">
    <div class="left-aside">
      <el-tree
        ref="tree"
        highlight-current
        node-key="id"
        :data="tree.data"
        :default-expanded-keys="['-1']"
        :props="{label:'name',children:'children'}"
        @node-click="onTreeNodeClick"
      ></el-tree>
    </div>
    <div class="right-aside">
      <div class="simple-search-grid">
        <div class="search-bar">
          <el-form inline :model="search">
            <el-form-item label="月份">
              <el-date-picker
                clearable
                type="month"
                style="width: 100%;"
                placeholder="选择日期"
                v-model="search.month"
                value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onQuery" icon="el-icon-search" :disabled="!search.agenIdCode">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tool-bar">
          <el-link icon="el-icon-edit-outline" @click="toggleUpdate" v-show="!isImporting && !isUpdating" :disabled="!search.agenIdCode">编辑</el-link>
          <el-link icon="el-icon-circle-close" @click="toggleUpdate" v-show="!isImporting && isUpdating">取消</el-link>
          <div class="split-line" v-show="!isImporting"></div>
          <el-link icon="el-icon-circle-check" @click="onSave" :disabled="!isUpdating" v-show="!isImporting">保存</el-link>
          <el-link icon="el-icon-circle-close" @click="cancelImport" v-show="isImporting">取消</el-link>
          <div class="split-line"></div>
          <el-link icon="el-icon-download" @click="onImport" v-show="!isUpdating && !isImporting" :disabled="!search.agenIdCode">导入</el-link>
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
            <el-table-column prop="month" label="月份" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-date-picker v-if="isUpdating || isImporting"
                                type="month"
                                style="width: 100%;"
                                placeholder="选择月份"
                                v-model="scope.row.month"
                                value-format="yyyy-MM"
                ></el-date-picker>
                <span v-else>{{ scope.row.month | emptyFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="issueNum" align="center" label="机构证书发放数" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form  v-if="isUpdating || isImporting" :model="scope.row" :rules="grid.rules" ref="issueNum">
                  <el-form-item prop="issueNum">
                    <el-input
                        v-model.trim="scope.row.issueNum"
                        clearable
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span v-else>{{ scope.row.issueNum | emptyFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ukeyNum" align="center" label="uKey数" show-overflow-tooltip>
              <template slot-scope="scope" >
                <el-form  v-if="isUpdating || isImporting" :model="scope.row" :rules="grid.rules" ref="ukeyNum">
                  <el-form-item prop="ukeyNum">
                      <el-input
                        v-model.trim="scope.row.ukeyNum"
                        clearable
                      >
                      </el-input>
                  </el-form-item>
                </el-form>
                <span v-else>{{ scope.row.ukeyNum | emptyFilter}}</span>
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
        excelFileName: 'ukey、机构证书发放维护',
        excelHeader: ['月份', '机构证书发放数', 'ukey数'],
        excelHeaderVal: ['month', 'issueNum', 'ukeyNum'],
        dateType: ['month', 'month']
      },
      excelDailog: {
        show: false
      },
      defaultMaxNum: 6,
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
          name: '全部',
          children: []
        }]
      },
      search: {
        agenIdCode: null,
        month: null
      },
      grid: {
        rows: [],
        allRows: [],
        height: null,
        loading: false,
        rules: {
          issueNum: [
            { validator: validateNumber, trigger: 'blur' }
          ],
          ukeyNum: [
            { validator: validateNumber, trigger: 'blur' }
          ]
        }
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
          mapperId: 'com.bosssoft.monitor.dao.centerReform.OrgIssueMapper.queryCenterAgen'
        }
      })
      this.tree.data[0].children = this.formatTreeDate(data.data)
    },
    formatTreeDate (data) {
      let id = 'agenIdCode'
      let pid = 'pidCode'
      let code = 'agenCode'
      let name = 'agenName'
      let map = {}
      let node
      let tree = []
      let i
      for (i = 0; i < data.length; i++) {
        map[data[i][id]] = data[i]
        data[i].children = []
        data[i].name = ((data[i][code] ? data[i][code] : '') + ' ' + (data[i][name] ? data[i][name] : ''))
      }
      for (i = 0; i < data.length; i += 1) {
        node = data[i]
        if (node[pid] !== '0' && pid in node) {
          map[node[pid]].children.push(node)
        } else {
          tree.push(node)
        }
      }
      return tree
    },
    // 树节点点击
    onTreeNodeClick (data) {
      if (data.children.length === 0 && data.id !== 'root') {
        this.search.agenIdCode = data.agenIdCode
        this.search.month = null
        this.featchData()
      } else {
        this.search.agenIdCode = null
        this.search.month = null
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
          mapperId: 'com.bosssoft.monitor.dao.centerReform.OrgIssueMapper.queryOrgIssue',
          ...this.search
        }
      })
      this.grid.loading = false
      if (data.data.length > 6) {
        this.showMore.show = true
      } else {
        this.showMore.show = false
      }
      if (this.search.month) {
        this.grid.rows = data.data
      } else {
        if (this.showMore.isShowAllData) {
          this.grid.allRows = this.grid.rows = this.formatAllRow(data.data)
        } else {
          this.grid.allRows = this.formatAllRow(data.data)
          this.grid.rows = this.formatData(this.grid.allRows)
        }
      }
    },
    /**
     * 获取当前日期窗口
     */
    formatData (d) {
      let data = JSON.parse(JSON.stringify(d))
      let userId = this.$store.state.user.userInfo.userId
      let tmp = []
      // 确定日期窗口（近半年）
      for (let i = 0; i < this.defaultMaxNum; i++) {
        let month = moment().subtract(i, 'months').format('YYYY-MM')
        let item = {
          id: '-1',
          month: month,
          issueNum: '',
          ukeyNum: '',
          updateTime: '',
          agenIdCode: this.search.agenIdCode,
          userId: userId
        }
        // 根据已有数据填充窗口
        for (let i = 0; i < data.length; i++) {
          if (moment(month).isSame(data[i].month)) {
            item.id = data[i].id
            item.issueNum = data[i].issueNum
            item.ukeyNum = data[i].ukeyNum
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
      let month = moment().format('YYYY-MM')
      let monthSpan = 1
      // let data = this.grid.allRows
      for (let i = 0; i < data.length; i++) {
        if (moment(month).isSame(data[i].month)) {
          month = moment().subtract(monthSpan, 'months').format('YYYY-MM')
          monthSpan++
        } else if (moment(month).isAfter(data[i].month)) {
          let item = {
            id: '-1',
            month: month,
            issueNum: '',
            ukeyNum: '',
            updateTime: ''
          }
          data.splice(i, 0, item)
          month = moment().subtract(monthSpan, 'months').format('YYYY-MM')
          monthSpan++
        }
        if (monthSpan === 7) {
          break
        }
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
    // 点击保存
    async onSave () {
      try {
        await this.$refs['issueNum'].validate()
        await this.$refs['ukeyNum'].validate()
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
        let orgIssues = JSON.stringify(this.grid.rows)
        let { data } = await this.$api.batchInsertOrgIssues({
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            data: orgIssues
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
          agenIdCode: this.search.agenIdCode,
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
          if (this.grid.allRows[i].month === row.month && this.grid.allRows[i].id !== '-1') {
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
        if (this.$refs.table.data[i].month === row.month && i !== rowIndex) {
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
.tree-simple-search-grid {
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
