/**
 * 异步组件库
 */
export default {
  namespaced: true,
  state: {
    asyncComponents: {
      'simple-grid': () =>
        import('@/views/simple-grid' /* webpackChunkName: "permission" */),
      'paging-grid': () =>
        import('@/views/paging-grid' /* webpackChunkName: "permission" */),
      // 权限管理
      'permission': () =>
        import('@/views/permission/index' /* webpackChunkName: "permission" */),
      // 全国改革历程
      'reform-course-data-maintenance': () =>
        import('@/views/nationwide-reform-course/reform-course-data-maintenance/index' /* webpackChunkName: "reform-course-data-maintenance" */),
      'platform-access-maintenance': () =>
        import('@/views/nationwide-reform-course/platform-access-maintenance' /* webpackChunkName: "platform-access-maintenance" */),
      'collect-data-maintenance': () =>
        import('@/views/nationwide-reform-course/collect-data-maintenance' /* webpackChunkName: "collect-data-maintenance" */),
      'reform-impl-data-maintenance': () =>
        import('@/views/nationwide-reform-course/reform-impl-data-maintenance' /* webpackChunkName: "collect-data-maintenance" */),
      // 中央改革情况
      'certificate-issue-maintenance': () =>
        import('@/views/reform-situation/certificate-issue-maintenance' /* webpackChunkName: "certificate-issue-maintenance" */),
      // 预警监控
      'makebill-agency-maintenance': () =>
        import('@/views/warning-monitor/makebill-agency-maintenance' /* webpackChunkName: "makebill-agency-maintenance" */),
      // 全国医疗票据改革
      'medial-reform': () =>
        import('@/views/nationwide-medial-reform/medial-reform' /* webpackChunkName: "medial-reform" */),
      'medial-bill-switch': () =>
        import('@/views/nationwide-medial-reform/medial-bill-switch' /* webpackChunkName: "medial-bill-switch" */),
      'medial-bill-account': () =>
        import('@/views/nationwide-medial-reform/medial-bill-account' /* webpackChunkName: "medial-bill-switch" */),
      'onlineAgen-data': () =>
        import('@/views/nationwide-medial-reform/onlineAgen-data' /* webpackChunkName: "onlineAgen-data" */)
    }
  }
}
