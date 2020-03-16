<template>
  <el-dialog
    v-dialog
    width="400px"
    v-if="show"
    :visible.sync="myShow"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
  >
    <div slot="title" class="title">
      <i class="el-icon-download"></i>
      <span>导入</span>

    </div>
    <div class="content">
      <el-row>
        <el-col :span="15">
          <div class="message">提示：请使用模板中的格式进行导入</div>
        </el-col>
      </el-row>
      <el-row>
<!--        <el-upload-->
<!--          id="upload"-->
<!--          class="upload-demo"-->
<!--          action="#"-->
<!--          drag-->
<!--          multiple>-->
<!--          <i class="el-icon-upload"></i>-->
<!--          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--        </el-upload>-->
        <div class="uploadArea">
          <i class="el-icon-upload"></i>
          <span><em><strong>&nbsp;点击上传文件</strong></em></span>
          <input id="upload" type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </div>
        <div class="fileListArea" v-show="upload.hasFile">
          <i :class="{'el-icon-success': !upload.hasWarn, 'el-icon-error': upload.hasWarn}"></i>
          <span>{{upload.fileName}}</span>
        </div>
        <div class="warningArea" v-show="upload.hasWarn">
          <i class="el-icon-warning"></i>
          <span>{{upload.warningMsg}}</span>
        </div>
      </el-row>
      <el-row>
      </el-row>
    </div>
    <div slot="footer">
      <el-button type="success" @click="exportTemplate" icon="el-icon-files">下载模板</el-button>
      <el-button type="primary" @click="commit" icon="fa fa-save">&nbsp;导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
