import { ref, nextTick } from '@vue/composition-api'

export const useGutter = () => {
  const gutter = ref<HTMLDivElement>()
  const problemPart = ref<HTMLDivElement>()
  const editorPart = ref<HTMLDivElement>()

  nextTick(() => {
    gutter.value.addEventListener('mousedown', () => {
      document.onmousemove = e => {
        e = e || (window.event as MouseEvent)
        const { clientWidth } = document.documentElement
        // clientWidth += 10;
        // 计算比率
        const rate = (e.clientX / clientWidth) * 2
        problemPart.value.style.flexGrow = rate.toString()
        editorPart.value.style.flexGrow = (2 - rate).toString()
      }
      document.onmouseup = e => {
        e = e || (window.event as MouseEvent)
        document.onmousemove = null
        document.onmouseup = null
      }
    })
  })
  return {
    gutter,
    problemPart,
    editorPart,
  }
}
