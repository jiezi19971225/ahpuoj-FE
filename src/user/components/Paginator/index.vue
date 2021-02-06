<script lang="tsx">
import { useMapState, useQuery, useRouter } from '@common/use'
import { toRefs, defineComponent, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    currentPage: Number,
    pageSize: Number,
    asyncPath: Boolean,
  },
  inheritAttrs: false,
  setup(props, context) {
    const states = useMapState({
      device: (state: any) => state.app.device,
    })

    const { query } = useQuery()
    const router = useRouter()

    const handleChange = () => {
      props.asyncPath &&
        router.replace({
          query: {
            ...query.value,
            page: props.currentPage.toString(),
            pageSize: props.pageSize.toString(),
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
