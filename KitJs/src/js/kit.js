/*
 * Kit Js
 * a javascript library used to mobile phone web develop
 * author: xueduanyang1985@163.com
 * 3q & enjoy it!
 */
$kit = function() {
	// -----------------------------------constant variable-----------------------------------
	var CONSTANTS = {
		NODETYPE_ELEMENT : 1,
		NODETYPE_ELEMENT_ATTR : 2,
		NODETYPE_TEXTNODE : 3,
		NODETYPE_COMMENT : 8,
		NODETYPE_ROOT : 9,
		//
		REGEXP_SPACE : /\s+/g,
		//
		KIT_EVENT_REGISTER : "_kit_event_register_",
		KIT_EVENT_STOPIMMEDIATEPROPAGATION : "_kit_event_stopimmediatepropagation_",
		KIT_EVENT_REGISTER_FUNCATION_PREFIX : "_kit_event_register_funcation_prefix_",
		KIT_EVENT_STOPALLEVENT : "_kit_event_stopallevent_",
		KIT_DOM_ID_PREFIX : "J_Kit_"
	};
	// -----------------------------------string-----------------------------------
	function trim(str) {
		if (str == null) {
			return null;
		}
		return str.replace(/^\s+|\s+$/g, "");
	}

	function ltrim(str) {
		if (str == null) {
			return null;
		}
		return str.replace(/^\s+/, "");
	}

	function rtrim(str) {
		if (str == null) {
			return null;
		}
		return str.replace(/\s+$/, "");
	}

	// -----------------------------------array-----------------------------------
	/**
	 * remove some from array
	 */
	function arydel(ary, del) {
		if (isAry(del)) {
			for ( var i = 0; i < del.length; i++) {
				arydel(ary, del[i]);
			}
		} else {
			for ( var j = 0; j < ary.length; j++) {
				if (ary[j] == del) {
					ary.splice(j, 1);
				}
			}
		}
		return ary;
	}

	/**
	 * if someone in array
	 */
	function inAry(a, o) {
		var flag = false;
		for ( var i = 0; i < a.length; i++) {
			if (isAry(o)) {
				for ( var j = 0; j < o.length; j++) {
					if (a[i] == o[j]) {
						flag = true;
						break;
					}
				}
			} else {
				if (a[i] == o) {
					flag = true;
					break;
				}
			}
		}
		return flag;
	}

	// -----------------------------------find dom-----------------------------------
	/**
	 * by id
	 */
	function el8id(id, root) {
		return (root || document).getElementById(id);
	}

	/**
	 * by cls
	 */
	function el8cls(cls, root) {
		var a = (root || document).getElementsByClassName(cls);
		return (a == null && a.length == 0) ? null : a[0];
	}
	/**
	 * by tagName
	 */
	function els8tag(tagName, root) {
		return (root || document).getElementsByTagName(tagName);
	}
	/**
	 * els by cls
	 */
	function els8cls(cls, root) {
		return (root || document).getElementsByClassName(cls);
	}

	// -----------------------------------is something-----------------------------------
	/**
	 * boolean isString
	 */
	function isStr(o) {
		return typeof (o) == "string";
	}

	/**
	 * boolean isObject
	 */
	function isObj(o) {
		return typeof (o) == "object";
	}

	/**
	 * is it can iterator
	 */
	function isAry(o) {
		return typeof (o) == "array" || (isObj(o) && o != null && "length" in o && o.length > 0);
	}

	/**
	 * is string can be splite into a array which elements total > 2
	 */
	function isCanSplit2Ary(o, sign) {
		return isStr(o) && o.split(sign || /\s+/g).length > 1;
	}

	function isEmpty(o) {
		return typeof (o) == "undefined" || o == null || (isAry(o) && o.length == 0);
	}

	// -----------------------------------dom manipulate-----------------------------------
	/**
	 * get/set attr
	 */
	function attr(el, attr, value) {
		if (el != null && "nodeType" in el && CONSTANTS.NODETYPE_ELEMENT == el.nodeType) {
			if (value == null) {
				if (isObj(attr)) {
					for ( var l in attr) {
						el.setAttribute(l, attr[l]);
					}
				} else {
					return el.getAttribute(attr);
				}
			} else {
				el.setAttribute(attr, value);
			}
		}
		return null;
	}

	/**
	 * insert element
	 */
	function insEl(config) {
		var defaultConfig = {
			pos : "last",
			what : null,
			where : null
		}
		config = join(defaultConfig, config);
		var what = config.what, where = config.where;
		if (what != null && "nodeType" in where) {
			switch (config.pos.toString().toLowerCase()) {
				case "first" :
					if (CONSTANTS.NODETYPE_ELEMENT != where.nodeType) {
						where = where.parentNode;
					}
					where.insertAdjacentHTML("afterBegin", what);
					break;
				case "before" :
				case "previous" :
					if (CONSTANTS.NODETYPE_ELEMENT != where.nodeType) {
						var tmpDiv = document.createElement("div");
						where.insertBefore(tmpDiv);
						tmpDiv.insertAdjacentHTML("beforeBegin", what);
						where.parentNode.removeChild(tmpDiv);
					} else {
						where.insertAdjacentHTML("beforeBegin", what);
					}
					break;
				case "after" :
				case "nextsibling" :
					if (CONSTANTS.NODETYPE_ELEMENT != where.nodeType) {
						var tmpDiv = document.createElement("div");
						if (where.nextSibling) {
							where.insertBefore(tmpDiv);
						} else {
							where.parentNode.appendChild(tmpDiv);
						}
						tmpDiv.insertAdjacentHTML("beforeBegin", what);
						where.parentNode.removeChild(tmpDiv);
					} else {
						where.insertAdjacentHTML("afterEnd", what);
					}
					break;
				case "last" :
					if (CONSTANTS.NODETYPE_ELEMENT != where.nodeType) {
						where = where.parentNode;
					}
					where.insertAdjacentHTML("beforeEnd", what);
					break;
			}
		}
	}

	/**
	 * replace element
	 */
	function rpEl(element, html) {
		var range = element.ownerDocument.createRange();
		range.selectNodeContents(element);
		element.parentNode.replaceChild(range.createContextualFragment(html), element);
	}

	/**
	 * add className
	 */
	function addCls(el, clss) {
		if (isAry(clss)) {
			for ( var i = 0; i < clss.length; i++) {
				addCls(el, clss[i]);
			}
		} else {
			el.className += " " + trim(clss);
		}
	}

	/**
	 * remove className
	 */
	function delCls(el, clss) {
		var a = el.className.splite(CONSTANTS.REGEXP_SPACE), b = [];
		if (a.length) {
			b = arydel(a, clss);
		}
		if (b.length) {
			el.className = b.join(" ");
		}
	}
	function traversal(config) {
		var defaultConfig = {
			root : document.body
		}
		merge(config, defaultConfig);
		if (isEmpty(config.node)) {
			config.node = config.root;
		}
		for ( var i = 0; i < config.node.childNodes.length; i++) {
			var o = config.node.childNodes[i];
			if (o.childNodes.length) {
				traversal(merge(config, {
					node : o
				}));
			} else {
				if (!isEmpty(config.fn)) {
					config.fn.apply(o, [o, config.root])
				}
			}
		}
	}
	/**
	 * offset
	 */
	function offset(el) {
		if (el == null) {
			return;
		}
		var offsetPar = el.offsetParent, //
		top = el.offsetTop, //
		left = el.offsetLeft, //
		width = el.offsetWidth, //
		height = el.offsetHeight;
		while (el != offsetPar) {
			el = offsetPar;
			top += el.offsetTop;
			left += el.offsetLeft;
		}
		return {
			top : top,
			left : left,
			width : width,
			height : height
		}
	}
	/**
	 * scroll position
	 */
	function scroll(config) {
		if (config == null) {
			return {
				top : document.body.scrollTop == 0 ? window.scrollY : document.body.scrollTop,
				left : document.body.scrollLeft == 0 ? window.scrollX : document.body.scrollLeft
			}
		}
	}
	// -----------------------------------event-----------------------------------
	/**
	 * register event
	 * 
	 * @el : event triggle element
	 * @ev : event
	 * @fn : event call out function
	 * @scope : execute context
	 */
	function ev(config) {
		var defaultConfig = {
			el : window,
			ev : null,
			fn : null
		}
		config = join(defaultConfig, config);
		if (isAry(config.el)) {
			for ( var i = 0; i < config.el.length; i++) {
				ev(join(config, {
					el : config.el[i]
				}));
			}
		} else if (isCanSplit2Ary(config.el)) {
			var a = config.el.split(CONSTANTS.REGEXP_SPACE)
			for ( var i = 0; i < a.length; i++) {
				var _el = el8id(a[i]);
				if (!isEmpty(_el)) {
					ev(join(config, {
						el : _el
					}));
				}
			}
		} else if (isStr(config.el)) {
			var _el = el8id(config.el);
			if (!isEmpty(_el)) {
				ev(join(config, {
					el : _el
				}));
			}
		} else if (isAry(config.ev)) {
			for ( var i = 0; i < config.ev.length; i++) {
				ev(join(config, {
					ev : config.ev[i]
				}));
			}
		} else if (isCanSplit2Ary(config.ev)) {
			var a = config.ev.split(CONSTANTS.REGEXP_SPACE);
			for ( var i = 0; i < a.length; i++) {
				ev(join(config, {
					ev : a[i]
				}));
			}
		} else {
			config.ev = trim(config.ev);
			if (!isEmpty(config.ev)) {
				// -------webkit support stopImmediatePropagation, so comment this template
				var p1, flag_regEvent = false;
				if (CONSTANTS.KIT_EVENT_REGISTER in config.el) {
					p1 = config.el[CONSTANTS.KIT_EVENT_REGISTER];
					if (config.ev in p1) {
						// just so so...
					} else {
						p1[config.ev] = [];
						flag_regEvent = true;
					}
				} else {
					p1 = config.el[CONSTANTS.KIT_EVENT_REGISTER] = {};
					p1[config.ev] = [];
					flag_regEvent = true;
				}
				if (flag_regEvent) {
					config.el[CONSTANTS.KIT_EVENT_REGISTER_FUNCATION_PREFIX + config.ev] = config.el[CONSTANTS.KIT_EVENT_REGISTER_FUNCATION_PREFIX + config.ev] || (function() {
						if (window[CONSTANTS.KIT_EVENT_STOPALLEVENT]) {
							return;
						}
						var EV = arguments[0];
						merge(EV, {
							stopNow : function() {
								EV.stopPropagation();
								EV.preventDefault();
								window[$kit.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = true;
							},
							stopDefault : function() {
								EV.preventDefault();
							},
							stopGoOn : function() {
								EV.stopPropagation();
							}
						});
						// EV.stopNow = function() {
						// this.stopPropagation.call(this);
						// EV.preventDefault();
						// window[CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION]
						// = true;
						// }
						var target = config.el;
						var evQueue = target[CONSTANTS.KIT_EVENT_REGISTER][config.ev];
						for ( var i = 0; i < evQueue.length; i++) {
							if (window[CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION]) {
								break;
							}
							var _config = evQueue[i];
							// merge(_EV, {
							// stopNow : function() {
							// this.originEv.stopPropagation();
							// this.originEv.preventDefault();
							// window[$kit.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION]
							// = true;
							// },
							// stopDefault : function() {
							// this.originEv.preventDefault();
							// },
							// stopGoOn : function() {
							// this.originEv.stopPropagation();
							// }
							// });
							_config.fn.call(_config.scope || _config.el, EV);
						}
						window[CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = false;
					});
					config.el.addEventListener(config.ev, config.el[CONSTANTS.KIT_EVENT_REGISTER_FUNCATION_PREFIX + config.ev], false);
				}
				p1[config.ev].push(config);
			}
		}
	}

	/**
	 * remove event register
	 */
	function delEv(config) {
		var defaultConfig = {
			el : window,
			ev : null,
			fn : null,
			scope : this
		}
		config = join(defaultConfig, config);
		if (isAry(config.el)) {
			for ( var i = 0; i < config.el.length; i++) {
				delEv(join(config, {
					el : config.el[i]
				}));
			}
		} else if (isCanSplit2Ary(config.el)) {
			var a = config.el.split(CONSTANTS.REGEXP_SPACE)
			for ( var i = 0; i < a.length; i++) {
				var _el = el8id(a[i]);
				if (!isEmpty(_el)) {
					delEv(join(config, {
						el : _el
					}));
				}
			}
		} else if (isStr(config.el)) {
			var _el = el8id(config.el);
			if (!isEmpty(_el)) {
				delEv(join(config, {
					el : _el
				}));
			}
		} else if (isAry(config.ev)) {
			for ( var i = 0; i < config.ev.length; i++) {
				delEv(join(config, {
					ev : config.ev[i]
				}));
			}
		} else if (isCanSplit2Ary(config.ev)) {
			var a = config.ev.split(CONSTANTS.REGEXP_SPACE)
			for ( var i = 0; i < a.length; i++) {
				delEv(join(config, {
					ev : a[i]
				}));
			}
		} else {
			config.ev = trim(config.ev);
			if (!isEmpty(config.ev)) {
				var evQueue = config.el[CONSTANTS.KIT_EVENT_REGISTER][config.ev];
				for ( var i = 0; i < evQueue.length; i++) {
					var _config = evQueue[i];
					if (_config.fn.toString() == config.fn.toString()) {
						evQueue.splice(i, 1);
					}
				}
				if (evQueue.length == 0) {
					config.el.removeEventListener(config.ev, config.el[CONSTANTS.KIT_EVENT_REGISTER_FUNCATION_PREFIX + config.ev], false);
				}
			}
		}
	}

	// -----------------------------------object manipulate-----------------------------------
	/**
	 * combine object
	 */
	function join() {
		var a = arguments, b = {};
		if (a.length == 0) {
			return;
		}
		for ( var i = 0; i < a.length; i++) {
			for ( var r in a[i]) {
				b[r] = a[i][r];
			}
		}
		return b;
	}

	/**
	 * draw from another
	 */
	function merge() {
		var a = arguments;
		if (a.length < 2) {
			return;
		}
		for ( var i = 1; i < a.length; i++) {
			for ( var r in a[i]) {
				a[0][r] = a[i][r];
			}
		}
		return a[0];
	}
	/**
	 * is collection include object
	 */
	function has(collection, object, ignoreCase) {
		var flag = false, ignoreCase = (ignoreCase == true ? ignoreCase : false);
		if (isAry(collection)) {
			for ( var i = 0; i < collection.length; i++) {
				if (collection[i] == object || (ignoreCase && collection[i].toLowerCase() == object.toLowerCase())) {
					flag = true;
					break;
				}
			}
		} else {
			if (collection != null) {
				if (object in collection) {
					flag = true;
				} else if (ignoreCase) {
					for ( var p in collection) {
						if (p.toString().toLowerCase() == object.toString().toLowerCase()) {
							flag = true;
							break;
						}
					}
				}
			}
		}
		return flag;
	}
	// -----------------------------------log-----------------------------------
	function log(info, config) {
		config = merge({
			borderColor : "#000"
		}, config);
		if (isAry(info)) {
			info = info.join("");
		}
		if (document.body) {
			var div = document.body.appendChild(document.createElement("div"));
			div.className = "J_Debug_Info";
			div.style.borderBottom = "1px solid " + config.borderColor || "#000";
			try {
				div.innerText += info;
			} catch (e) {
				div.innerText += e.toString();
			}
		} else {
			alert(info);
		}

	}

	function clsLog() {
		var a = els8cls("J_Debug_Info");
		for ( var i = 0; i < a.length; i++) {
			a[i].parentNode.removeChild(a[i]);
		}
	}

	// -----------------------------------else-----------------------------------
	function only() {
		var rnd = Math.random(10000);
		return rnd.toString().substr(2, 10);
	}
	/**
	 * generate unique DOM id
	 */
	function onlyId() {
		var id = CONSTANTS.KIT_DOM_ID_PREFIX + only();
		var count;
		if (arguments.length == 1) {
			count = arguments[0];
		} else {
			count = 0;
		}
		count++;
		$kit.log(count);
		if (count > 100) {
			throw "error!";
		}
		if (!isEmpty(el8id(id))) {
			return onlyId(count);
		}
		return id
	}
	function iOSInfo() {
		var regExp_appleDevice = /\(([a-z; ]+)CPU ([a-z ]*)OS ([\d_]+) like Mac OS X/i;
		var ver, device, re;
		if (regExp_appleDevice.test(navigator.userAgent)) {
			var a = navigator.userAgent.match(regExp_appleDevice);
			ver = trim(a[3]);
			ver = ver.replace(/_/g, ".");
			device = trim(a[1]);
			device = device.substring(0, device.indexOf(";"));
			re = {
				device : device,
				ver : ver
			}
		}
		return re;
	}
	/**
	 * config include array, exclude, fn, scope iterator each element in array not include exclude
	 */
	function each(config) {
		var a = config.array;
		for ( var __i = 0; __i < a.length; __i++) {
			if (inAry(config.exclude, a[__i])) {
				continue;
			} else {
				config.fn.call(config.scope || this, a[__i], __i, a);
			}
		}
	}

	/**
	 * dom ready
	 */
	function $(fn) {
		ev({
			ev : "load",
			fn : fn
		});
	}

	// -----------------------------init------------------------------------
	window[CONSTANTS.KIT_EVENT_STOPALLEVENT] = false;
	window[CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = false;
	var SYSINFO = {}, inf;
	inf = iOSInfo();
	if (inf != null) {
		merge(SYSINFO, inf);
	}
	// -----------------------------------return-----------------------------------
	return {
		CONSTANTS : CONSTANTS,
		trim : trim,
		ltrim : ltrim,
		rtrim : rtrim,
		arydel : arydel,
		el8id : el8id,
		el8cls : el8cls,
		els8tag : els8tag,
		els8cls : els8cls,
		isStr : isStr,
		isObj : isObj,
		isAry : isAry,
		isEmpty : isEmpty,
		attr : attr,
		insEl : insEl,
		rpEl : rpEl,
		addCls : addCls,
		delCls : delCls,
		traversal : traversal,
		offset : offset,
		scroll : scroll,
		ev : ev,
		delEv : delEv,
		join : join,
		merge : merge,
		has : has,
		log : log,
		clsLog : clsLog,
		only : only,
		onlyId : onlyId,
		iOSInfo : iOSInfo,
		each : each,
		$ : $,
		SYS : SYSINFO
	}
}();
/**
 * register widget
 */
$kit.ui = {};
