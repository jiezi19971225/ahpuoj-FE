<script lang="tsx">
import { useMapState, useQuery, useRouter } from '@common/use'
import { toRefs, defineComponent, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    currentPage: Number,
    pageSize: Number,
    syncQuery: {
      type: Boolean,
      default: true,
    },
  },
  inheritAttrs: false,
  setup(props, context) {
    const states = useMapState({
      device: (state: any) => state.app.device,
    })

    const { query } = useQuery()
    const router = useRouter()

    const handleChange = () => {
      props.syncQuery &&
        // @ts-ignore
        router.replace({
          query: {
            ...query.value,
            page: props.currentPage,
            pageSize: props.pageSize,
          },
        })
      context.emit('change')
    }
    return { ...toRefs(states), handleChange }
  },
  render(h) {
    const { $props, $attrs, $listeners, device, handleChange } = this
    const bind = {
      props: {
        pagerCount: 5,
        layout: `prev, pager, next${device === 'desktop' ? ',jumper' : ''}`,
        ...$props,
        ...$attrs,
      },
      on: {
        ...$listeners,
        'size-change': handleChange,
        'current-change': handleChange,
      },
    }
    return <el-pagination {...bind}></el-pagination>
  },
})
</script>
