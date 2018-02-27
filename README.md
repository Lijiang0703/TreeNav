# TreeNav
jquery plugin

# 功能需求定义

1. 根据json数据动态生成多级树结构
2. 选状态中时自动在activeEl元素上添加class : active
3. 了解jquery插件的实现过程
4. 上下翻页方法
5. history.pushState、history.replaceState 无刷新更改url并支持回退、前进

# 功能实现说明
1. 样式以外部设置的样式为准，同时可以考虑提供一套默认的样式
2. 树形结构的复杂主要在遍历层面，考虑记录index来加快遍历
3. 后续可以考虑搜索title

# 插件内部参数
```
{
	'pre': <item>,
	'currentIndex': <index>,
	'currentItem': <item>, //用来移除active样式
}
```

# 返回值
```
{
	el: <el>,
	currentItem: <item>,
	pre: <item>
}
```

# 初始化

### 数据格式: 必填项
```
data:[
	{
		title:'一级结构',
		id:'1',  //选填
		lazy: true,  //子节点数据懒加载
		active: true,  //是否是选中状态，初始化的时候会添加active class，只会选择外层的第一个
		children:[
			{
				title: '二级结构',
				id:'10',
				children:[]
			}
		]
	}
]
```
### 参数:

```
{
	'data':{},
	<!-- 'isCatalog': false,  //是否是目录形式 ，即可收缩 -->
	<!-- 'catalogActiveEl': 'li', -->
	<!-- 'initOpen': true, -->
	<!-- 'activeEl': 'a',  -->
	'activeCallback ': fn,  //激活状态下的回调函数
	'lazyCallback':fn
}
```
