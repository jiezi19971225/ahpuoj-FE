const getters = {
  token: (state) => state.user.token,
  username: (state) => state.user.username,
  userId: (state) => state.user.id,
  userNick: (state) => state.user.nick,
  userRole: (state) => state.user.role,
  userAvatar: (state) => state.user.avatar,

  // 是否已经动态生产了路由
  isGeneratedRoutes: (state) => state.user.isGeneratedRoutes,

  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  errorLogs: (state) => state.errorLog.logs,
};
export default getters;
