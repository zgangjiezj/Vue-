## 1. 初始化项目
    1). 生成package.json
        yarn init -y

    2). 创建入口js: src/index.js
        console.log('Hello Webpack!')
        document.getElementById('root').innerHTML = '<h1>Hello222</h1>'

    3). 创建页面文件: index.html
        <div id="root"></div>

## 2. webpack基本使用
    1). 下载依赖包
  1》webpack：打包js ；webpack-cli提供命令 
  2》没有全局安装webpack，不能直接使用webpack命令，
    1>用npx webpack，可以用局部安装的webpack进行打包处理  
    2>package.json中配置：build：'webpack --mode production'==>直接敲 yarn build  
         先找局部webpack，局部没有再找全局webpack

        yarn add -D webpack webpack-cli  //打包js，提供命令
        yarn add -D html-webpack-plugin //自动引入打包生成的js或者css 

    2). 创建webpack配置: webpack.config.js
        const path = require('path')
        const HtmlWebpackPlugin = require('html-webpack-plugin')

        module.exports = {
          // 模式: 生产环境
          mode: 'production',
          // 入口
          entry: {
            app: path.resolve(__dirname, 'src/index.js')
          },
          // 出口(打包生成js)
          output: {
            filename: 'static/js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
          },
          // 模块加载器
          module: {
            rules: [

            ]
          },
          // 插件
          plugins: [
            new HtmlWebpackPlugin({
              template: 'index.html',
              filename: 'index.html'
            })
          ]
        }
    
    3). 生成环境打包并运行
        配置打包命令:  "build": "webpack --mode production"
        打包项目: yarn build
        运行打包项目: serve dist

## 3. 开发环境运行
    1). 现在的问题:
        每次修改项目代码后, 必须手动重新打包, 重新运行
    
    2). 下载依赖包
        yarn add -D webpack-dev-server // 自动编译打包运行，修改代码自动重新打包刷新浏览器，不需要手动操作 （9:31）
    
    3). 配置开发服务器
        devServer: {
          open: true, // 自动打开浏览器
          quiet: true, // 不做太多日志输出
        },
    
    4). 配置开启source-map调试  ==》调试，哪个源文件的哪一行出现错误
        devtool: 'cheap-module-eval-source-map',

    5). 开发环境运行
        配置命令: "dev": "webpack-dev-server --mode development"
        执行命令: yarn dev

## 4. 打包处理 ES6/CSS/图片 ===》loader
    1). 处理ES6
        a. 下载依赖包
            yarn add -D babel-loader @babel/core @babel/preset-env // es6转es5 /jsx转js
        b. 配置  //模块加载器里写
            {
              test: /\.js$/,
              //exclude: /(node_modules|bower_components)/,
              include: path.resolve(__dirname, 'src'),
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
    
    2). 处理CSS
        a. 下载依赖包
            yarn add -D css-loader style-loader  //
        b. 配置
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'], // 多个loader从右到左处理
            }

    3). 处理图片
        a. 下载依赖包
            yarn add -D url-loader@2.3.0 file-loader@4.3.0  // 使用这两个是因为node版本低，可以配合使用。
        b. 配置
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: 'static/img/[name].[hash:7].[ext]' // 相对于output.path
              }
            }
    4). 测试
        a. 添加图片: src/assets/imgs/logo.png
        b. 添加css: src/assets/css/my.css
            img {
              width: 200px;
              height: 200px;
            }
        c. index.js
            import logo from './assets/imgs/logo.png'
            import  './assets/css/my.css'

            const image = new Image()
            image.src = logo
            document.body.appendChild(image)
            document.getElementById('root').innerHTML = '<h1>Hello222</h1>'

## 5. 搭建vue的环境
    0). 文档:
        https://vue-loader.vuejs.org/zh/

    1). 下载依赖包:
        yarn add vue
        yarn add -D vue-loader vue-template-compiler
    
    2). 配置
        const VueLoaderPlugin = require('vue-loader/lib/plugin')

        {
          test: /\.vue$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'vue-loader'
        }

        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        }

        new VueLoaderPlugin()

        // 引入模块的解析
        resolve: {
          extensions: ['.js', '.vue', '.json'], // 可以省略的后缀名
          alias: { // 路径别名(简写方式)
            'vue$': 'vue/dist/vue.esm.js',  // 表示精准匹配
          }
        }
    
    3). 编码: 
        src/App.vue
        src/index.js
