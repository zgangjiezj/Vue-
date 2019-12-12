# 自定义Vue开发环境
## 1. 搭建基本开发环境
    1). 下载依赖包
        yarn add -D webpack webpack-cli
        yarn add -D html-webpack-plugin
        yarn add -D webpack-dev-server
        yarn add -D babel-loader @babel/core @babel/preset-env
        yarn add -D css-loader style-loader
        yarn add -D url-loader@2.3.0 file-loader@4.3.0
    
    2). webpack的基本配置: webpack.config.js
        module.exports = {
          mode: 'production|development'
          entry: {

          },
          output: {

          },
          module: {
            rules: [
                
            ]
          },
          plugins: [

          ],
          devServer: {

          },
          devtool: ''，
          resolve：{   

          }
        }

    3). 区分使用生产环境与开发环境
        使用生产环境:
            npm run build   ==> webpack
            1). 在内存中进行编译打包, 生成内存中的打包文件
            2). 保存到本地(在本地生成打包文件)   ===> 此时还不能通过浏览器来访问, 需要启动服务器运行
        使用开发环境
            npm run dev   ==> webpack-dev-server
            1). 在内存中进行编译打包, 生成内存中的打包文件
            2). 启动服务器, 运行内存中的打包文件(不生成本地打包文件)   ===> 可以通过浏览器虚拟路径访问
      vue-loader不需要下载，直接使用
## 2. 搭建Vue的开发环境
    1). 配置处理.Vue组件文件的loader和plugin
    2). 配置使用vue-style-loader替换style-loader
    3). 解决无法编译vue模板的错误
        原因: 默认引入的vue是不带编译器的版本, 无法对template配置指定模板进行编译
        解决: 配置模块别名来指定引入vue带编译器的版本
    4). 配置省略模块后缀名(.js/.vue/.json)

# 组件化
## 1. vue单文件组件
    <template>
      <div>xxx</div>
    </template>
    <script>
      export default {
        props: []/{}
        data(){},
        computed: {}
        methods: {},
        watch: {}
        filters: {}
        directives: {}
        components: {}
      }
    </script>
    <style scoped>
    </style>

## 2. 组件化编码的
    基本流程
        1). 拆分界面, 抽取组件
        2). 编写静态组件
        3). 编写动态组件
            初始化数据, 动态显示初始化界面
            实现与用户交互功能

    设计data
        类型: [{id: 1, title: 'xxx', completed: false}]
        名称: todos
        位置: 如果只是哪个组件用, 交给它, 如果是哪些组件用, 交给共同的父组件
    
    关于状态数据的更新
        data数据定义在哪个组件, 更新数据的行为就定义在哪个组件
        如果子组件要更新父组件的数据, 调用父组件的更新函数来更新父组件的数据
        一个组件接收属性数据不要直接修改, 只是用来读取显示的
    
    相关问题:
        组件的data配置为什么只能是函数, 不能是对象?
            保证同一个组件的多个实例对象的data对象不是共用的, 而是各自自己的data对象
        例：A组件中，定义data为对象
            假设有两个组件标签 <A/> ,<A/>,就会有两个实例a1,a2，每个实例都要自己的data对象，去组件的配置对象中取data对象，此时一个组件的多个实例指向的是同一个data对象，如果a1把data对象里的属性改了，其他实例也会看见。
        网上：
      1》因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。

      2》如果两个实例引用同一个对象，当其中一个实例的属性发生改变时，另一个实例属性也随之改变，只有当两个实例拥有自己的作用域时，才不会相互干扰。
    　　这是因为JavaScript的特性所导致，在component中，data必须以函数的形式存在，不可以是对象。
    　　组建中的data写成一个函数，数据以函数返回值的形式定义，这样每次复用组件的时候，都会返回一份新的data，相当于每个     组件实例都有自己私有的数据空间，它们只负责各自维护的数据，不会造成混乱。而单纯的写成对象形式，就是所有的组件     实例共用了一个data，这样改一个全都改了。

        组件对象与Vue是什么关系?
            所有组件对象的原型对象都是一个vm对象
            所有组件对象都能看到定义在Vue原型对象上的属性或方法

