import Vue from 'vue'
import App from './App.vue'

new Vue({
   beforeCreate() {
     Vue.prototype.$eventBus = this
   },
  
  el:'#root',
  components:{
    App
  },
  template:'<App/>'
})