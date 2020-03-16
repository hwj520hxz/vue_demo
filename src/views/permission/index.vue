<template>
  <div class="permission-index">
    <div class="left-aside">
      <menu-tree ref="menuTree"></menu-tree>
    </div>
    <div class="right-aside">
      <div class="tool-bar">
        <el-link icon="el-icon-document-checked" @click="authorization()">确认授权</el-link>
        <div class="split-line"></div>
        <el-link icon="el-icon-document-add" @click="$refs.roleList.onAdd()">新增角色</el-link>
        <div class="split-line"></div>
        <el-link icon="el-icon-circle-check" @click="$refs.roleList.toggleEnable({status: 1})">启用</el-link>
        <div class="split-line"></div>
        <el-link icon="el-icon-remove-outline" @click="$refs.roleList.toggleEnable({status: 0})">停用</el-link>
      </div>
      <div class="grid-content">
        <div class="right-top">
          <role-list
            ref="roleList"
            @selectMenu="menuIds => $refs['menuTree'].selectMenu(menuIds)"
            @queryUser="role => $refs['userList'].featchRoleUser(role)"
          ></role-list>
        </div>
        <div class="right-bottom">
          <user-list
            ref="userList"
            @addRoleUser="addRoleUser"
            @beforeAddRoleUser="beforeAddRoleUser"
            @removeRoleUser="removeRoleUser"
          ></user-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MenuTree from './menu-tree'
import RoleList from './role-list'
import UserList from './user-list'
export default {
  name: 'PermissionIndex',
  components: {
    MenuTree,
    RoleList,
    UserList
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    async authorization () {
      let roleIds = this.$refs['roleList'].selectedRoles.map(item => item.fid)
      let menuIds = this.$refs['menuTree'].$refs['menuTree'].getCheckedKeys().filter(item => item !== '-1')
      if (roleIds.length === 0) {
        this.$message.info('请选择角色！')
        return
      }
      await this.$api.add({
        data: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.insertRoleMenu',
          roleIds: JSON.stringify(roleIds),
          menuIds: JSON.stringify(menuIds)
        }
      })
      this.$message.success('授权成功！')
    },
    beforeAddRoleUser () {
      let roles = this.$refs['roleList'].selectedRoles
      if (roles.length === 0) {
        this.$message.info('请选择角色！')
        return
      }
      this.$refs['userList'].dialog.show = true
    },
    async addRoleUser () {
      let roleIds = this.$refs['roleList'].selectedRoles.map(item => item.fid)
      let userIds = this.$refs['userList'].selectedUsers.map(item => item.userId)
      await this.$api.add({
        data: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.insertRoleUser',
          roleIds: JSON.stringify(roleIds),
          userIds: JSON.stringify(userIds)
        }
      })
      this.$refs['userList'].featchRoleUser(this.$refs['roleList'].selectedRoles[0])
      this.$message.success('角色用户添加成功！')
    },
    async removeRoleUser (userIds) {
      let roleIds = this.$refs['roleList'].selectedRoles.map(item => item.fid)
      if (roleIds.length === 0) {
        this.$message.info('请选择角色！')
        return
      }
      await this.$api.remove({
        params: {
          mapperId: 'com.bosssoft.monitor.dao.RoleMapper.deleteRoleUser',
          roleIds: JSON.stringify(roleIds),
          userIds: JSON.stringify(userIds)

        }
      })
      this.$refs['userList'].featchRoleUser(this.$refs['roleList'].selectedRoles[0])
    }
  }
}
</script>
<style lang="scss" scoped>
.permission-index {
  width: 100%;
  height: 100%;
  display: flex;
  .left-aside {
    width: 210px;
    margin-right: 10px;
  }
  .right-aside {
    display: flex;
    flex-direction: column;
    width: calc(100% - 220px);
    .grid-content {
      flex: 1;
      display: flex;
      overflow: auto;
      flex-direction: column;
      border: 1px solid #d2d2d2;
      .right-top {
        flex: 1;
        padding: 10px 10px 0 10px;
      }
      .right-bottom {
        flex: 1;
        padding: 10px;
      }
    }
  }
}
</style>
