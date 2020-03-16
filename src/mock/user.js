// 用户数据模拟
const user = {
  'id': 3,
  'email': '946424684@qq.com',
  'avatar': null,
  'phone': '13645001431',
  'gender': 1,
  'birthday': '1992-01-09 00:00:00',
  'account': 'system',
  'userName': '系统管理员',
  'password': 'c4ca4238a0b923820dcc509a6f75849b',
  'isDeleted': 0,
  'isEnabled': 1,
  'isLocked': 0,
  'remark': null,
  'createBy': '系统管理员',
  'createUserId': 3,
  'createTime': '2019-06-08 14:53:33',
  'updateBy': null,
  'updateUserId': null,
  'updateTime': null,
  'sortCode': 1
}

export default {
  login: config => {
    return {
      success: true,
      data: user
    }
  }
}
