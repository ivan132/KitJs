/**
 * 日期时间扩展
 */
$Kit.Date = function() {
	//
}
$Kit.Date.prototype = {
	/**
	 * 返回时间，单位秒 dd:dd:dd 时:分:秒
	 */
	parseTime : function(timeStr) {
		if($kit.isEmpty(timeStr)) {
			return undefined;
		}
		var me = this;
		var a = timeStr.split(":");
		var hours, minutes, seconds;
		if(a.length == 3) {
			hours = parseFloat(a[0]);
			minutes = parseFloat(a[1]);
			seconds = parseFloat(a[2]);
		} else if(a.length == 2) {
			hours = 0;
			minutes = parseFloat(a[0]);
			seconds = parseFloat(a[1]);
		} else {
			hours = 0;
			minutes = 0;
			seconds = parseFloat(a[0]);
		}
		var time = hours * 60 * 60 + minutes * 60 + seconds;
		time = Math.round(time);
		return time;
	},
	/**
	 * 返回时间字符串 dd:dd:dd，参数time，单位秒
	 */
	formatTime : function(time) {
		time = parseFloat(time);
		var me = this;
		var minutes = Math.floor(time / 60);
		var hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		var seconds = (time % 60).toFixed(0);
		return $kit.math.padZero(hours, 2) + ":" + $kit.math.padZero(minutes, 2) + ":" + $kit.math.padZero(seconds, 2);
	},
	/**
	 * 是否闰年
	 */
	isLeapYear : function(year) {
		return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
	},
	/**
	 * 一个月有多少天
	 */
	getDaysInMonth : function(year, month) {
		return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
	},
	//格式
	validParts : /E{1}|D{1}|F{1}|a{1}|hh{1}|HH{1}|SS{1}|ss{1}|dd{1}|mm{1}|MM{1}|yy(?:yy){1}/g,
	dateSplitRegExp : /(E{1}|D{1}|F{1}|a{1}|hh{1}|HH{1}|SS{1}|ss{1}|dd{1}|mm{1}|MM{1}|yy(?:yy){1})/g,
	nonpunctuation : /[^ -\/:-@\[-`{-~\t\n\r\D]+/g,
	/**
	 *
	 */
	parseFormat : function(format) {
		var separators = $kit.array.delEmpty(format.split(this.validParts)), parts = $kit.array.delEmpty((format.match(this.validParts))), //
		date = $kit.array.delEmpty(format.split(this.dateSplitRegExp));
		if(!separators || !separators.length || !parts || parts.length == 0) {
			throw new Error("Invalid date format.");
		}
		return {
			separators : separators,
			parts : parts,
			date : date
		};
	},
	/**
	 * 按照按照format解析返回日期对象
	 */
	languagePack : {
		en : {
			days : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			weekStart : 0
		},
		cn : {
			days : ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort : ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin : ["七", "一", "二", "三", "四", "五", "六", "七"],
			months : ["一月份", "二月份", "三月份", "四月份", "五月份", "六月份", "七月份", "八月份", "九月份", "十月份", "十一月", "十二月"],
			monthsShort : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
			weekStart : 1
		}
	},
	parseDate : function(date, format, language) {
		var me = this;
		if( date instanceof Date) {
			return date;
		}
		language = language || 'en';
		if(/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
			var part_re = /([-+]\d+)([dmwy])/, parts = date.match(/([-+]\d+)([dmwy])/g), part, dir;
			date = new Date();
			for(var i = 0; i < parts.length; i++) {
				part = part_re.exec(parts[i]);
				dir = parseInt(part[1]);
				switch(part[2]) {
					case 'd':
						date.setDate(date.getDate() + dir);
						break;
					case 'm':
						this.moveMonth.call(date, dir);
						break;
					case 'w':
						date.setDate(date.getDate() + dir * 7);
						break;
					case 'y':
						this.moveYear(date, dir);
						break;
				}
			}
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
		}
		var parts = date ? date.match(this.nonpunctuation) : [], date = new Date(), val, filtered;
		date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
		if(parts.length == format.parts.length) {
			for(var i = 0, cnt = format.parts.length; i < cnt; i++) {
				val = parseInt(parts[i], 10) || 1;
				switch(format.parts[i]) {
					case 'MM':
						filtered = $kit.array.filter(this.languagePack[language].months, function(o, index, ary) {
							var m = ary.slice(0, parts[i].length), p = parts[i].slice(0, m.length);
							return m == p;
						});
						if(filtered && filtered.length) {
							val = $kit.array.indexOf(this.languagePack[language].months, filtered[0]) + 1;
						}
						break;
					case 'M':
						filtered = $kit.array.filter(this.languagePack[language].monthsShort, function(o, index, ary) {
							var m = ary.slice(0, parts[i].length), p = parts[i].slice(0, m.length);
							return m == p;
						});
						if(filtered && filtered.length) {
							val = $kit.array.indexOf(this.languagePack[language].monthsShort, filtered[0]) + 1;
						}
						break;
				}
				switch(format.parts[i]) {
					case 'dd':
					case 'd':
						date.setDate(val);
						break;
					case 'mm':
					case 'm':
					case 'MM':
					case 'M':
						date.setMonth(val - 1);
						break;
					case 'yy':
						date.setFullYear(2000 + val);
						break;
					case 'yyyy':
						date.setFullYear(val);
						break;
				}
			}
		}
		return date;
	},
	moveMonth : function(date, dir) {
		if(!dir)
			return date;
		var new_date = new Date(date.valueOf()), day = new_date.getDate(), month = new_date.getMonth(), mag = Math.abs(dir), new_month, test;
		dir = dir > 0 ? 1 : -1;
		if(mag == 1) {
			test = dir == -1
			// If going back one month, make sure month is not current month
			// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
			? function() {
				return new_date.getMonth() == month;
			}
			// If going forward one month, make sure month is as expected
			// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
			: function() {
				return new_date.getMonth() != new_month;
			};
			new_month = month + dir;
			new_date.setMonth(new_month);
			// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
			if(new_month < 0 || new_month > 11)
				new_month = (new_month + 12) % 12;
		} else {
			// For magnitudes >1, move one month at a time...
			for(var i = 0; i < mag; i++)
			// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
			new_date = this.moveMonth(new_date, dir);
			// ...then reset the day, keeping it in the new month
			new_month = new_date.getMonth();
			new_date.setDate(day);
			test = function() {
				return new_month != new_date.getMonth();
			};
		}
		// Common date-resetting loop -- if date is beyond end of month, make it
		// end of month
		while(test()) {
			new_date.setDate(--day);
			new_date.setMonth(new_month);
		}
		return new_date;
	},
	moveYear : function(date, dir) {
		return this.moveMonth(date, dir * 12);
	},
	formatDate : function(date, format, language) {
		var me = this;
		var val = {
			d : date.getDate(),
			m : date.getMonth() + 1,
			M : me.languagePack[language].monthsShort[date.getMonth()],
			MM : me.languagePack[language].months[date.getMonth()],
			yy : date.getFullYear().toString().substring(2),
			yyyy : date.getFullYear()
		};
		val.dd = (val.d < 10 ? '0' : '') + val.d;
		val.mm = (val.m < 10 ? '0' : '') + val.m;
		var date = [];
		$kit.each(format.date, function(o) {
			if(val[o]) {
				date.push(val[o]);
			} else {
				date.push(o);
			}
		});
		return date.join('');
	},
	/**
	 * datetool end
	 */
	dateNow : function() {
		var d = new Date();
		d.setMinutes(0);
		d.setSeconds(0);
		d.setHours(0);
		d.setMilliseconds(0);
		return d;
	},
	/**
	 * 增加天数
	 */
	addDays : function(d, days) {
		d.setDate(d.getDate() + days);
	}
};
$kit.date = new $Kit.Date();