const { exportExcel } = require('../excelOperation/Export2Excel') // 引入文件
export default {
  name: 'import-dialog',
  model: {
    prop: 'show',
    event: 'setshow'
  },
  props: {
    show: Boolean,
    templateConfig: {
      excelFileName: null, // 导出文件名
      excelHeader: [], // 文件列名(Label)
      excelHeaderVal: [], // 文件列名(Value)
      excelData: [], // 文件表格数据
      dateType: [], // 表格中日期列的格式 [列名(Label), 格式(month/day)]
      statusType: [] // 表格中的状态格式 [{statusName: 状态名称 ,statusCode: 状态属性名, statusEnum: 状态枚举值}, {...}]
    }
  },
  data () {
    return {
      mode: null,
      myShow: true,
      importData: [],
      regionList: [],
      upload: {
        hasFile: false,
        fileName: null,
        hasWarn: false,
        warningMsg: null
      }
    }
  },
  watch: {
    myShow () {
      if (!this.myShow) {
        this.$emit('setshow', !this.show)
        this.myShow = true
        this.upload.hasFile = false
        this.upload.hasWarn = false
      }
    }
  },
  created () {
    this.queryRegion()
  },
  methods: {
    showFileName (file) {
      if (!file) {
        this.upload.hasFile = false
        this.upload.hasWarn = false
      } else {
        this.upload.fileName = file?.name
        this.upload.hasFile = true
        this.upload.hasWarn = false
      }
    },
    importfxx (obj) {
      let _this = this
      // let inputDOM = this.$refs.inputer
      // console.log(_this)
      // console.log(inputDOM)
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0]
      var rABS = false // 是否将文件读取为二进制字符串
      var f = this.file
      _this.showFileName(f)
      if (f) {
        var reader = new FileReader()
        FileReader.prototype.readAsBinaryString = function (f) {
          var binary = ''
          var wb // 读取完成的数据
          var reader = new FileReader()
          reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result)
            var length = bytes.byteLength
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            var XLSX = require('xlsx')
            wb = XLSX.read(binary, {
              type: 'binary'
            })
            _this.importData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // outdata就是你想要的东西
          }
          reader.readAsArrayBuffer(f)
        }
        if (rABS) {
          reader.readAsArrayBuffer(f)
        } else {
          reader.readAsBinaryString(f)
        }
      }
    },
    exportExcel () {
      require.ensure([], () => {
        const tHeader = ['用户名', '姓名'] // 将对应的属性名转换成中文
        const filterVal = ['userName', 'realName'] // table表格中对应的属性名
        const list = [] // this.sels就是你想要导出的数据[{userName: '1001', realName: '张三'}]
        const data = this.formatJson(filterVal, list)
        exportExcel(tHeader, data, '列表excel')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    exportTemplate () {
      // exportExcel(this.templateConfig.excelHeader, [], this.templateConfig.excelFileName)
      let a = document.createElement('a')
      a.href = process.env.VUE_APP_BASE_URL + '/Template?templateName=' + this.templateConfig.excelFileName
      a.click()
    },
    commit () {
      var file = document.getElementById('upload').value // 获取输入框元素
      if (!file) { // 文件不存在
        this.upload.hasWarn = true
        this.upload.warningMsg = '请选择文件'
        return
      }
      if (this.importData.length === 0) {
        document.getElementById('upload').value = null
        this.upload.fileName = '请重新选择文件'
        this.upload.hasWarn = true
        this.upload.warningMsg = '文件中数据不存在'
        return
      }
      // 判断格式是否合法
      // let cnt = 0
      // this.templateConfig.excelHeader.forEach(item => {
      //   if (item in this.importData[0]) {
      //     cnt++
      //   }
      // })
      // if (cnt !== this.templateConfig.excelHeader.length) {
      //   document.getElementById('upload').value = null
      //   this.upload.fileName = '请重新选择文件'
      //   this.upload.hasWarn = true
      //   this.upload.warningMsg = '数据格式不正确！请使用模板中的格式进行导入'
      //   return
      // }

      this.importData = this.formatData(this.templateConfig.excelHeader, this.templateConfig.excelHeaderVal, this.importData)
      // 判断日期格式是否合法
      let isDateTypeLegal = this.validateDateType()
      // 判断区划是否存在
      let isRegionLegal = this.validateRegion()
      // 判断状态是否合法
      let isStatusLegal = this.validateStatus()
      // 符合要求
      if (isDateTypeLegal && isRegionLegal && isStatusLegal) {
        this.$emit('getImportData', this.importData)
        this.upload.hasFile = false
        this.upload.hasWarn = false
      } else {
        document.getElementById('upload').value = null
        this.upload.fileName = '请重新选择文件'
      }
    },
    /**
     * 判断日期格式是否合法
     */
    validateDateType () {
      if (!this.templateConfig.dateType) { // 不需要判断日期
        return true
      }
      let dateRegular
      let correctFormat
      if (this.templateConfig.dateType[1] === 'day') {
        dateRegular = /^(\d{4})-(\d{2})-(\d{2})$/
        correctFormat = 'YYYY-MM-DD'
      } else if (this.templateConfig.dateType[1] === 'month') {
        dateRegular = /^(\d{4})-(\d{2})$/
        correctFormat = 'YYYY-MM'
      }
      // 循环校验
      for (let i = 0; i < this.importData.length; i++) {
        if (!dateRegular.test(this.importData[i][this.templateConfig.dateType[0]]) && this.importData[i][this.templateConfig.dateType[0]]) {
          this.upload.hasWarn = true
          this.upload.warningMsg = '文件中数据第' + (i + 2) + '行日期格式不正确（应为' + correctFormat + '）'
          return false
        }
      }
      return true
    },
    async queryRegion () {
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.CommonMapper.queryRegion'
        }
      })
      this.regionList = data.data
    },
    /**
     * 判断区划是否存在
     */
    validateRegion () {
      if (!this.importData[0]['rgnCode']) {
        return true
      }
      for (let i = 0; i < this.importData.length; i++) {
        if (!this.regionList.some(b => this.importData[i].rgnCode.toString() === b.rgnCode && this.importData[i].rgnName.toString() === b.rgnName)) {
          // console.log(this.importData)
          // console.log(this.regionList)
          this.upload.hasWarn = true
          this.upload.warningMsg = '文件中数据第' + (i + 2) + '行区划编码或名称在系统中不存在'
          return false
        }
      }
      return true
    },
    /**
     * 判断状态是否合法
     */
    validateStatus () {
      if (!this.templateConfig.statusType) { // 不需要判断状态
        return true
      }
      for (let statusIndex = 0; statusIndex < this.templateConfig.statusType.length; statusIndex++) {
        let statusItem = this.templateConfig.statusType[statusIndex]
        let statusName = statusItem.statusName
        let statusCode = statusItem.statusCode
        for (let i = 0; i < this.importData.length; i++) {
          if (!statusItem.statusEnum.includes(this.importData[i][statusCode])) {
            this.upload.hasWarn = true
            this.upload.warningMsg = '文件中数据第' + (i + 2) + '行' + statusName + '信息不合法'
            return false
          }
        }
      }
      return true
    },
    formatData (header, headerVal, data) {
      let tmpData = []
      data.map(v => {
        let tmp = {}
        header.map((j, index) => {
          tmp[headerVal[index]] = v[j]
        })
        tmpData.push(tmp)
      })
      return tmpData
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .message {
    height: 30px;
    width: 100%;
  }
  .uploadArea {
    height:110px;
    width: 100%;
    position:relative;
    border: 1px dashed #72767b;
    border-radius: 5px;
    #upload {
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      position:absolute;
      background-color: #ff4334;
    }
    i {
      width: 100px;
      height: 100%;
      margin: 0 35%;
      font-size: 100px;
      cursor: pointer;
      position:absolute;
    }
    span {
      position:absolute;
      bottom: 10px;
      width: 100px;
      margin: 0 35%;
    }
  }
  .fileListArea {
    padding: 5px 50px 0px 3px;
    height: 20px;
    width: 100%;
    span {
      margin: 0 5px;
    }
    .el-icon-success {
      color: #5daf34;
    }
    .el-icon-error {
      color: #ff4334;
    }
  }
  .warningArea {
    width: 100%;
    margin: 3px;
    color: #ff4334;
    span {
      margin: 0 5px;
    }
  }
}
</style>
