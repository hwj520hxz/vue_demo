// import store from '@/store'
// 单位端菜单数据
const menus = [
  // {
  //   'id': 0,
  //   'code': 'permission',
  //   'name': '权限设置',
  //   'target': 'component',
  //   'component': 'permission',
  //   'sortCode': 1
  // }
  {
    'id': 1,
    'parentId': null,
    'code': 'qggglc',
    'name': '全国改革历程',
    'sortCode': 1
  },
  {
    'id': 11,
    'parentId': 1,
    'code': 'gglcsjwh',
    'name': '改革历程数据维护',
    'target': 'component',
    'component': 'reform-course-data-maintenance',
    'sortCode': 1
  },
  {
    'id': 12,
    'parentId': 1,
    'code': 'qgcjsjwh',
    'name': '全国采集数据维护',
    'target': 'component',
    'component': 'collect-data-maintenance',
    'sortCode': 2
  },
  {
    'id': 13,
    'parentId': 1,
    'code': 'cyptjrwh',
    'name': '查验平台接入维护',
    'target': 'component',
    'component': 'platform-access-maintenance',
    'sortCode': 3
  },
  {
    'id': 14,
    'parentId': 1,
    'code': 'ggsssjwh',
    'name': '改革实施数据维护',
    'target': 'component',
    'component': 'reform-impl-data-maintenance',
    'sortCode': 4
  },
  {
    'id': 2,
    'parentId': null,
    'code': 'zyggqk',
    'name': '中央改革情况',
    'sortCode': 1
  },
  {
    'id': 21,
    'parentId': 2,
    'code': 'jgzfffwh',
    'name': 'uKey/机构证书发放维护',
    'target': 'component',
    'component': 'certificate-issue-maintenance',
    'sortCode': 2
  },
  {
    'id': 3,
    'parentId': null,
    'code': 'yjjk',
    'name': '预警监控',
    'sortCode': 1
  },
  {
    'id': 31,
    'parentId': 3,
    'code': 'ykpdwwh',
    'name': '应开票单位维护',
    'target': 'component',
    'component': 'makebill-agency-maintenance',
    'sortCode': 1
  },
  {
    'id': 4,
    'parentId': null,
    'code': 'qgylpjgg',
    'name': '全国医疗票据改革',
    'sortCode': 1
  },
  {
    'id': 41,
    'parentId': 4,
    'code': 'ylggqkwh',
    'name': '医疗改革情况维护',
    'target': 'component',
    'component': 'medial-reform',
    'sortCode': 1
  },
  {
    'id': 42,
    'parentId': 4,
    'code': 'ylhksjwh',
    'name': '医疗换开数据维护',
    'target': 'component',
    'component': 'medial-bill-switch',
    'sortCode': 1
  },
  {
    'id': 43,
    'parentId': 4,
    'code': 'ylrzsjwh',
    'name': '医疗入账数据维护',
    'target': 'component',
    'component': 'medial-bill-account',
    'sortCode': 1
  },
  {
    'id': 44,
    'parentId': 4,
    'code': 'dwsxsjwh',
    'name': '单位上线数据维护',
    'target': 'component',
    'component': 'onlineAgen-data',
    'sortCode': 1
  }
]
export default {
  menu: config => {
    return {
      success: true,
      data: menus
    }
  }
}
