<template>
  <div>
    <div class="content__toolbar__wrapper">
      <div class="tool">
        <slot name="table-tool" :queryParams="queryParams" :handleSearch="handleSearch"></slot>
      </div>
      <div class="search">
        <slot name="table-search" :queryParams="queryParams" :handleSearch="handleSearch"></slot>
      </div>
    </div>
    <div class="content__table__wrapper" v-loading="tableLoading">
      <slot name="table"></slot>
    </div>
    <div class="content__pagination__wrapper">
      <oj-paginator
        @change="fetchDataList"
        :current-page.sync="page"
        :page-size.sync="perpage"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
      ></oj-paginator>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref, nextTick } from '@vue/composition-api'
import { usePagination, useQuery, useRouter } from '@common/use'

export default defineComponent({
  props: {
    fetchFn: {
      type: Function,
      require: true,
    },
    pagination: {
      type: Object,
      default: () => {},
    },
    defaultQuery: {
      type: Object,
      default: () => {},
    },
    manualFetch: {
      type: Boolean,
      default: false,
    },
  },
  name: 'OjDataTable',
  setup(props) {
    console.log('setup')

    const router = useRouter()
    const { query, queryParams, syncQuery } = useQuery(props.defaultQuery)
    const pagination = usePagination()

    const tableLoading = ref(false)

    const fetchDataList = async () => {
      const params = {
        ...pagination,
        ...queryParams,
      }
      tableLoading.value = true
      // @ts-ignore
      const res = await props.fetchFn(params)
      pagination.total.value = res.total
      tableLoading.value = false
    }

    const fetchAfterDelete = isSingle => {
      if (isSingle) {
        if (pagination.page.value > 1) {
          pagination.page.value -= 1
        }
      }
      fetchDataList()
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

    onActivated(() => {
      if (!props.manualFetch) {
        nextTick(() => {
          syncQuery()
          fetchDataList()
        })
      }
    })

    return {
      ...pagination,
      queryParams,
      tableLoading,

      handleSearch,
      fetchDataList,
      fetchAfterDelete,
    }
  },
})
</script>
<style lang="scss" scoped>
.content__toolbar__wrapper {
  margin-bottom: 0.05rem;
  display: flex;
  .tool {
    display: flex;

    > * {
      margin-right: 0.06rem;
    }
  }
  .search {
    margin-left: auto;
  }
}
.content__table__wrapper {
  margin-bottom: 50px;
}
.content__pagination__wrapper {
  z-index: 1000;
  margin-left: -20px;
  padding-left: 20px;
  width: 100%;
  border-top: 1px solid #ddd;
  background: #fff;
  text-align: left;
  height: 50px;
  padding-top: 10px;
  position: absolute;
  bottom: 0;
}
</style>
