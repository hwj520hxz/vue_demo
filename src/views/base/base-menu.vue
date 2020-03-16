<template>
  <div class="base-menu">
    <el-menu
      router
      :mode="mode"
      :collapse="collapse"
      :menu-trigger="menuTrigger"
      :default-active="defaultActive"
      :unique-opened="uniqueOpened"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      :background-color="backgroundColor"
      :collapse-transition="false"
    >
      <menu-item v-for="menu in menuData" :menu="menu" :key="menu.code" :collapse="collapse" />
    </el-menu>
  </div>
</template>

<script>
import MenuItem from '@/components/menu-item'
export default {
  name: 'BaseMenu',
  components: {
    MenuItem
  },
  props: {
    mode: { // 模式，horizontal：横向 ， vertical：纵向
      type: String,
      default: 'vertical'
    },
    collapse: { // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      type: Boolean,
      default: false
    },
    uniqueOpened: { // 是否只保持一个子菜单的展开（仅在 mode 为 vertical 时可用）
      type: Boolean,
      default: true
    },
    menuTrigger: { // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)，可选值：hover，click
      type: String,
      default: 'hover'
    },
    defaultActive: { // 当前激活菜单的 index
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: '#f8f8f8'
    },
    activeTextColor: {
      type: String,
      default: '#ffd04b'
    },
    backgroundColor: { // 菜单背景颜色
      type: String,
      default: '#4B5C76'
    },
    menuData: { // 菜单数据
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
.base-menu {
  width: 100%;
  height: 100%;
  .el-menu {
    border: none;
  }
  /deep/ {
    .el-menu--collapse {
      width: 80px;
    }
    .menu-item {
      &.collapse-menu {
        height: 80px;
        line-height: 80px;
        .el-tooltip {
          padding: 0px 27px !important;
        }
      }
    }
    .el-menu > .el-menu-item [class^="fa"],
    .el-menu > .el-submenu > .el-submenu__title [class^="fa"] {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 15px;
      vertical-align: middle;
    }
    .el-menu--collapse > .el-menu-item [class^="fa"],
    .el-menu--collapse > .el-menu-item [class^="el-icon-"],
    .el-menu--collapse > .el-submenu > .el-submenu__title [class^="fa"],
    .el-menu--collapse > .el-submenu > .el-submenu__title [class^="el-icon-"] {
      width: 35px;
      height: 35px;
      color: #f8f8f8;
      line-height: 35px;
      position: relative;
      border-radius: 5px;
    }
    .el-menu--collapse > .el-menu-item [class^="fa"],
    .el-menu--collapse > .el-menu-item [class^="el-icon-"] {
      right: 6px;
      bottom: 10px;
    }
    .el-menu--collapse > .el-submenu > .el-submenu__title [class^="fa"],
    .el-menu--collapse > .el-submenu > .el-submenu__title [class^="el-icon-"] {
      right: -2px;
      bottom: 11px;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 1) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 1) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 1)
      > .el-submenu__title
      [class^="fa"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 1)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #985ce2;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 2) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 2) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 2)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 2)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #6a9ae1;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 3) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 3) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 3)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 3)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #45b1df;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 4) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 4) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 4)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 4)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #48d4d7;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 5) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 5) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 5)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 5)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #3089dc;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 6) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 6) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 6)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 6)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #e4474d;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 7) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 7) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 7)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 7)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #3398dc;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 8) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 8) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 8)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 8)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #985ce2;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 9) [class^="fa"],
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 9) [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 9)
      > .el-submenu__title
      [class^="fa"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 9)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #5baba0;
    }
    .el-menu--collapse > .el-menu-item:nth-of-type(10n + 10) [class^="fa"],
    .el-menu--collapse
      > .el-menu-item:nth-of-type(10n + 10)
      [class^="el-icon-"],
    .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 10)
      > .el-submenu__title
      [class^="fa"],
      .el-menu--collapse
      > .el-submenu:nth-of-type(10n + 10)
      > .el-submenu__title
      [class^="el-icon-"] {
      background: #1aa6b7;
    }
  }
}
</style>
