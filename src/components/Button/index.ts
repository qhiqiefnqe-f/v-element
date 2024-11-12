// 从 'vue' 导入类型定义 App，用于类型检查
import type { App } from 'vue'

// 导入 Button 组件
import Button from './Button.vue'

// Button 实际上是一个对象，现在给这个对象添加一个方法，使其能够被 Vue.use() 使用
// 这个方法会在 Vue 应用中全局注册 Button 组件
Button.install = (app: App) => {
  // 使用 app.component 方法将 Button 组件注册为全局组件
  app.component(Button.name, Button)
}

// 默认导出 Button 组件
export default Button

// 从 './types' 文件中导出所有类型定义
export * from './types'