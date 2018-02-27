(function($) {
	function Tree() {}
	var tree = Tree.prototype

	tree.currentItem = ""
	tree.wrap = ""

	tree.init = function(options, container) {
		var dom = this.initDom(options)

		container.html(dom)
		options.currentItem = this.currentItem

		this.wrap = container
		this.treeEvent(container, options)

		return this
	}
	// tree.throwData = function() {
	// 	var data = {}

	// 	data.currentItem = this.currentItem
	// 	data.wrap = this.wrap
	// 	data.append = this.append

	// 	return data
	// }
	tree.initDom = function(options) { //生成dom结构
		var data = options.data || options
		var dom = $("<ul></ul")

		for (var i = 0; i < data.length; i++) {
			this.initBranch(data[i], dom);
		}

		return dom
	}
	tree.initBranch = function(opt, par) { //枝叶dom
		var branch = $("<li id=" + opt.id + (opt.lazy ? " data-lazy=true" : "") + "></li>")

		if (opt.active && !this.currentItem) {
			var current = $("<a class='active'>" + opt.title + "</a>")
			this.currentItem = current
			branch.append(current)
		} else branch.append("<a>" + opt.title + "</a>")

		if (opt.children && opt.children.length & !opt.lazy) {
			var leaf = $('<ul></ul>')
			for (var i = 0; i < opt.children.length; i++) {
				var child = opt.children[i]
				this.initBranch(child, leaf)
			}
			branch.append(leaf)
		}

		par && par.append(branch)
	}
	tree.append = function(data, tar) {
		var dom = this.initDom(data)
		tar.append(dom)
	}
	tree.treeEvent = function(container, options) {
		var $this = this;

		container.on('click', 'a', function(e) {
			var par_li = $(this).closest('li')
			var data = $.extend({
				e: e,
				par: par_li
			}, $this)

			if (options.preventLink) e.preventDefault()
			if (options.currentItem) options.currentItem.removeClass('active')
			$(this).addClass('active')
			options.currentItem = $(this)

			options.activeCallback && options.activeCallback(data)
			if (par_li.data('lazy')){
				par_li.data('lazy',false)
				options.lazyCallback && options.lazyCallback(data)
			}
		})
	}

	var methods = {
		destroy: function() {

		},
		initStr: function(options) {
			var data = options.data
			var str = "<ul>"
			for (var i = 0; i < data.length; i++) {
				str += this.initBranch(data[i])
			}
			str += "</ul>"
			return str
		},
		/**
		{
			title:'一级结构',
			id:'1',  //选填
			active: true,  //是否是选中状态，初始化的时候会添加active class，只会选择外层的第一个
			children:[
				{
					title: '二级结构',
					id:'10',
					children:[]
				}
			]
		}
		**/
		// initBranch: function(options) { //走字符串
		// 	if (!options) options = {}
		// 	var str = "<li>"
		// 	str += "<a " + (options.active ? "class='active'" : "") + ">" + options.title + "</a>"

		// 	if (options.children.length) {
		// 		str += "<ul>"
		// 		for (var i = 0; i < options.children.length; i++) {
		// 			var child = options.children[i]
		// 			str += methods.initBranch(child)
		// 		}
		// 		str += "</ul>"
		// 	}
		// 	str += "</li>"
		// 	return str
		// },

	}

	$.fn.treeNav = function(options) {
		if (!options.data.length) return
		var settings = $.extend({
			'wrapClass': '',
			'data': [],
			// 'isCatalog': false,
			// 'catalogActiveEl': 'li',
			// 'activeEl': 'a', 
			// 'activeCallback'
			// 'lazyCallback' 
			'preventLink': true,
			'pre': '',
			// 'currentIndex': 0,
		}, options)

		var currentItem = ""
		Object.defineProperty(settings, 'currentItem', {
			enumerable: true,
			configurable: true,
			get: function() {
				return currentItem
			},
			set: function(val) {
				console.log(val)
				currentItem = val
			}
		})
		var t = new Tree()
		t.init(settings, this)
		return this
	}
})(jQuery)