webpack-dev-server中解决跨域的配置 
新语法浏览器不支持：corejs
配置mint-UI出错（视频16：00时）
        
## 区分使用生产环境与开发环境
    使用生产环境:（怎么用这个环境--》执行了什么命令，要干什么（作用））
        npm run build   ==> webpack  
        1). 在内存中进行编译打包, 生成内存中的打包文件
        2). 保存到本地(在本地生成打包文件)   ===> 此时还不能通过浏览器来访问, 需要启动服务器运行
    使用开发环境
        npm run dev   ==> webpack-dev-server
        1). 在内存中进行编译打包, 生成内存中的打包文件
        2). 调动服务器, 运行内存中的打包文件（不生成本地打包文件）===> 可以通过浏览器虚拟路径访问
##  依赖包与依赖声明
    运行时依赖：dependencies
         运行时用，
         敲命令时，没写-D，保存在运行时依赖中
    开发时依赖：devDependencies
         编译打包的时候用；
         删掉devDependencies中的所有，也可正常编译打包，运行，因为真正编译打包时靠的是node_moudles，但是可以根据依赖声明下载node_moudles中的所有包。（其他电脑没有node_moudles的文件夹时，根据依赖声明下载包，依赖声明在package.json中）

     依赖声明："webpack-dev-server": "^3.9.0"

    dependencies:用于实现功能
    devDepenencies:开发依赖  ===》里面全都是直接依赖的包，还有间接依赖的包

## git的六个步骤（图）
    具体操作：
        1、创建本地仓库
              建立.gitignore文件
              git init  == 工作区
              git add * ==工作区的放到暂存区
              git commit  -m '' ==将暂存区的放到版本区
        2、创建远程仓库（空）
        3、将本地代码推送到远程仓库：git push origin master
        4、  本地写新文件或修改文件，本地管理好再推送到远程。
        5、远程写新文件或修改文件，本地拉取
        6、clone

## 6. 解决开发环境ajax请求跨域问题
    1). 利用webpack-dev-server进行请求代理转发
        webpack-dev-server内部利用http-proxy-middle包对特定请求进行转发操作
    2). 配置:
        devServer: {
          proxy: {
            // 处理以/api开头路径的请求
            // '/api': 'http://localhost:4000'
            '/api': {
              target: 'http://localhost:4000', // 转发的目标地址（要请求的服务器的地址）
              pathRewrite: {
                '^/api' : ''  // 转发请求时去除路径前面的/api
              },
              changeOrigin: true, // 支持跨域,如果协议/主机也不相同, 必须加上
            }
          }
        }
    3)具体的实现：（视频9:00）
        浏览器的地址栏的地址以/api开头，发请求，
## 7. 配置async/await的编译环境
    1). 下载包
        yarn add @babel/runtime-corejs2
    2). 配置
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: 'usage',
            'corejs': 2 // 处理一些新语法的实现(async/await的语法也是它解析的)
          }]
        ]

## 8. 解决mint-ui按需引入配置异常的问题
    1). 文档上的配置
        "plugins": [
          ["component", [
            {
              "libraryName": "mint-ui",
              "style": true
            }
          ]]
        ]
    2). 异常信息:  
        Error: .plugins[0][1] must be an object, false, or undefined
    3). 原因:
        文档编写时, 是根据老的babel版本编写的, 新版本的babel配置有变化
        以前是数组, 现在只能是对象
    4). 修正:
        "plugins": [
          ["component", {
              "libraryName": "mint-ui",
              "style": true
          }]
        ]

## 9. 解决history模式路由请求404的问题
    devServer: historyApiFallback: true, // 任意的 404 响应都被替代为 index.html
    output: publicPath: '/', // 引入打包的文件时路径以/开头