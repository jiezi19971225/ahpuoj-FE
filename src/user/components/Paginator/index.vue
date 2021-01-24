<script lang="tsx">
import { useMapState, useRoute, useRouter } from '@common/use'
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

    const route = useRoute()
    const router = useRouter()

    const handleChange = () => {
      console.log(route.value.query)
      props.asyncPath &&
        router.replace({
          query: {
            ...route.value.query,
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
