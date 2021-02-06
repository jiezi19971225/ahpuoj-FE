<template>
  <div class="content">
    <div class="content__main">
      <div class="siderbar">
        <ul class="siderbar__item__list">
          <li>
            <el-button size="mini" round="round" @click="handleSearchByResetConf">重置</el-button>
          </li>
          <li>
            <div class="section__title">查找问题：</div>
            <div class="siderbar__searchbar__wrapper">
              <el-input
                size="small"
                style="max-width: 20em"
                placeholder="请输入问题名或ID"
                @keyup.enter.native="handleSearch"
                v-model="queryParams.queryParam"
                maxlength="20"
                clearable="clearable"
              >
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
              </el-input>
            </div>
            <div class="tags__wrapper"></div>
          </li>
          <li>
            <div class="section__title">按难度检索：</div>
            <ul class="button-list">
              <li v-for="item in problemDegreeList" :key="item.value">
                <el-button
                  size="mini"
                  round="round"
                  :class="[
                    queryParams.level.toString() === item.value.toString() ? 'is-active' : '',
                  ]"
                  @click="handleSearchByLevel(item.value)"
                  >{{ item.desc }}</el-button
                >
              </li>
            </ul>
          </li>
          <li>
            <div class="section__title">按标签检索：</div>
            <ul class="button-list">
              <li v-for="tag in tags" :key="tag.id">
                <el-button
                  size="mini"
                  round="round"
                  :class="[queryParams.tagId.toString() === tag.id.toString() ? 'is-active' : '']"
                  @click="handleSearchByTag(tag.id)"
                  >{{ tag.name }}</el-button
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="main has__pagination">
        <oj-paginator
          style="float: left"
          @change="fetchDataList"
          async-path
          :current-page.sync="page"
          :page-size.sync="perpage"
          :total="total"
        >
        </oj-paginator>
        <el-table size="small" :data="dataList" v-loading="tableLoading" row-key="id">
          <el-table-column width="40"
            ><template slot-scope="scope">
              <svg-icon name="ok" v-if="scope.row.status == 1"></svg-icon>
              <svg-icon name="wrong" v-else-if="scope.row.status == 2"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id" width="60"></el-table-column>
          <el-table-column label="标题" min-width="160"
            ><template slot-scope="scope">
              <router-link :to="{ name: 'problem', params: { id: scope.row.id } }">{{
                scope.row.title
              }}</router-link>
            </template></el-table-column
          >
          <el-table-column label="难度" min-width="60" align="center"
            ><template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.level == 0" type="success" effect="dark"
                >简单</el-tag
              >
              <el-tag size="small" v-if="scope.row.level == 1" type="warnning" effect="dark"
                >中等</el-tag
              >
              <el-tag size="small" v-if="scope.row.level == 2" type="danger" effect="dark"
                >困难</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="标签" min-width="160" align="center"
            ><template slot-scope="scope">
              <el-tag
                size="small"
                v-for="tag in scope.row.tags"
                type="info"
                :key="tag.id"
                style="margin-left: 3px"
                effect="dark"
                >{{ tag.name }}</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="通过率" min-width="80" align="center"
            ><template slot-scope="scope">{{ calcRate(scope.row) }}</template></el-table-column
          >
          <el-table-column
            label="通过"
            prop="accepted"
            min-width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            label="提交"
            prop="submit"
            min-width="60"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as nologinApi from '@user/api/nologints'
import { usePagination, useQuery, useRouter } from '@common/use'
import { ref, onActivated, defineComponent } from '@vue/composition-api'
import { ProblemDegree, ProblemDegreeMap } from '@common/const/enum'

const problemDegreeList = [
  {
    value: ProblemDegree.All,
    desc: ProblemDegreeMap[ProblemDegree.All],
  },
  {
    value: ProblemDegree.Easy,
    desc: ProblemDegreeMap[ProblemDegree.Easy],
  },
  {
    value: ProblemDegree.Medium,
    desc: ProblemDegreeMap[ProblemDegree.Medium],
  },
  {
    value: ProblemDegree.Hard,
    desc: ProblemDegreeMap[ProblemDegree.Hard],
  },
]

export default defineComponent({
  name: 'problemSet',
  setup() {
    const router = useRouter()
    const { query, queryParams } = useQuery({
      queryParam: '',
      tagId: '',
      level: '',
    })
    const pagination = usePagination({
      perpage: 50,
    })
    const tableLoading = ref(false)
    const dataList = ref<ProblemListItem[]>([])
    const tags = ref<Tag[]>([])

    nologinApi.getAllTags<TagListResponse>().then(res => {
      tags.value = res.tags
      tags.value.unshift({
        id: '',
        name: '全部',
      } as Tag)
    })

    const fetchDataList = async () => {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      tableLoading.value = true
      try {
        const res = await nologinApi.getProblemList<CommonPaginationResponse<ProblemListItem[]>>({
          page: pagination.page,
          perpage: pagination.perpage,
          tag_id: queryParams.tagId,
          level: queryParams.level,
          param: queryParams.queryParam,
        })
        dataList.value = res.data
        tableLoading.value = false
        pagination.total.value = res.total
      } catch (err) {
        console.log(err)
      }
    }

    onActivated(() => {
      if (JSON.stringify(query.value) !== '{}') {
        Object.assign(queryParams, query.value)
      }
      fetchDataList()
    })

    const handleSearch = () => {
      pagination.page.value = 1
      router.push({
        query: {
          ...query.value,
          ...queryParams,
        },
      })
      fetchDataList()
    }

    const handleSearchByTag = tagId => {
      queryParams.tagId = tagId
      handleSearch()
    }
    const handleSearchByLevel = level => {
      queryParams.level = level
      handleSearch()
    }
    const handleSearchByResetConf = () => {
      queryParams.level = ''
      queryParams.tagId = ''
      queryParams.queryParam = ''
      handleSearch()
    }
    const calcRate = row => {
      const rate = row.submit === 0 ? 0 : row.accepted / row.submit
      return `${(rate * 100).toFixed(2)}%`
    }

    return {
      problemDegreeList,
      ...pagination,
      tags,
      dataList,
      tableLoading,
      queryParams,
      fetchDataList,
      handleSearch,
      handleSearchByTag,
      handleSearchByLevel,
      handleSearchByResetConf,
      calcRate,
    }
  },
})
</script>
