import { get } from '@common/axios/request'

export const getNewList = get('/news')
export const getProblemList = get('/problems')
export const getAllTags = get('/alltags')
