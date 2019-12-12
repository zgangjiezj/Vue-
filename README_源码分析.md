## 0. debug调试
		1). 调试的目的
				查找bug: 不断缩小可疑代码的范围
				查看程序的运行流程(用于熟悉新接手项目的代码)
			
		2). 如何开启调试模式
				添加debugger语句: 程序运行前     此方式用打包后才运行的项目
				添加(打)断点: 程序运行前或者过程中   此方式用运行源码js
			
		3). 如何进行调试操作
				resume: 恢复程序执行(可能执行完或者进入下一个断点处)
				step over: 单步跳转, 尝试执行完当前语句, 进入下一条(如果内部有断点, 自动进入内部断点处)
				step into: 跳入, 进入当前调用函数内部
				step out: 跳出, 一次性执行完当前函数后面所有语句,并出去
				deactivate breakpoints: 使所有断点暂时失效
				
				call stack: 显示是程序函数调用的过程
				scope: 当前执行环境对应的作用域中包含的变量数据
				breakpoints: 断点列表

## 1. 准备
		1.[].slice.call(lis): 将伪数组转换为真数组
		2.node.nodeType: 得到节点类型
		3.Object.defineProperty(obj, propertyName, {}): 给对象添加/修改属性(指定描述符)
				configurable: true/false  是否可以重新define
				enumerable: true/false 是否可以枚举(for..in / keys())
				value: 指定初始值
				writable: true/false value是否可以修改存取(访问)描述符
				get: 函数, 用来得到当前属性值
				set: 函数, 用来监视当前属性值的变化
		4.Object.keys(obj): 得到对象自身可枚举的属性名的数组
		5.DocumentFragment: 文档碎片(高效批量更新多个节点)
		6.obj.hasOwnProperty(prop): 判断prop是否是obj自身的属性

## 2. 数据代理(MVVM.js)
		1.通过一个对象代理对另一个对象中属性的操作(读/写)
  	2.通过vm对象来代理data对象中所有属性的操作
  	3.好处: 更方便的操作data中的数据
  	4.基本实现流程
				1). 通过Object.defineProperty()给vm添加与data对象的属性对应的属性描述符
				2). 所有添加的属性都包含getter/setter
				3). 在getter/setter内部去操作data中对应的属性数据
    
## 3. 模板解析(compile.js) ---》实现界面的初始化显示
  	1.模板解析的关键对象: compile对象
  	2.模板解析的基本流程:
				1). 将el的所有子节点取出, 添加到一个新建的文档fragment对象中
				2). 对fragment中的所有层次子节点递归进行编译解析处理
						* 对插值文本节点进行解析
						* 对元素节点的指令属性进行解析
								* 事件指令解析
								* 一般指令解析
      	3). 将解析后的fragment添加到el中显示

    3.解析插值语法节点（操作的是文本节点）: 设置文本内容textNode.textContent = value，将文本内容<p>{{name}}</p>修改为<p>Tom</p>。==》value是不确定的，value的数据在data中，根据表达式去找data，通过正则匹配得到表达式（{{}}）。
      	1). 根据正则对象得到匹配出的【表达式】字符串: 子匹配/RegExp.$1 ==》正则匹配得到name
      	2). 从data中取出【表达式】对应的属性值  ==》根据name去data中对应的数据
      	3). 将属性值设置为文本节点的textContent ==》把数据设置为textCont的值

    4.事件指令解析--》事件指令：【v-on：click='test' ...】-->（操作的是元素节点）-->elementNode.addEventListener('eventName', callback.bind(vm))
		  具体理解：给元素节点绑定addEventListener，需要指定事件名和回调函数，事件名和回调函数是通过以下获得：
      	遍历所有的元素节点，得到属性名v-on:click，如果该属性是指令属性，得到属性值test，且从属性名中取出指令名on：click，如果该指令是事件指令，编译处理这个事件指令，
				1). 从指令名中取出事件名（on：click ===》click）
      	2). 根据【指令属性值(就是表达式test)】从methods中得到对应的【事件处理函数对象】（就是对应的事件回调函数）
      	3). 给当前元素节点绑定指定事件名和回调函数的dom事件监听，且回调函数指定this为vm对象，否则this为button
      	4). 指令解析完后, 移除此指令属性
	例：
			<button v-on:click="test">测试</button>
      button.addEventListener('click', this.test.bind(vm)) 

    5.一般指令解析 -->一般指令：v-text="content"；解析为：p.textContent = value -->（操作的是元素节点）-->elementNode.xxx = value
		 <p class="classB" v-class="myClass">xxxxxxx</p> <!-- p.className = 'classB classA' -->

		具体理解：一般指令解析是给元素节点指定属性值和属性名，但是属性值和属性名不确定的，不同的指令名操作不同的属性，根据指令名得到对应的属性值
	  遍历所有的元素节点，得到属性名v-text，如果该属性是指令属性，得到指令值content，且从属性名中取出指令名text，如果该指令是一般事件指令，编译处理这个一般事件指令，
      	1). 得到指令名和指令值(表达式)   ==》得到text，content
      	2). 从data中根据指令值（表达式）得到对应的值 ===》根据content去data中查找数据
      	3). 根据指令名确定需要操作元素节点的什么属性  ==》text操作的是textContent属性
	        * v-text---textContent属性
	        * v-html---innerHTML属性
	        * v-class--className属性
      	4). 将得到的表达式的值设置到对应的属性上   ==》将data中的数据赋值给textContent属性上
      	5). 移除元素的指令属性

