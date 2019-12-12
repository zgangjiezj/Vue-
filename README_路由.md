## 1. vue-router
    是用来实现SPA的vue插件
    
## 2. vue-router的基本使用
    1). 创建路由器: router/index.js
        new VueRouter({
          mode: 'hash/history'
          routes: [
            { // 一般路由
              path: '/about',
              component: About
            },
            { // 自动跳转路由
              path: '/',
              redirect: '/about'
            }
          ]
        })
    2). 注册路由器: main.js
        import router from './router'
        new Vue({
          router
        })
    3). 使用路由组件标签:
        <router-link to="/xxx">Go to XXX</router-link>  // 可以不使用
        <router-view></router-view>  // 必须使用(显示当前路由组件 ==>当前: 与请求的路径匹配的路由)

        动态路由跳转（使用带params参数的路由标签）：
         <router-link :to="'/home/message/detail/' + m.id">{{m.title}}</router-link>
        <router-link :to="{name: 'detail', params: {id: m.id}}">{{m.title}}</router-link>
    4). 2个对象
        $router: 代表路由器对象, 包含一些实现路由跳转/导航的方法: push()/replace()/back()
        $route: 代表当前路由对象, 包含一些路由相关的属性: path/params/query/meta

## 3. 编写路由的3步
    1). 定义路由组件
    2). 映射路由
    3). 使用<router-view/>显示当前路由组件

## 4. 嵌套路由
    children: [
        {
          path: '/home/news/:id/:title',
          component: news
        },
        {
          path: 'message',
          component: message
        }
    ]

## 4. 向路由组件传递数据
    params/query: <router-link to="/home/news/123/abc?zzz=1234">
    注册路由时==》将请求参数映射成props: props=true(内部自动将接收的parmas参数以标签属性传入路由组件) 
                          props: route => ({id: route.params.id}) ==>(函数返回的对象中的所有属性都会以标签属性传入路由组件)
    变相props: <router-view msg='abc'>  ==>内部会将接收的属性原样传递给管理的路由组件对象

    params参数：注册路由时确定参数名,例参数名为id和title ===> path: '/home/news/:id/:title',
    query参数：router-link指定路径的时候确定参数名 ==> <router-link to="/home/news/123/abc?zzz=1234">
    读取参数：没用props：直接$route对象身上取 ===》$route.params.id
             用了props：路由组件中props声明接收==> props: ['id', 'name'],页面模板中直接用id，js中this.id
             route-view携带的参数，props声明接收
    
    注册路由：
            {
              name: 'detail',
              path: '/home/message/detail/:id',   // 动态路由
              component: MessageDetail,
              // props: true, // 内部自动将接收的parmas参数以标签属性传入路由组件
              props: (route) => ({id: route.params.id, name: route.query.name})// 函数返回的对象中的所有属性都会以标签属性传入路由组件
            }
    路由组件中，接收使用：props: ['id', 'name'],
                        li>ID: {{id}}</li>
## 5. 动态路由与路由别名 ==定义与跳转
    二者在注册路由是定义 ：
        动态路由：带params参数的路由
        路由别名：name
        
    注册路由: 
        {
            name: 'news'
            path: '/home/news/:id/:title',
            component: News
        }
    跳转: 
        <router-link to="{name: 'news', params: {id: 1, title: 'abc'}}">
        router.push({name: 'news', params: {id: 1, title: 'abc'}})

## 6. 缓存路由组件
    路由组件对象默认的生命周期: 被切换时就会死亡, 切换回来时重新创建
    <keep-alive exclude="A,B">
      <router-view></router-view>
    </keep-alive>

     include(对指定的路由组件做缓存处理) /exclude(对指定的路由组件不做缓存处理) / <keep-alive> </keep-alive>

    缓存路由组件缓存的是缓存路由组件的对象：一般路由组件的作用是被切换时就会死亡, 切换回来时重新创建，缓存路由组件的作用切换回来时复用

