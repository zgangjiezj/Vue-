<template>
      <h2 v-if="isfirstView">用户输入,搜索！</h2>
      <h2 v-else-if="isLoading">Loading......</h2>
      <h2 v-else-if="Message">{{Message}}</h2>
      <div class="row" v-else>
        <div class="card" v-for="(user,index) in users" :key="user.username" >
          <a :href="user.url" target="_blank">
            <img :src="user.avatar_url" style='width: 100px'/>
          </a>
          <p class="card-text">{{user.username}}</p>
        </div>
      </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
  export default {
     data(){
       return {
         isfirstView: true,
         isLoading:false,
         users:[],
         Message:''
       }
     },
     mounted() { 
                           // 发啥，回调中接啥
       this.$eventBus.$on('search',(searchName)=>{
         this.isfirstView = false
         this.isLoading = true
         //发axios请求
         axios.get('https://api.github.com/search/users?',{params:{q:searchName}})
         .then(
           response =>{
             const result = response.data
             const users = result.items.map((user,index)=>{
                return {
                  username:user.login,
                  url:user.html_url,
                  avatar_url:user.avatar_url
                }
             })

             this.isLoading = false
             this.users = users

           },
           error =>{
              this.isLoading = false
              this.Message = error.Message
           }
         
         )
       })
     },
  }
</script>

<style scoped>
    .card {
    float: left;
    width: 33.333%;
    padding: .75rem;
    margin-bottom: 2rem;
    border: 1px solid #efefef;
    text-align: center;
  }

  .card > img {
    margin-bottom: .75rem;
    border-radius: 100px;
  }

  .card-text {
    font-size: 85%;
  }

 
</style>
