<template>
  <div class="menu-tree">
    <el-input placeholder="搜索" class="search-input" v-model="filterText">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-tree
      ref="menuTree"
      class="tree-view menu-tree-list"
      show-checkbox
      expand-on-click-node
      :default-expanded-keys="['-1']"
      node-key="id"
      :data="menus"
      @check-change="onCheckChange"
      :props="{label:'name',children:'children'}"
      :filter-node-method="filterNode"
    ></el-tree>
  </div>
</template>
<script>
export default {
  name: 'MenuTree',
  data () {
    return {
      rawMenus: [],
      menus: [{
        id: '-1',
        name: '菜单列表',
        children: []
      }],
      filterText: null
    }
  },
  created () {
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
    }
  },
  mounted () {
    this.featchMenu()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    async featchMenu () {
      let { data } = await this.$api.queryData({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.MenuMapper.menus'
        }
      })
      this.rawMenus = data.data
      this.initMenuData(data.data)
    },
    initMenuData (aMenuData) {
      let rootMenu = aMenuData.filter(item1 => {
        return !aMenuData.find(item2 => {
          return item2.id === item1.parentId
        })
      })
      rootMenu.forEach(item => {
        this.getChildMenu(item, aMenuData)
      })
      this.menus[0].children = rootMenu
    },
    getChildMenu (pMenu, aMenuData) {
      pMenu.children = []
      aMenuData.forEach(item => {
        if (item.parentId === pMenu.id) {
          pMenu.children.push(item)
          this.getChildMenu(item, aMenuData)
        }
      })
    },
    selectMenu (menuIds) {
      this.$refs['menuTree'].setCheckedKeys(menuIds)
    },
    onCheckChange (data, isChecked) {
      if (data.menuCode === '0404' && isChecked) {
        this.$refs.menuTree.setChecked(this.rawMenus.find(item => item.menuCode === '0405')?.id, false)
      }
      if (data.menuCode === '0405' && isChecked) {
        this.$refs.menuTree.setChecked(this.rawMenus.find(item => item.menuCode === '0404')?.id, false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-tree {
  width: 100%;
  height: 100%;
  /deep/ {
    .search-input {
      .el-input__inner {
        border-radius: 0;
        border-width: 0 0 1px 0;
      }
      .el-input__inner:hover,
      .el-input__inner:focus {
        border-color: #dcdfe6;
      }
      .el-input-group__append {
        border-width: 0 0 1px 0;
      }
    }
    .menu-tree-list {
      margin: 10px 0 0 0;
      .el-checkbox {
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
