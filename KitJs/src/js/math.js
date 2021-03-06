/**
 * 数组扩展
 */
$Kit.Math = function() {
	//
}
$Kit.Math.prototype = {
	/**
	 * 补0
	 */
	padZero : function(num, length) {
		var re = num.toString();
		do {
			var l1 = re.indexOf(".") > -1 ? re.indexOf(".") : re.length;
			if(l1 < length) {
				re = "0" + re;
			}
		} while (l1 < length);
		return re;
	},
	/**
	 * 随机数
	 */
	rand : function(max) {
		max = max || 100;
		return Math.round(Math.random() * max);
	},
	/**
	 * 取多少位的随机数，返回string
	 */
	randUnit : function(length) {
		length = length || 3;
		return this.padZero(Math.round(Math.random() * Math.pow(10, length)), length);
	},
	/**
	 * 取多少位的随机数，开头非0，返回数字
	 */
	randUnitNotZeroBefore : function(length) {
		length = length || 3;
		var re = Math.round(Math.random() * Math.pow(10, length));
		while(re < Math.pow(10, length - 1)) {
			re = Math.round(Math.random() * Math.pow(10, length));
		}
		return re;
	}
};
$kit.math = new $Kit.Math();
