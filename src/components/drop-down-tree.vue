<template>
  <div>
    <el-input
      v-model="myLabel"
      placeholder="请选择值"
      :readonly="!queryable"
      :clearable="queryable"
      :disabled="disabled"
      v-on:click.native.stop="toggleTreeShow"
      @clear="clear"
      ref="myInput">
    </el-input>
    <el-tree
      :data="treeData"
      class="dialog-tree"
      @node-click="clickNode"
      :filter-node-method="filterRegionNode"
      v-show="isTreeShow"
      ref="myTree">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'drop-down-tree',
  props: {
    inputLabel: String,
    queryable: Boolean,
    disabled: Boolean,
    config: Object
  },
  model: {
    prop: 'inputLabel',
    event: 'getInputLabel'
  },
  data () {
    return {
      myConfig: {},
      isTreeShow: false,
      inputValue: null,
      myLabel: this.inputLabel,
      treeData: []
    }
  },
  watch: {
    myLabel (val) {
      if (!val) {
        this.$emit('getInputValue', null)
        this.$emit('getInputLabel', null)
      }
      if (this.queryable) {
        this.$refs.myTree.filter(val)
      }
    }
  },
  mounted () {
    this.setMyConfig()
    this.treeData = this.transArrayToTree(this.config.data)
    document.addEventListener('click', this.hideTree)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.hideTree)
  },
  methods: {
    /**
     * 设置配置
     */
    setMyConfig () {
      if (this.config) {
        this.myConfig = {
          id: this.config ?.id || 'id',
          pid: this.config ?.pid || 'pid',
          code: this.config ?.code || 'code',
          name: this.config ?.name || 'name'
        }
      } else {
        this.myConfig = {
          id: 'id',
          pid: 'pid',
          code: 'code',
          name: 'name'
        }
      }
    },
    /**
     * 数组转换成树型结构
     */
    transArrayToTree (data) {
      let { id, pid, code, name } = this.myConfig
      let map = {}
      let node
      let tree = []
      let i
      for (i = 0; i < data.length; i++) {
        map[data[i][id]] = data[i]
        data[i].children = []
        data[i].label = ((data[i][code] ? data[i][code] : '') + ' ' + (data[i][name] ? data[i][name] : ''))
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
    /**
     * 点击事件
     */
    clickNode (node) {
      if (node.children.length === 0) {
        this.isTreeShow = false
        this.myLabel = node[this.myConfig.name]
        this.$emit('getInputValue', node[this.myConfig.id])
        this.$emit('getInputLabel', node[this.myConfig.name])
      }
    },
    clear () {
      this.$emit('getInputValue', null)
      this.$emit('getInputLabel', null)
    },
    /**
     * 隐藏树
     */
    hideTree (e) {
      if (e.target !== this.$refs.myInput.$el && this.isTreeShow === true && e.target !== this.$refs.myTree.$el) {
        this.isTreeShow = false
      }
    },
    /**
     * 点击输入框时控制树的显示
     */
    toggleTreeShow () {
      if (!this.queryable) {
        this.isTreeShow = !this.isTreeShow
      } else {
        this.isTreeShow = true
      }
    },
    /**
     * 过滤树节点
     */
    filterRegionNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style scoped>
  .dialog-tree {
    position: absolute;
    z-index: 100;
    width: 100%;
    max-height: 1000%;
    overflow: auto;
    margin-top: 1%;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  /deep/ input {
    cursor: pointer;
  }
</style>

数据转换配置项
config: {
  id: 设置作为id的字段名,
  pid: 设置作为pid的字段名,
  code: 设置作为code的字段名,
  name: 设置作为name的字段名
}
下拉树配置项
queryable: 是否可查询
