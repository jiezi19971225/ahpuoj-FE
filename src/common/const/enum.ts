export enum ProblemDegree {
  All = '',
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

export const ProblemDegreeMap = {
  [ProblemDegree.All]: '全部',
  [ProblemDegree.Easy]: '简单',
  [ProblemDegree.Medium]: '中等',
  [ProblemDegree.Hard]: '困难',
}