## 4. 数据劫持-->数据绑定
  数据绑定
      * 初始化显示: 页面(表达式/指令)能从data读取数据显示 (编译/解析)
      * 更新显示: 更新data中的属性数据==>页面更新
	  1.数据绑定(model==>View):
    	1). 一旦更新了data中的某个属性数据, 所有界面上直接使用或间接使用了此属性的节点都会更新(更新)
  	2.数据劫持
			1). 数据劫持是vue中用来实现数据绑定的一种技术
			2). 基本思想: 通过defineProperty()来监视data中所有属性(任意层次)数据的变化, 一旦变化就去更新界面。（通过给data添加set()方法来监视data中的所有属性。）
  	3.四个重要对象
    	1). Observer（一个Observer对象对应一层数据）
			* 用来对data所有属性数据进行劫持的构造函数
	      	* 给data中所有属性重新定义属性描述(定义get/set方法，更新属性数据，监视属性变化)，且该属性是响应式的，更新data里的属性后，界面自动更新
	      	* 为data中的每个属性创建对应的dep对象

        先创建dep对象，再创建watcher对象
	    2). Dep(Depend)
	      	* data中的每个属性(所有层次)都对应一个dep对象
	      	* 创建的时机:
	        	* 在初始化define data中各个属性时创建对应的dep对象==》在给data中的属性添加监视/劫持（setter）前创建
	        	* 在data中的某个属性值被设置为新的对象时
					*创建几个：与data中的属性一一对应，就是data中属性的个数
	      	* 对象的结构
		        {
		          id, // 每个dep都有一个唯一的id
		          subs //包含n个对应watcher的数组(subscribes的简写)
		        }
			* subs属性说明
				* 当一个watcher被创建时, 内部会将当前watcher对象添加到对应的dep对象的subs中
				* 当此data属性的值发生改变时, 所有subs中的watcher都会收到更新的通知, 从而最终更新对应的界面
		3). Compile
			* 用来解析模板页面的对象的构造函数(一个实例)
			* 利用compile对象解析模板页面
			* 每解析一个表达式(非事件指令)都会创建一个对应的watcher对象, 并建立watcher与dep的关系
			* complie与watcher关系: 一对多的关系
		4). Watcher
	      	* 模板中每个非事件指令或表达式都对应一个watcher对象
	      	* 监视当前表达式数据的变化
	      	* 创建的时机: 在初始化编译模板时 ==》对模板中的某个节点(包含模板语法，插值和指令语法，但事件指令语法除外)实现在内存初始化更新后创建
					*创建几个：与模板中表达式（插值、一般指令）一一对应，就是模板中表达式的个数，事件指令的表达式除外。
	      	* 对象的组成
				{
		          vm,  //vm对象
		          exp, //对应指令的表达式
		          cb, //当表达式所对应的数据发生改变的回调函数
		          value, //表达式当前的值
		          depIds //表达式中各级属性所对应的dep对象的集合对象
		                  //属性名为dep的id, 属性值为dep
				}
			
		5). 总结: dep与watcher的关系: 多对多
			* 一个data中的属性对应一个dep, 一个dep中可能包含多个watcher(模板中有多个表达式使用到了同一个属性；当前属性被模板中的多个表达式使用) 	dep ==> watcher : 一对多{subs：[w1,w2]}  
			* 模板中一个非事件表达式对应一个watcher, 一个watcher中可能包含多个dep(表达式中包含了多个data属性；当前表达式是一个多层表达式)  wacther ==>dep {depIds:{0:d0,2:d2}}
			* 数据绑定使用到2个核心技术
				* defineProperty()
				* 消息订阅与发布
	4.双向数据绑定
			1). 双向数据绑定是建立在单向数据绑定(model==>View)的基础之上的
			2). 双向数据绑定的实现流程:
					* 在解析v-model指令时, 给当前元素添加input监听
					* 当input的value发生改变时, 将最新的值赋值给当前表达式所对应的data属性


