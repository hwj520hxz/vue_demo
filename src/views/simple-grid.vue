<template>
  <div class="demo2">
    <div class="tool-bar">
      <el-link icon="el-icon-document-add" @click="onAdd">新增</el-link>
      <div class="split-line"></div>
      <el-link icon="el-icon-refresh" @click="featchData">刷新</el-link>
    </div>
    <div class="grid-container">
      <el-table
        border
        stripe
        ref="table"
        :data="grid.rows"
        :height="grid.height"
        highlight-current-row
        v-loading="grid.loading"
        @selection-change="val => grid.selectedRow =val"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="field1" label="文本类型" align="left" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column
          width="100"
          align="center"
          prop="field2"
          label="枚举类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.field2 === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" align="right" label="数值类型" prop="field3" show-overflow-tooltip></el-table-column>
        <el-table-column width="150" align="right" label="金额类型" prop="field4" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.field4 | currency}}</template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          label="时间日期类型"
          prop="field5"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.field5 | dateTime('YYYY-MM-DD HH:mm:SS')}}</template>
        </el-table-column>
        <el-table-column prop="field6" label="长文本类型" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
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
        <span>标题 —— {{dialogMode.title}}</span>
      </div>
      <el-form ref="form" :rules="dialog.rules" :model="dialog.data" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="文本类型" prop="field1">
              <el-input v-model.trim="dialog.data.field1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="枚举类型" prop="field2">
              <el-select style="width: 100%;" v-model="dialog.data.field2">
                <el-option label="选项一" :value="1"></el-option>
                <el-option label="选项二" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单选类型" prop="field3">
              <el-radio v-model="dialog.data.field3" :label="1">男</el-radio>
              <el-radio v-model="dialog.data.field3" :label="2">女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="复选类型" prop="field4">
              <el-checkbox-group v-model="dialog.data.field4">
                <el-checkbox :label="1">A</el-checkbox>
                <el-checkbox :label="2">B</el-checkbox>
                <el-checkbox :label="3">C</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数值类型" prop="field5">
              <el-input-number style="width: 100%;" v-model="dialog.data.field5" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间日期类型" prop="field6">
              <el-date-picker
                type="datetime"
                style="width: 100%;"
                placeholder="选择日期"
                v-model="dialog.data.field6"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日期范围类型" prop="field7">
              <el-date-picker
                style="width: 100%;"
                type="datetimerange"
                range-separator="至"
                end-placeholder="结束日期"
                start-placeholder="开始日期"
                v-model="dialog.data.field7"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="长文本类型" prop="field8">
              <el-input
                maxlength="50"
                type="textarea"
                show-word-limit
                placeholder="请输入内容"
                v-model="dialog.data.field8"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  name: '',
  data () {
    return {
      grid: {
        rows: [],
        height: null,
        loading: false,
        selectedRow: []
      },
      dialog: {
        mode: null,
        show: false,
        data: {
          field1: null,
          field2: null,
          field3: null,
          field4: null,
          field5: null,
          field6: null,
          field7: null,
          field8: null
        },
        rules: {
          field1: [
            { required: true, message: '请选择名称！' }
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
          mapperId: 'com.bosssoft.monitor.dao.ThresholdMapper.thresholds'
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
          field1: '',
          field2: 1,
          field3: 1,
          field4: [1, 2],
          field5: 5,
          field6: moment().format('YYYY-MM-DD HH:mm:ss'),
          field7: [moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')],
          field8: ''
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
    async onDelete (row) {
      try {
        await this.validateBeforeDelete(row)
        this.$confirm('您确定要删除当前选中的记录吗?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.remove({
            params: {
              mapperId: 'com.bosssoft.monitor.dao.ThresholdMapper.delete',
              ids: JSON.stringify(this.grid.selectedRow.map(item => item.id))
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
        // 新增保存前校验
        let { data } = await this.$api.queryData({
          params: {
            mapperId: 'com.bosssoft.monitor.dao.ThresholdMapper.isExists',
            isList: false,
            name: this.dialog.data.field1
          }
        })
        if (data.data.count > 0) {
          this.$message.info('当前编码已存在，请重新输入！')
          return Promise.reject(new Error())
        }
      }
      if (this.dialog.mode === 2) {
        // 编辑保存前校验
      }
      return Promise.resolve()
    },
    async onSave () {
      try {
        await this.validateBeforeSave()
        if (this.dialog.mode === 1) {
          await this.$api.add({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.ThresholdMapper.insertSelective',
              ...this.dialog.data
            }
          })
        } else {
          let model = this.dialog.data
          await this.$api.modify({
            data: {
              mapperId: 'com.bosssoft.monitor.dao.ThresholdMapper.updateByPrimaryKeySelective',
              fid: model.fid,
              field1: model.field1,
              field2: model.field2,
              field3: model.field3
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
    resize () {
      this.grid.height = this.$el.clientHeight - 31
    }
  }
}
</script>
<style lang="scss" scoped>
.demo2 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .grid-container {
    flex: 1;
  }
}
</style>
