import { defineComponent } from 'vue' // 从 Vue 中导入 defineComponent 函数

// 定义一个名为 RenderVnode 的组件
const RenderVnode = defineComponent({
  // 定义组件的 props
  props: {
    vNode: {
      type: [String, Object], // vNode 属性可以是字符串或对象
      required: true // vNode 属性是必需的
    }
  },
  // setup 函数用于定义组件的逻辑
  setup(props) {
    // 返回一个渲染函数，直接返回传入的 vNode
    return () => props.vNode
  }
})

export default RenderVnode // 导出组件