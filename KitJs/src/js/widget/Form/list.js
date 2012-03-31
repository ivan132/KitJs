/**
 * 鼠标键盘操作的列表，常用于input的下拉
 */
$kit.ui.Form.List = function(config) {
	$kit.inherit({
		child : $kit.ui.Form.List,
		father : $kit.ui.Form
	});
	var me = this;
	me.config = $kit.join(me.constructor.defaultConfig, config);
	me.init();
}
$kit.merge($kit.ui.Form.List, {
	defaultConfig : {
		where : undefined,
		pos : 'last',
		what : [//
		'<ul class="${listCls}">', //
		'</ul>'//
		].join(''),
		kitWidgetName : 'kitFormList',
		listCls : 'kitjs-form-list',
		listItemCls : 'kitjs-form-listItem',
		oddListItemCls : 'kitjs-form-listItem-odd',
		evenListItemCls : 'kitjs-form-listItem-even',
		listItemHTML : [//
		'<li class="${listItemCls} ${oddOrEven}" value="${value}">', //
		'${key}', //
		'</li>'//
		].join(''),
		list : undefined,
		selectedCls : 'selected',
		triggleEl : undefined, //事件触发元素
		template : {
			initHTML : '<div class="kitjs-form-list-loading"><i></i>初始化数据中...</div>',
			errorHTML : '<div class="kitjs-form-list-error">抱歉，没有数据!</div>'
		},
		setValue : undefined
	}
});
$kit.merge($kit.ui.Form.List.prototype, {
	/*
	 * 初始化
	 */
	init : function() {
		$kit.insEl({
			where : this.config.where,
			pos : this.config.pos,
			what : $kit.tpl(this.config.what, this.config)
		});
		this.listItemCount = 0;
		this.listEl = $kit.el8cls(this.config.listCls, this.config.where);
		this.buildList(this.config.list);
		this.bindEv();
		this.hide();
	},
	/**
	 * 创建列表
	 */
	buildList : function(list) {
		var me = this;
		this.listItemCount = 0;
		this.selectedLi = null;
		if(list && list.length) {
			this.listEl.innerHTML = this.config.template.initHTML;
			setTimeout(function() {
				var fragment = document.createDocumentFragment();
				$kit.each(list, function(o, idx) {
					fragment.appendChild($kit.newHTML($kit.tpl(me.config.listItemHTML, $kit.join(me.config, o, {
						oddOrEven : idx % 2 == 0 ? me.config.evenListItemCls : me.config.oddListItemCls
					}))));
					me.listItemCount++;
				});
				me.listEl.innerHTML = '';
				me.listEl.appendChild(fragment);
			}, 0);
		} else {
			this.listEl.innerHTML = this.config.template.errorHTML;
		}
	},
	bindEv : function() {
		var me = this;
		/**
		 * 失去焦点，关闭列表
		 */
		$kit.ev({
			el : me.config.triggleEl,
			ev : 'blur',
			fn : function(e) {
				var me = this;
				if(me._flag_listEl_mousedown_ev == true) {
					me._flag_listEl_mousedown_ev = false;
				} else {
					me.hide();
				}
			},
			scope : me
		});
		/**
		 * 获得焦点，展开列表
		 */
		$kit.ev({
			el : me.config.triggleEl,
			ev : 'focus',
			fn : function() {
				var me = this;
				if(me.listItemCount > 0 && me._flag_listEl_mouseclick_setvalue_ev != true) {
					me.show();
				}
				me._flag_listEl_mouseclick_setvalue_ev = false;
			},
			scope : me
		});
		/**
		 * 鼠标选择
		 */
		$kit.ev({
			el : me.listEl,
			ev : 'mouseover',
			fn : function(e) {
				var me = this;
				var li;
				if($kit.hsCls(e.target, me.config.listItemCls)) {
					li = e.target;
				} else {
					li = $kit.dom.parentEl8cls(e.target, me.config.listItemCls, me.listEl);
				}
				if(li) {
					if(me.selectedLi) {
						$kit.rmCls(me.selectedLi, me.config.selectedCls);
					}
					$kit.adCls(li, me.config.selectedCls);
					me.selectedLi = li;
				}
			},
			scope : me
		});
		/**
		 * 鼠标移出列表区，inputEl聚焦
		 */
		$kit.ev({
			el : me.listEl,
			ev : 'mouseout',
			fn : function(e) {
				var me = this;
				if(!$kit.contains(me.listEl, e.relatedTarget)) {
					me.config.triggleEl.focus();
				}
			},
			scope : me
		});
		$kit.ev({
			el : me.listEl,
			ev : 'mousedown',
			fn : function(e) {
				me._flag_listEl_mousedown_ev = true;
			},
			scope : me
		});
		$kit.ev({
			el : me.listEl,
			ev : 'click',
			fn : function(e) {
				var me = this;
				me._flag_listEl_mouseclick_select_ev = true;
				if(e.button < 2) {
					var li;
					if($kit.hsCls(e.target, me.config.listItemCls)) {
						li = e.target;
					} else {
						li = $kit.dom.parentEl8cls(e.target, me.config.listItemCls, me.listEl);
					}
					if(li) {
						me.hide();
						me._flag_listEl_mouseclick_setvalue_ev = true;
						me.selectedLi = li;
						me.config.setValue && me.config.setValue(li.innerHTML, $kit.attr(li, 'value'), li);
					}
				}
			},
			scope : me
		});
		/**
		 * 键盘事件响应
		 */
		$kit.ev({
			el : me.config.triggleEl,
			ev : 'keydown',
			fn : function(e) {
				var me = this;
				if($kit.event.KEYCODE_DOWN == e.keyCode//下
				|| $kit.event.KEYCODE_UP == e.keyCode//上
				|| $kit.event.KEYCODE_ENTER == e.keyCode//回车
				|| $kit.event.KEYCODE_ESC == e.keyCode//esc
				|| $kit.event.KEYCODE_PAGEDOWN == e.keyCode//pagedown
				|| $kit.event.KEYCODE_PAGEUP == e.keyCode//pageup
				) {
					//var selectedLi = $kit.el8cls('selected', me.listEl);
					var selectedLi = me.selectedLi;
					var firstLi = $kit.el8cls(me.config.listItemCls, me.listEl);
					if($kit.event.KEYCODE_DOWN == e.keyCode && me.listEl.childNodes.length) {
						/**
						 * 下
						 */
						me.show();
						if($kit.isEmpty(selectedLi)) {
							$kit.adCls(firstLi, 'selected');
							me.selectedLi = firstLi;
						} else {
							$kit.rmCls(selectedLi, 'selected');
							var nextLi = $kit.nextEl(selectedLi, function(el) {
								if($kit.hsCls(el, me.config.listItemCls)) {
									return true;
								}
							});
							if(nextLi) {
								$kit.adCls(nextLi, 'selected');
								me.selectedLi = nextLi;
							} else {
								$kit.adCls(firstLi, 'selected');
								me.selectedLi = firstLi;
							}
						}
					} else if($kit.event.KEYCODE_UP == e.keyCode && me.listEl.childNodes.length) {
						/**
						 * 上
						 */
						me.show();
						if($kit.isEmpty(selectedLi)) {
							$kit.adCls(firstLi, 'selected');
							me.selectedLi = firstLi;
						} else {
							$kit.rmCls(selectedLi, 'selected');
							var prevLi = $kit.prevEl(selectedLi, function(el) {
								if($kit.hsCls(el, me.config.listItemCls)) {
									return true;
								}
							});
							if(prevLi) {
								$kit.adCls(prevLi, 'selected');
								me.selectedLi = prevLi;
							} else {
								$kit.adCls(firstLi, 'selected');
								me.selectedLi = firstLi;
							}
						}
					} else if($kit.event.KEYCODE_PAGEUP == e.keyCode && me.listEl.childNodes.length) {
						/**
						 * pageup
						 */
						me.show();
						if($kit.isEmpty(selectedLi)) {
							$kit.adCls(firstLi, 'selected');
							me.selectedLi = firstLi;
						} else {
							$kit.rmCls(selectedLi, 'selected');
							var throughCount = Math.floor(me.listEl.offsetHeight / me.selectedLi.offsetHeight);
							var prevLi = selectedLi;
							while(throughCount--) {
								var _li = $kit.prevEl(prevLi, function(el) {
									if($kit.hsCls(el, me.config.listItemCls)) {
										return true;
									}
								});
								if(_li == null) {
									break;
								}
								prevLi = _li;
							}
							if(prevLi) {
								$kit.adCls(prevLi, 'selected');
								me.selectedLi = prevLi;
							} else {
								$kit.adCls(firstLi, 'selected');
								me.selectedLi = firstLi;
							}
						}
					} else if($kit.event.KEYCODE_PAGEDOWN == e.keyCode && me.listEl.childNodes.length) {
						/**
						 * pagedown
						 */
						me.show();
						if($kit.isEmpty(selectedLi)) {
							$kit.adCls(firstLi, 'selected');
							me.selectedLi = firstLi;
						} else {
							$kit.rmCls(selectedLi, 'selected');
							var throughCount = Math.floor(me.listEl.offsetHeight / me.selectedLi.offsetHeight);
							var nextLi = selectedLi;
							while(throughCount--) {
								var _li = $kit.nextEl(nextLi, function(el) {
									if($kit.hsCls(el, me.config.listItemCls)) {
										return true;
									}
								});
								if(_li == null) {
									break;
								}
								nextLi = _li;
							}
							if(nextLi) {
								$kit.adCls(nextLi, 'selected');
								me.selectedLi = nextLi;
							} else {
								$kit.adCls(firstLi, 'selected');
								me.selectedLi = firstLi;
							}
						}
					} else if($kit.event.KEYCODE_ENTER == e.keyCode && me.isShow() && me.listItemCount) {
						/**
						 * 回车
						 */
						me.hide();
						me.config.setValue && me.config.setValue(me.selectedLi.innerHTML, $kit.attr(me.selectedLi, 'value'), me.selectedLi);
						//回车要取消默认事件，防止form提交
						e.stopDefault();
					} else if($kit.event.KEYCODE_ESC == e.keyCode) {
						/**
						 * ESC，关闭下拉框
						 */
						if(me.isShow()) {
							me.hide();
						}
					}
					me.adjustScrollTop(me.listEl);
					e.stopDefault();
				}
			},
			scope : me
		});
	},
	adjustScrollTop : function(listEl) {
		selectedLi = this.selectedLi;
		if($kit.isEmpty(selectedLi)) {
			return;
		}
		if(selectedLi.offsetTop < listEl.scrollTop || selectedLi.offsetTop + selectedLi.offsetHeight > listEl.scrollTop + listEl.offsetHeight) {
			selectedLi.scrollIntoView();
		}
	},
	isHide : function() {
		var me = this;
		return me.listEl.style.display != 'block'
	},
	isShow : function() {
		var me = this;
		return me.listEl.style.display == 'block'
	},
	show : function() {
		var me = this;
		me._flag_listEl_mouseclick_select_ev = false;
		me.listEl.style.display = 'block';
	},
	hide : function() {
		var me = this;
		me.listEl.style.display = 'none';
	}
});
