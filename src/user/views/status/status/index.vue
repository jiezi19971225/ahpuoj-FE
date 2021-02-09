<template>
  <div class="content">
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <el-button size="mini" round="round" @click="handleResetSearch">重置</el-button>
            <el-button
              size="mini"
              round="round"
              @click="handleSearchMyRecord"
              :disabled="$store.getters.username.length === 0"
              >我的记录</el-button
            >
          </li>
          <li>
            <div class="section__title">按问题检索：</div>
            <div class="siderbar__searchbar__wrapper">
              <el-input
                size="small"
                style="max-width: 20em"
                :placeholder="!isContest ? '请输入问题名/ID' : '请输入题号(如A)'"
                @keyup.enter.native="handleSearch"
                v-model="queryParams.queryParam"
                maxlength="20"
                clearable="clearable"
              >
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </div>
          </li>
          <li>
            <div class="section__title">按用户检索：</div>
            <div class="siderbar__searchbar__wrapper">
              <el-input
                size="small"
                style="max-width: 20em"
                placeholder="请输入用户昵称"
                @keyup.enter.native="handleSearch"
                v-model="queryParams.nick"
                maxlength="20"
                clearable="clearable"
              >
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </div>
          </li>
          <li>
            <div class="section__title">按语言检索：</div>
            <ul class="button-list">
              <li>
                <el-button
                  size="mini"
                  round="round"
                  :class="[queryParams.language === '' ? 'is-active' : '']"
                  @click="
                    handleSearch({
                      language: '',
                    })
                  "
                  >全部</el-button
                >
              </li>
              <template v-for="(item, index) in langList">
                <li v-if="item.available" :key="item.name">
                  <el-button
                    size="mini"
                    round="round"
                    :class="[queryParams.language === index ? 'is-active' : '']"
                    @click="
                      handleSearch({
                        language: index,
                      })
                    "
                    >{{ item.name }}</el-button
                  >
                </li>
              </template>
            </ul>
          </li>
          <li>
            <div class="section__title">按结果检索：</div>
            <ul class="button-list">
              <li v-for="item in searchableResultList" :key="item.code">
                <el-button
                  size="mini"
                  round="round"
                  :class="[queryParams.result === item.code ? 'is-active' : '']"
                  @click="
                    handleSearch({
                      result: item.code,
                    })
                  "
                  >{{ item.name }}</el-button
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="main has__pagination">
        <oj-paginator
          style="float: left"
          async-path
          @change="fetchDataList"
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        ></oj-paginator>
        <el-table size="small" :data="dataList" v-loading="tableLoading">
          <el-table-column label="ID" prop="solution_id" width="60"></el-table-column>
          <el-table-column label="用户" min-width="70"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.user_id } }">
                <div class="user__avatar__wrapper">
                  <img class="user__avatar" :src="getAbsoluteUrl(scope.row.avatar)" />
                </div>
              </router-link> </template
          ></el-table-column>
          <el-table-column min-width="180"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'userinfo', params: { id: scope.row.user_id } }"
                ><span>{{ `${scope.row.nick}` }}</span></router-link
              >
            </template></el-table-column
          >
          <el-table-column label="问题" min-width="180"
            ><template slot-scope="scope">
              <router-link
                :to="
                  isContest
                    ? { name: 'contestProblem', params: { id: contestId, num: scope.row.num } }
                    : { name: 'problem', params: { id: scope.row.problem_id } }
                "
                >{{
                  !isContest
                    ? `P${scope.row.problem_id} ${scope.row.problem_title}`
                    : `${getAlphabetNumber(scope.row.num)} ${scope.row.problem_title}`
                }}</router-link
              >
            </template></el-table-column
          >
          <el-table-column label="评测状态" min-width="80"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'solution', params: { id: scope.row.solution_id } }">
                <el-button size="mini" :type="calcRerultType(scope.row.result)">{{
                  resultList[scope.row.result] ? resultList[scope.row.result].name : ''
                }}</el-button>
              </router-link>
            </template></el-table-column
          >
          <el-table-column label="语言" min-width="80"
            ><template slot-scope="scope"
              ><span>{{ langList[scope.row.language].name }}</span></template
            ></el-table-column
          >
          <el-table-column label="时间" min-width="80"
            ><template slot-scope="scope"
              ><span>{{ `${scope.row.time}ms` }}</span></template
            ></el-table-column
          >
          <el-table-column label="内存" min-width="80"
            ><template slot-scope="scope"
              ><span>{{ `${scope.row.memory}KB` }}</span></template
            ></el-table-column
          >
          <el-table-column label="代码长度" min-width="80"
            ><template slot-scope="scope"
              ><span>{{ calcCodeLength(scope.row.code_length) }}</span></template
            ></el-table-column
          >
          <el-table-column label="评测时间" min-width="75"
            ><template slot-scope="scope">
              <div style="word-break: break-word; white-space: pre-line">
                {{ scope.row.judgetime }}
              </div>
            </template></el-table-column
          >
          <el-table-column label="公开" min-width="60" v-if="!isContest"
            ><template slot-scope="scope"
              ><span>{{ scope.row.public == 1 ? '是' : '否' }}</span></template
            ></el-table-column
          >
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from '@user/api/nologints'
import { resultList } from '@common/const'
import { onActivated, onDeactivated, onUnmounted, ref, toRefs } from '@vue/composition-api'
import { useLangList, useMapState, usePagination, useQuery, useRoute, useRouter } from '@common/use'
import { isEmpty } from 'lodash'
import { getAlphabetNumber, getAbsoluteUrl } from '@common/utils'

