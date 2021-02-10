import VueStore from 'vuex'
/* eslint-disable no-duplicate-imports */
declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare global {
  interface Vue {
    $store: VueStore
  }
}
