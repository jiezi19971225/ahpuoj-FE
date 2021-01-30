/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue, { VNode } from 'vue'
import { ComponentRenderProxy } from '@vue/composition-api'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: any // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: any
    }

    /**
     * 不开启对组件的 props 检测，不然无法在自定义组件上使用 dom 属性
     * https://stackoverflow.com/questions/52973485/unable-to-use-html-attributes-on-custom-components-in-tsx
     * */
    type LibraryManagedAttributes<C, P> = { [name: string]: any }
  }
}