const searchableResultList = resultList.filter(val => val.code >= 4 && val.code <= 11)
searchableResultList.unshift({
  // @ts-ignore
  code: '',
  name: '全部',
  description: '',
})

export default {
  name: 'status',
  props: {
    isContest: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const defaultQuery = {
      queryParam: '',
      nick: '',
      language: '',
      result: '',
    }
    const toRefProps = toRefs(props)

    const route = useRoute()
    const router = useRouter()
    const { query, queryParams } = useQuery(defaultQuery)
    const states = useMapState({
      user: (state: any) => state.user,
    })
    const pagination = usePagination({
      perpage: 30,
    })
    const langList = useLangList()

    const tableLoading = ref(false)
    const contestId = ref(0)
    const dataList = ref<SolutionInfo[]>([])

    const fetchDataList = async () => {
      try {
        tableLoading.value = true
        const res = await nologinApi.getSolutionList<CommonPaginationResponse<SolutionInfo[]>>({
          contest_id: contestId.value,
          page: pagination.page,
          perpage: pagination.perpage,
          param: queryParams.queryParam,
          username: queryParams.nick,
          language: queryParams.language,
          result: queryParams.result,
        })
        dataList.value = res.data
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      } finally {
        tableLoading.value = false
      }
    }

    let timer
    onActivated(() => {
      if (toRefProps.isContest.value) {
        contestId.value = +route.value.params.id
      } else {
        contestId.value = 0
      }
      if (!isEmpty(query.value)) {
        Object.assign(queryParams, query.value)
      }
      timer = setInterval(() => {
        fetchDataList()
      }, 10000)
      fetchDataList()
    })

    onDeactivated(() => {
      clearInterval(timer)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    const calcRerultType = result => {
      if (result === 4) {
        return 'success'
      }
      return 'danger'
    }

    const calcCodeLength = codeLength => {
      return `${Number(codeLength / 1000).toFixed(2)}KB`
    }

    const handleSearch = (queryObj = {}) => {
      Object.assign(queryParams, queryObj)
      pagination.page.value = 1
      router.push({
        query: {
          ...query.value,
          ...queryParams,
        },
      })
      fetchDataList()
    }

    const handleResetSearch = () => {
      handleSearch(defaultQuery)
    }

    const handleSearchMyRecord = () => {
      queryParams.nick = states.user.nick
      handleSearch()
    }

    return {
      ...pagination,
      queryParams,
      dataList,
      tableLoading,
      resultList: Object.freeze(resultList),
      searchableResultList: Object.freeze(searchableResultList),
      langList,

      fetchDataList,
      handleSearch,
      handleSearchMyRecord,
      handleResetSearch,
      getAlphabetNumber,
      getAbsoluteUrl,
      calcRerultType,
      calcCodeLength,
    }
  },
}
</script>
<style lang="scss" scoped>
.user__avatar__wrapper {
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
}
</style>
