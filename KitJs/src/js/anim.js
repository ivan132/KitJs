/**
 * javascript animation 动画扩展
 */
$Kit.Animation = $Kit.Anim = function() {
	//
}
$Kit.Anim.prototype = {
	/**
	 * 动画
	 */
	motion : function(config) {
		var me = this;
		var defaultConfig = {
			timeSeg : 17,
			duration : 1000,
			el : undefined,
			elSplitRegExp : /\s+/,
			from : undefined,
			to : undefined,
			fx : undefined,
			then : undefined,
			scope : window,
			exceptStyleArray : ["scrollTop", "scrollLeft"],
			timeout : undefined
		};
		$kit.mergeIf(config, defaultConfig);
		if(!$kit.isEmpty(config.el)) {
			config.hold = 0;
			var f1 = false, timeoutStr;
			if($kit.isStr(config.timeout)) {
				timeoutStr = config.timeout;
				clearInterval(window[config.timeout]);
				f1 = true;
			} else {
				clearInterval(config.timeout);
			}
			// 重置初始样式
			for(var p in config.from) {
				me.setStyle({
					el : config.el,
					styleName : p,
					styleValue : config.from[p],
					exceptStyleArray : config.exceptStyleArray,
					elSplitRegExp : config.elSplitRegExp
				});
			}
			config.timeout = setInterval(function() {
				config.hold += config.timeSeg;
				if(config.hold >= config.duration) {
					for(var p in config.to) {
						me.setStyle({
							el : config.el,
							styleName : p,
							styleValue : config.to[p],
							exceptStyleArray : config.exceptStyleArray,
							elSplitRegExp : config.elSplitRegExp
						});
					}
					clearInterval(config.timeout);
					config.timeout = null;
					if($kit.isFn(config.then)) {
						config.then.call(config.scope, config);
					}
				} else {
					for(var p in config.to) {
						if(!( p in config.from)) {
							continue;
						}
						var sty = me.identifyCssValue(config.from[p]), sty1 = me.identifyCssValue(config.to[p]), reSty = "";
						if(sty == null || sty1 == null) {
							continue;
						}
						for(var i = 0; i < sty1.length; i++) {
							if(i > 0) {
								reSty += " ";
							}
							var o = sty1[i];
							o.value = me.fx(config.fx)(config.hold, (sty == null ? 0 : sty[i].value), (sty == null ? sty1[i].value : (sty1[i].value - sty[i].value)), config.duration)
							reSty += o.prefix + o.value + o.unit + o.postfix;
						}
						me.setStyle({
							el : config.el,
							styleName : p,
							styleValue : reSty,
							exceptStyleArray : config.exceptStyleArray,
							elSplitRegExp : config.elSplitRegExp
						});
					}
				}
			}, config.timeSeg);
			if(f1) {
				window[timeoutStr] = config.timeout
			}
			return config;
		}
	},
	/**
	 * 分解css的值，知道哪个是value(数字)，那个是单位
	 */
	identifyCssValue : function(cssStr) {
		var me = this;
		if( typeof (cssStr) != "undefined") {
			cssStr = cssStr.toString();
			var a1 = cssStr.match(/([a-z\(]*)([+-]?\d+\.?\d*)([a-z|%]*)([a-z\)]*)/ig);
			if(a1 != null) {
				var reSty = [];
				for(var i = 0; i < a1.length; i++) {
					var a = a1[i].match(/([a-z\(]*)([+-]?\d+\.?\d*)([a-z|%]*)([a-z\)]*)/i);
					var sty = {
						style : a[0],
						prefix : a[1],
						value : parseFloat(a[2]),
						unit : a[3],
						postfix : a[4]
					}
					reSty.push(sty);
				}
				return reSty;
			}
		}
		return null;
	},
	/**
	 * 设置样式
	 */
	setStyle : function() {
		if(arguments.length == 1 && $kit.isObj(arguments[0])) {
			var config = arguments[0];
			var elArray, //
			styleName = config.styleName, //
			styleValue = config.styleValue, //
			elSplitRegExp = /\s+/ || config.elSplitRegExp, //
			exceptStyleArray = ["scrollTop", "scrollLeft"] || config.exceptStyleArray;
			if($kit.isStr(config.el)) {
				elArray = config.el.split(elSplitRegExp);
			} else if($kit.isAry(config.el)) {
				elArray = config.el;
			} else {
				elArray = [config.el];
			}
			for(var k = 0; k < elArray.length; k++) {
				var el = $kit.el(elArray[k]);
				if($kit.isNode(el)) {
					if($kit.inAry(exceptStyleArray, styleName)) {
						if(styleName.toLowerCase() == 'scrolltop' && el == document.body) {
							scrollTo($kit.viewport().scrollLeft, styleValue);
						} else if(styleName.toLowerCase() == 'scrollleft' && el == document.body) {
							scrollTo(styleValue, $kit.viewport().scrollTop);
						} else {
							el[styleName] = styleValue;
						}
					} else {
						if(styleName.toLowerCase() == 'opacity' && $kit.isIE()) {
							el.style.filter = 'alpha(opacity=' + styleValue * 100 + ')';
						} else {
							el.style[styleName] = styleValue;
						}
					}
				} else if($kit.isNodeList(el)) {
					for(var j = 0; j < el.length; j++) {
						if($kit.inAry(exceptStyleArray, styleName)) {
							if(styleName.toLowerCase() == 'scrolltop' && el[j] == document.body) {
								scrollTo($kit.viewport().scrollLeft, styleValue);
							} else if(styleName.toLowerCase() == 'scrollleft' && el[j] == document.body) {
								scrollTo(styleValue, $kit.viewport().scrollTop);
							} else {
								el[j][styleName] = styleValue;
							}
						} else {
							if(styleName.toLowerCase() == 'opacity' && $kit.isIE()) {
								el[j].style.filter = 'alpha(opacity=' + styleValue * 100 + ')';
							} else {
								el[j].style[styleName] = styleValue;
							}
						}
					}
				}
			}
		}
	},
	/**
	 * 曲线函数
	 */
	Fx : {
		swing : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInQuad : function(t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad : function(t, b, c, d) {
			if((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		easeInCubic : function(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOutCubic : function(t, b, c, d) {
			return c * (( t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic : function(t, b, c, d) {
			if((t /= d / 2) < 1)
				return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		easeInQuart : function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart : function(t, b, c, d) {
			return -c * (( t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart : function(t, b, c, d) {
			if((t /= d / 2) < 1)
				return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		easeInQuint : function(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint : function(t, b, c, d) {
			return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint : function(t, b, c, d) {
			if((t /= d / 2) < 1)
				return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		easeInSine : function(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine : function(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine : function(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo : function(t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo : function(t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo : function(t, b, c, d) {
			if(t == 0)
				return b;
			if(t == d)
				return b + c;
			if((t /= d / 2) < 1)
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc : function(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc : function(t, b, c, d) {
			return c * Math.sqrt(1 - ( t = t / d - 1) * t) + b;
		},
		easeInOutCirc : function(t, b, c, d) {
			if((t /= d / 2) < 1)
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		easeInElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if(t == 0)
				return b;
			if((t /= d) == 1)
				return b + c;
			if(!p)
				p = d * .3;
			if(a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		easeOutElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if(t == 0)
				return b;
			if((t /= d) == 1)
				return b + c;
			if(!p)
				p = d * .3;
			if(a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		easeInOutElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if(t == 0)
				return b;
			if((t /= d / 2) == 2)
				return b + c;
			if(!p)
				p = d * (.3 * 1.5);
			if(a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			if(t < 1)
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		},
		easeInBack : function(t, b, c, d, s) {
			if(s == undefined)
				s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack : function(t, b, c, d, s) {
			if(s == undefined)
				s = 1.70158;
			return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack : function(t, b, c, d, s) {
			if(s == undefined)
				s = 1.70158;
			if((t /= d / 2) < 1)
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		easeInBounce : function(t, b, c, d) {
			return c - $kit.anim.Fx.easeOutBounce(d - t, 0, c, d) + b;
		},
		easeOutBounce : function(t, b, c, d) {
			if((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if(t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if(t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		easeInOutBounce : function(t, b, c, d) {
			if(t < d / 2)
				return $kit.anim.Fx.easeInBounce(t * 2, 0, c, d) * .5 + b;
			return $kit.anim.Fx.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}
	},
	/**
	 * 根据类型返回对应的曲线函数，或者自定义函数
	 */
	fx : function(type) {
		var me = this;
		if($kit.isStr(type) && $kit.has(me.Fx, type)) {
			return me.Fx[type];
		} else if($kit.isFn(type)) {
			return type;
		}
		return me.Fx.swing;
	}
}
$kit.anim = new $Kit.Anim();
