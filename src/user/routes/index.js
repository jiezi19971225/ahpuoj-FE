const layout = () => import('../views/Layout.vue')

export default [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '',
        name: 'index',
        meta: {
          title: '首页 - AHPUOJ',
        },
        component: () => import('../views/home'),
      },
      {
        path: 'findpass',
        name: 'findpass',
        meta: {
          title: '找回密码 - AHPUOJ',
        },
        component: () => import('../views/findpass'),
      },
      {
        path: 'resetpass',
        name: 'resetpass',
        meta: {
          title: '重设密码 - AHPUOJ',
        },
        component: () => import('../views/resetpass'),
      },
      {
        path: 'problemset',
        name: 'problemSet',
        meta: {
          keepAlive: true,
          title: '问题集 - AHPUOJ',
        },
        component: () => import('../views/problemSet'),
      },
      {
        path: 'issues',
        name: 'issueList',
        meta: {
          keepAlive: true,
          title: '讨论区 - AHPUOJ',
        },
        component: () => import('../views/issueList/mainIssueList'),
      },
      {
        path: 'issue/:id',
        name: 'issue',
        component: () => import('../views/issue'),
      },
      {
        path: 'problem/:id/issues',
        name: 'problemIssueList',
        meta: {
          keepAlive: true,
        },
        component: () => import('../views/issueList/problemIssutList'),
      },
      {
        path: 'status',
        name: 'status',
        meta: {
          keepAlive: true,
          title: '评测机 - AHPUOJ',
        },
        component: () => import('../views/status/normalStatus'),
      },
      {
        path: 'contest/:id/status',
        name: 'contestStatus',
        meta: {
          keepAlive: true,
          title: '评测机 - AHPUOJ',
        },
        component: () => import('../views/status/contestStatus'),
      },
      {
        path: 'contest/:id/rank',
        name: 'contestRank',
        component: () => import('../views/contestRank'),
      },
      {
        path: 'contest/:id/teamrank',
        name: 'contestTeamRank',
        component: () => import('../views/contestTeamRank'),
      },
      {
        path: 'problem/:id',
        name: 'problem',
        component: () => import('../views/problem'),
      },
      {
        path: 'contest/:id/problem/:num',
        name: 'contestProblem',
        component: () => import('../views/problem'),
      },
      {
        path: 'contests',
        name: 'contestList',
        meta: {
          keepAlive: true,
          title: '竞赛&作业 - AHPUOJ',
        },
        component: () => import('../views/contestList'),
      },
      {
        path: 'series/:id',
        name: 'series',
        component: () => import('../views/series'),
      },
      {
        path: 'serieses',
        name: 'seriesList',
        meta: {
          keepAlive: true,
          title: '系列赛 - AHPUOJ',
        },
        component: () => import('../views/seriesList'),
      },
      {
        path: 'ranklist',
        name: 'ranklist',
        meta: {
          keepAlive: true,
          title: '排名 - AHPUOJ',
        },
        component: () => import('../views/ranklist'),
      },
      {
        path: 'contest/:id',
        name: 'contest',
        component: () => import('../views/contest'),
      },
      {
        path: 'solution/:id',
        name: 'solution',
        component: () => import('../views/solution'),
      },
      {
        path: 'account',
        name: 'account',
        meta: {
          title: '账号设置 - AHPUOJ',
        },
        component: () => import('../views/accountSetting'),
      },
      {
        path: 'myreplys',
        name: 'myreplys',
        meta: {
          title: '查看回复 - AHPUOJ',
        },
        component: () => import('../views/myreplys'),
      },
      {
        path: 'userinfo/:id',
        name: 'userinfo',
        component: () => import('../views/userinfo'),
      },
      // hack方法 只刷新路由
      {
        path: 'refresh',
        name: 'refresh',
        component: () => import('../views/refresh'),
      },

      // 404路由
      {
        path: '404',
        name: '404Page',
        component: () => import('../views/errors/404'),
      },
      {
        path: '*',
        component: () => import('../views/errors/404'),
      },
    ],
  },
]