## 3. 组件间通信
    1). 组件通信的5种方式
        props
        vue的自定义事件
        全局事件总线
        slot
        vuex(后面单独讲)
    
    2). props:
        父子组件间通信的基本方式
        属性值的2大类型:
            一般/非函数: 父组件-->子组件
            函数: 子组件-->父组件
        问题: 
            隔层组件间传递: 必须逐层传递(麻烦)
            兄弟组件间: 必须借助父组件(麻烦)
    
    2). vue自定义事件
        给子组件标签绑定事件监听
        子组件向父组件的通信方式
        功能类似于function props
        问题: 不适合隔层组件和兄弟组件间的通信
    
    3). 全局事件总线
        利用vm对象的$on()/$emit()/$off()
        利用组件对象的原型对象是vm对象, 组件对象能直接看到Vue原型对象上的属性
        创建vm对象作为全局事件总线对象保存到Vue的原型对象上, 所有的组件对象都可以直接可见:
            Vue.prototype.$bus = new Vue()   // 也可以直接利用最外层的vm对象
            任意组件A可以通过this.$bus.$on()绑定监听接收数据
            任意组件B可以通过this.$bus.$emit()分发事件, 传递数据

    4). slot
        父组件向子组件通信
        通信是带数据的标签
        注意: 标签是在父组件中解析

    5). vuex
        多组件共享状态(数据的管理)
        组件间的关系也没有限制
        功能比事件总线强大, 更适用于vue项目

## 4. 自定义消息订阅与发布
    1). 相关语法
        a. PubSub: 包含所有功能的订阅/发布消息的管理者对象
        b. token PubSub.subscribe(msg, subscriber): 订阅消息: 指定消息名和订阅者回调函数
        c. PubSub.publish(msg, data): 异步发布消息: 指定消息名和数据
        d. PubSub.publishSync(msg, data): 同步发布消息: 指定消息名和数据
        e. PubSub.unsubscribe(flag): 取消订阅: 根据标识取消某个或某些消息的订阅
    2). 内部容器结构
        {
            "add": {
                uid_1: callback1,
                uid_2: callback2
            },
            "delete": {
                uid_3: callback3
            }
        }

## 5. 自定义事件总线
    1). 相关语法
        a. EventBus: 包含所有功能的全局事件总线对象
        b. EventBus.on(eventName, listener): 绑定事件监听
        c. EventBus.emit(eventName, data): 分发事件
        d. EventBus.off(eventName): 解绑事件监听
    2). 内部容器结构
        {
            "add": [callback1, callback2],
            "delete": [callback3]
        }

## 6. 与后台进行通信
    1). 使用什么发ajax请求?
        vue-resource   vue1.x使用
        axios vue2.x使用
    2). 在什么时候发请求?
        mounted()中
        事件监听回调函数或相关函数中

## 7. vue UI组件库
    常用的UI组件库
        PC: Element / iview /
        Mobile: mint-ui / vant-ui / cube-ui
    mint-ui的使用
        根据官方文档使用
        配置实现按需引入打包

## 路由的2种模式比较, 解决history模式404问题
    hash模式:
        路径中带#: http://localhost:8080/#/home/news
        发请求的路径: http://localhost:8080  项目根路径
        响应: 返回的总是index页面  ==> path部分(/home/news)被解析为前台路由路径(发请求时#后面/home/news的不携带)

    history模式:
        路径中不带#: http://localhost:8080/home/news
        发请求的路径: http://localhost:8080/home/news
        响应: 404错误（出现404原因：没有#，将前台路径path部分(/home/news)作为后台路径处理，发请求时没有对应的资源返回，应该返回的是index页面）
        希望: 如果没有对应的资源, 返回index页面, path部分(/home/news)被解析为前台路由路径
        解决: 添加配置
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

