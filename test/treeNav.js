(function($) {
	function Tree(options,el) {
		$.extend(this,{
			'wrapClass': '',
			'data': [],
			// 'isCatalog': false,
			// 'catalogActiveEl': 'li',
			// 'activeEl': 'a', 
			// 'activeCallback'
			// 'lazyCallback' 
			'initOpen': false,
			'preventLink': true,
			// 'pre': '',
			'wrap':el
			// 'currentIndex': 0,
		}, options)

		var currentItem = ""
		Object.defineProperty(this, 'currentItem', {
			enumerable: true,
			configurable: true,
			get: function() {
				return currentItem
			},
			set: function(val) {
				currentItem && currentItem.removeClass('active')
				val.addClass('active')
				currentItem = val
			}
		})
		this.init()
	}
	var tree = Tree.prototype

	tree.currentItem = ""
	tree.wrap = ""

	tree.init = function() {
		
		var dom = this.initDom(this.data)

		this.wrap.html(dom)
		this.treeEvent()

		return this
	}
	tree.initDom = function(options) { //生成dom结构
		var data = options || {}
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
	tree.treeEvent = function() {
		var $this = this;

		this.wrap.on('click', 'a', function(e) {
			var par_li = $(this).closest('li')
			var data = $.extend({
				e: e,
				par: par_li
			}, $this)

			if (this.preventLink) e.preventDefault()
			// if (this.currentItem) this.currentItem.removeClass('active')
			// $(this).addClass('active')
			this.currentItem = $(this)

			this.activeCallback && this.activeCallback(data)
			if (par_li.data('lazy')){
				par_li.data('lazy',false)
				this.lazyCallback && this.lazyCallback(data)
			}
		})
	}
	tree.next = function(){
		var current = this.currentItem;
		var par_li = current.parent('li')
		var bro_ul = current.next('ul');
		var isSet;

		if(!bro_ul.length && par_li.attr('data-lazy')){
			this.lazyCallback && this.lazyCallback($.extend({
				e: this.currentItem,
				par: par_li
			},this))
			bro_ul = current.next('ul');
		}
		if(bro_ul.length){
			isSet = methods.findNext(bro_ul,this)
		}else if(!isSet){
			var par_bro_ul = par_li.next('li')
			isSet = methods.findNext(par_bro_ul,this)
		}
		if(!isSet) console.log('已经是最后一项了')
	}
	tree.pre = function(){
		var current = this.currentItem
		var par_li = current.parent('li')
		var bro_li = par_li.prev('li')
		var par_bro_ul = par_li.parent('ul')
		var par_bro_a = par_bro_ul.prev('a')
		var grand_bro_li = par_bro_ul.parent('li').prev('li')
		var isSet;

		// if(!bro_ul.length && par_li.attr('data-lazy')){
		// 	this.lazyCallback && this.lazyCallback($.extend({
		// 		e: this.currentItem,
		// 		par: par_li
		// 	},this))
		// 	bro_ul = current.next('ul');
		// }
		if(bro_li.length){  //
			isSet = methods.findPre(bro_li,this);
		}
		else if(par_bro_a){
			isSet = methods.findPre(par_bro_a.parent(),this)
		}else if(grand_bro_li){  //比较复杂，稍后分情况
			// if()
		}
		if(!isSet) console.log('已经是第一项了')
	}

	var methods = {
		destroy: function() {

		},
		findNext:function(bro_ul,tree){
			var next = bro_ul.find('a').eq(0);
			if(next){
				tree.currentItem = next;
				var par_li = next.closest('li')
				var current_data = $.extend({
					e: next,
					par: par_li
				}, tree)
				tree.activeCallback && tree.activeCallback(current_data)
				return true;
			}
			return false;
		},
		findPre:function(bro_li,tree){
			var pre = bro_li.find('a').eq(0);
			if(pre){
				tree.currentItem = pre;
				var par_li = next.closest('li')
				var current_data = $.extend({
					e: pre,
					par: par_li
				}, tree)
				tree.activeCallback && tree.activeCallback(current_data)
			}
		}
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
		initBranch: function(options) { //走字符串
			if (!options) options = {}
			var str = "<li>"
			str += "<a " + (options.active ? "class='active'" : "") + ">" + options.title + "</a>"

			if (options.children.length) {
				str += "<ul>"
				for (var i = 0; i < options.children.length; i++) {
					var child = options.children[i]
					str += methods.initBranch(child)
				}
				str += "</ul>"
			}
			str += "</li>"
			return str
		}
		**/
	}

	$.fn.treeNav = function(options) {
		if (!options.data.length) return
		var t = new Tree(options,this)
		return t
	}
})(jQuery)