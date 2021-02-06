/* eslint-disable */
import Clipboard from 'clipboard'
import { Message } from 'element-ui'

const VueClipboardConfig = {
  autoSetContainer: false,
  appendToBody: true, // This fixes IE, see #50
}

const onSuccess = () => {
  Message.success('复制成功')
}
const onError = () => {
  Message.success('复制失败，请手动复制')
}

export const clipboard = {
  bind(el, binding, vnode) {
    if (binding.arg === 'success') {
      el._vClipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._vClipboard_error = binding.value
    } else {
      const clipboard = new Clipboard(el, {
        text() {
          return binding.value
        },
        action() {
          return binding.arg === 'cut' ? 'cut' : 'copy'
        },
        container: VueClipboardConfig.autoSetContainer ? el : undefined,
      })
      clipboard.on('success', function (e) {
        const callback = el._vClipboard_success || onSuccess
        callback && callback(e)
      })
      clipboard.on('error', function (e) {
        const callback = el._vClipboard_error || onError
        callback && callback(e)
      })
      el._vClipboard = clipboard
    }
  },
  update(el, binding) {
    if (binding.arg === 'success') {
      el._vClipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._vClipboard_error = binding.value
    } else {
      el._vClipboard.text = function () {
        return binding.value
      }
      el._vClipboard.action = function () {
        return binding.arg === 'cut' ? 'cut' : 'copy'
      }
    }
  },
  unbind(el, binding) {
    if (binding.arg === 'success') {
      delete el._vClipboard_success
    } else if (binding.arg === 'error') {
      delete el._vClipboard_error
    } else {
      el._vClipboard.destroy()
      delete el._vClipboard
    }
  },
}
