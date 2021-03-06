import Vue from 'vue'
import App from './App' // 引入自定义组件
import store from './store'

new Vue({
  components: { // 注册组件(后面才能写组件标签)
    App: App
  },
  template: '<App/>', //使用组件
  store, // 所有组件都能通过$store看到store对象
}).$mount('#root')
