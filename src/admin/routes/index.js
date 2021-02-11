const layout = () => import('../layout/index.vue')

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    当设置该属性，只有在 roles 列表中的角色才可访问该页面，否则一律重定向到 404
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export default [
  {
    path: '/redirect',
    component: layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../views/redirect/index'),
      },
    ],
  },
  {
    path: '/admin',
    component: layout,
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          icon: 'dashboard',
          title: '首页',
        },
        component: () => import('../views/home'),
      },
    ],
  },
  {
    path: '/admin/new',
    component: layout,
    redirect: '/admin/new/list',
    children: [
      {
        path: 'add',
        name: 'adminAddNew',
        hidden: true,
        meta: {
          title: '添加新闻',
          activeMenu: '/admin/new/list',
          roles: ['admin'],
        },
        component: () => import('../views/new/addNew'),
      },
      {
        path: ':id/edit',
        name: 'adminEditNew',
        hidden: true,
        meta: {
          title: '编辑新闻',
          activeMenu: '/admin/new/list',
          roles: ['admin'],
        },
        component: () => import('../views/new/editNew'),
      },
      {
        path: 'list',
        name: 'adminNewList',
        meta: {
          title: '新闻列表',
          icon: 'file-text',
          roles: ['admin'],
        },
        component: () => import('../views/new/newList'),
      },
    ],
  },
  {
    path: '/admin/user',
    component: layout,
    redirect: '/admin/user/list',
    children: [
      {
        path: 'list',
        name: 'adminUserList',
        meta: {
          title: '用户列表',
          icon: 'user',
        },
        component: () => import('../views/user/userList'),
      },
    ],
  },
  {
    path: '/admin/team',
    component: layout,
    redirect: '/admin/team/list',
    children: [
      {
        path: 'list',
        name: 'adminTeamList',
        meta: {
          icon: 'team',
          title: '团队列表',
        },
        component: () => import('../views/team/teamList'),
      },
      {
        path: ':id/manage',
        name: 'adminTeamManage',
        hidden: true,
        meta: {
          title: '团队管理',
          activeMenu: '/admin/team/list',
        },
        component: () => import('../views/team/teamManage'),
      },
    ],
  },
  {
    path: '/admin/problem',
    component: layout,
    meta: {
      icon: 'problem',
      title: '问题管理',
    },
    children: [
      {
        path: 'add',
        name: 'adminAddProblem',
        meta: {
          title: '添加问题',
        },
        component: () => import('../views/problem/addProblem'),
      },
      {
        path: ':id/edit',
        name: 'adminEditProblem',
        hidden: true,
        meta: {
          title: '编辑问题',
          activeMenu: '/admin/problem/list',
        },
        component: () => import('../views/problem/editProblem'),
      },
      {
        path: ':id/data',
        name: 'adminProblemData',
        hidden: true,
        meta: {
          title: '编辑问题数据',
          activeMenu: '/admin/problem/list',
        },
        component: () => import('../views/problem/problemData'),
      },
      {
        path: 'import',
        name: 'adminImportProblem',
        meta: {
          title: '导入问题',
          roles: ['admin'],
        },
        component: () => import('../views/problem/importProblem'),
      },
      {
        path: 'rejudgeAndReassign',
        name: 'adminRejudgeAndReassignProblem',
        meta: {
          title: '重判&重排',
        },
        component: () => import('../views/problem/rejudgeAndReassignProblem'),
      },
      {
        path: 'list',
        name: 'adminProblemList',
        meta: {
          title: '问题列表',
        },
        component: () => import('../views/problem/problemList'),
      },
    ],
  },
  {
    path: '/admin/tag',
    component: layout,
    children: [
      {
        path: '',
        name: 'adminTagList',
        meta: {
          icon: 'tag',
          title: '标签列表',
          roles: ['admin'],
        },
        component: () => import('../views/tag/tag_list'),
      },
    ],
  },
  {
    path: '/admin/contest',
    component: layout,
    meta: {
      icon: 'champion',
      title: '竞赛&作业管理',
    },
    children: [
      {
        path: 'add',
        name: 'adminAddContest',
        meta: {
          title: '添加竞赛&作业',
        },
        component: () => import('../views/contest/addContest'),
      },
      {
        path: ':id/edit',
        name: 'adminEditContest',
        hidden: true,
        meta: {
          title: '编辑竞赛&作业',
          activeMenu: '/admin/contest/list',
        },
        component: () => import('../views/contest/editContest'),
      },
      {
        path: ':id/manage',
        name: 'adminContestManage',
        hidden: true,
        meta: {
          title: '竞赛&作业人员管理',
          activeMenu: '/admin/contest/list',
        },
        component: () => import('../views/contest/contestManage'),
      },
      {
        path: ':id/teammanage',
        name: 'adminContestTeamManage',
        hidden: true,
        meta: {
          title: '竞赛&作业(团队赛)人员管理',
          activeMenu: '/admin/contest/list',
        },
        component: () => import('../views/contest/contestTeamManage'),
      },
      {
        path: 'list',
        name: 'adminContestList',
        meta: {
          title: '竞赛&作业列表',
        },
        component: () => import('../views/contest/contestList'),
      },
      {
        path: 'series',
        name: 'adminSeriesList',
        meta: {
          title: '系列赛列表',
        },
        component: () => import('../views/contest/seriesList'),
      },
      {
        path: ':id/seriermanage',
        name: 'adminSeriesManage',
        hidden: true,
        meta: {
          title: '系列赛管理',
          activeMenu: '/admin/contest/series',
        },
        component: () => import('../views/contest/seriesManage'),
      },
    ],
  },
  {
    path: '/admin/permission',
    component: layout,
    children: [
      {
        path: '',
        name: 'adminPermissionManage',
        meta: {
          icon: 'add_user',
          title: '权限管理',
          roles: ['admin'],
        },
        component: () => import('../views/permission'),
      },
    ],
  },
  {
    path: '/admin/generator',
    component: layout,
    children: [
      {
        path: '',
        name: 'adminAccountGenerator',
        meta: {
          icon: 'add_user',
          title: '账号生成器',
        },
        component: () => import('../views/generator'),
      },
    ],
  },
  {
    path: '/admin/settings',
    component: layout,
    children: [
      {
        path: '',
        name: 'adminSetting',
        meta: {
          icon: 'setting',
          title: '设置',
          roles: ['admin'],
        },
        component: () => import('../views/settings'),
      },
    ],
  },
  // 404路由
  {
    path: '/admin/*',
    component: layout,
    hidden: true,
    children: [
      {
        path: '/admin/404',
        name: 'admin404Page',
        meta: {
          title: '404',
          noCache: true,
        },
        component: () => import('../views/errors/404'),
      },
      {
        path: '',
        name: 'admin404',
        meta: {
          title: '404',
          noCache: true,
        },
        component: () => import('../views/errors/404'),
      },
    ],
  },
]