## 7. 路由的编程式导航
    this.$router.push(path): 相当于点击路由链接(可以返回到当前路由界面)
    this.$router.replace(path): 用新路由替换当前路由(不可以返回到当前路由界面)
    this.$router.back(): 请求(返回)上一个记录路由

例：  this.$router.push(`/home/message/detail/${id}`)
      this.$router.push({name: 'detail', params: {id}})

## 8. 路由的2种模式比较, 解决history模式404问题
    hash模式:
        路径中带#: http://localhost:8080/#/home/news
        发请求的路径: http://localhost:8080  项目根路径
        响应: 返回的总是index页面  ==> path部分(/home/news)被解析为前台路由路径

    history模式:
        路径中不带#: http://localhost:8080/home/news
        发请求的路径: http://localhost:8080/home/news
        响应: 404错误
        希望: 如果没有对应的资源, 返回index页面, path部分(/home/news)被解析为前台路由路径
        解决: 
           注册路由：mode：'history' 
           webpack.config中添加配置:
            devServer: historyApiFallback: true, // 任意的 404 响应都被替代为 index.html
            output: publicPath: '/', // 引入打包的文件时路径以/开头

  配置代理服务器proxy与404的配置的关系：
  1. 请求的路径有对应资源：（看network中的Request URL，即为请求的路径）
    http://localhost:8081/ （项目根路径不会用到proxy和404的配置，因为有对应的资源index页面）  ===> index.html
    http://localhost:8081/static/css/base.css ===> base.css
    http://localhost:8081/ ==》跳到http://localhost:8081/about,先加载index.html页面，找到里面的js代码，生成整个页面，在该index.js中有重定向redirect，将/路径改为/about,

  2. 请求的路径没有对应的资源：先找proxy代理服务器
    请求的路径与代理服务器监视的路径匹配，（ ==》代理服务器是：proxy对应的）
    由代理服务器转发请求, 得到资源后返回
    例：http://localhost:4000/api/search/users，该请求路径与代理服务器监视的路径匹配， 由代理服务器转发请求, 得到资源后返回
  3. 其它所有的请求(404)：找404的配置
    返回index页面（index.html）, 请求的path部分会被当做前台路由路径处理, 从而对应的路由组件界面
  例1：http://localhost:4000/search/users ==>search/users应该被当做前台路由路径，但是被当做后台路由路径处理，使请求的路径http://localhost:4000/search/users没有对应的资源返回，返回404，通过配置解决404后，返回index页面，通过index中的js代码，将search/users当做前台路由路径，通过重定向redirect，显示对应的路由组件界面。

  例2：发请求的路径为http://localhost:8083/home，没有对应的资源，也不与代理服务器的监视路径匹配，默认404，返回index页面，页面中有js代码对路由做处理，最终展示对应的界面，没找到对应的界面显示App界面。
  

##  去掉路径中的# ：
    mode:history
    webpack中添加配置
 问题：在network中查看哪个文件失效？？====》路径问题
     去掉#之后，样式css失效==》将相对路径改为绝对路径，/开头
               自动引入的js文件、图片、css等失效===》配置文件中修改，以 / 开头
## 9 当在同一个路由路径上做切换(只是改了参数), 当前路由组件对象被直接复用 ===》写在watch里 

    路由组件对象是在第一次请求对应路径时才创建
    从一个路由组件离开, 路由组件死亡, 再进入需要重新创建
    当在同一个路由路径上做切换(只是改了参数), 当前路由组件对象被直接复用
    同一个组件对象mounted()只执行一次

    watch: {
      '$route' (to, from) { // 当请求参数发生改变时, 内部指定了新的$route属性
        // 对路由变化作出响应...
        setTimeout(() => {
          // 得到当前新的id
          const id = this.id * 1
          const detail = allMessageDetils.find(detail => detail.id===id)
          this.detail = detail
        }, 1000);
      }
    }

