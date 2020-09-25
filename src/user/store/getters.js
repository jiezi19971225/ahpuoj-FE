const getters = {
  token: (state) => state.user.token,
  username: (state) => state.user.username,
  userId: (state) => state.user.id,
  userNick: (state) => state.user.nick,
  userRole: (state) => state.user.role,
  userAvatar: (state) => state.user.avatar,
  userDefunct: (state) => state.user.defunct,
  tagId: (state) => state.bus.tagId,

  solutionQueryParam: (state) => state.bus.solutionQueryParam,
  solutionUserNick: (state) => state.bus.solutionUserNick,
  solutionLanguage: (state) => state.bus.solutionLanguage,
  solutionResult: (state) => state.bus.solutionResult,
};
export default getters;
