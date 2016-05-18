/*	Element.prototype.defaultPX	*/
;(function() {
	//parseFloat(getComputedStyle(document.body, null).fontSize.replace(/[^\d\.]/g, ''))
	function defaultPX() {
		var args = Array.prototype.slice.call(arguments, 0),
			retObj = false, ele = [], multiplier;
		for (var x in args) {
			switch (typeof args[x]) {
				case 'boolean':
					if (!retObj) retObj = args[x];
					break;
				case 'number':
					if (void 0 == multiplier) multiplier = args[x];
					break;
				case 'object':
					if (args[x]['element'] || args[x]['multiplier'] || args[x]['asObject']) {
						if (args[x]['element']) ele.push(args[x]['element']);
						if (args[x]['multiplier']) multiplier = parseFloat(args[x]['multiplier']);
						if (args[x]['asObject']) retObj = args[x]['asObject'];
					}
					else {
						if (args[x] instanceof Array) ele = ele.concat(args[x]);
						else if (args[x] instanceof HTMLCollection) ele = ele.concat(Array.prototype.slice.call(args[x], 0));
						else if (args[x] instanceof Element) ele.push(args[x]);
					}
					break;
				case 'string':
					
					break;
			}
		}
		
		if (!ele.length) ele.push(document.body);
		
		if (ele.length == 1) {
			var s = getComputedFontSizePX(ele[0]);
			if (void 0 != multiplier && multiplier != 0) s *= multiplier;
			if (retObj) {
				retObj = {};
				retObj[getElementIDNameTag(ele[0])] = s;
				return retObj;
			}
			return s;
		}
		else {
			var ret = {};
			for (var i in ele) {
				var e = ele[i];
				var s = getComputedFontSizePX(e);
				if (void 0 != multiplier && multiplier != 0) s *= multiplier;
				var k = getElementIDNameTag(e) + '['+i+']';
				ret[k] = s;
			}
			return retObj ? ret : objectToArray(ret);
		}
		return void 0;
	}
	
	function getComputedFontSizeString(ele) { return getComputedStyle(ele, null).getPropertyValue('font-size'); }
	
	function getComputedFontSizePX(ele) {
		var fss = getComputedFontSizeString(ele);
		if (/^[-+]?[0-9]*\.?[0-9]+px$/.test(fss) || !fss.match(/[^\d.]{1,}/g)) return parseFloat(fss);
		var par = ele.parentNode;
		while (par) {
			var parFss = getComputedFontSizeString(par);
			if (/^[-+]?[0-9]*\.?[0-9]+px$/.test(parFss) || !parFss.match(/[^\d.]{1,}/g)) {
				if (/^\d+em$/.test(fss)) return parseFloat(parFss) * parseFloat(fss);
				if (/^\d+%$/.test(fss)) return parseFloat(parFss) * (parseFloat(fss)/100);
				return parseFloat(parFss);
			}
			par = ele.parentNode;
		}
		return parseFloat(getComputedFontSizeString(document.body));
	}
	
	function getElementIDNameTag(a) {
		var id = a.getAttribute('id'),
			name = a.getAttribute('name'),
			tag = a.tagName,
			classes = a.getAttribute('class'),
			ret = [ tag ];
		if (void 0 != id) ret.push('#' + id);
		if (void 0 != name) ret.push('[name=' + id + ']');
		if (void 0 != classes) {
			classes = classes.replace(/ {2,}/g, ' ').split(/ /g)
			if (classes.length) ret.push('.' + classes.join('.'));
		}
		return ret.join('');
	};
	
	function objectToArray(obj) { return Object.keys(obj).map(key => obj[key]); }
	
	//	add as window variable
	window.hasOwnProperty("defaultPX")||(window.defaultPX=defaultPX);
	
	//	add as method of a Element|HTMLCollection|Array ( exp: ele.defaultPX(); )
	var name = 'defaultPX';
	function method() {
		var args = Array.prototype.slice.call(arguments, 0);
		return defaultPX.apply(this, args.concat([this]))
	}
	Object['defineProperty'] && !Element.prototype.hasOwnProperty(name)
		? Object.defineProperty(Element.prototype, name, { value: method }) : Element.prototype[name] = method;
	Object['defineProperty'] && !HTMLCollection.prototype.hasOwnProperty(name)
		? Object.defineProperty(HTMLCollection.prototype, name, { value: method }) : HTMLCollection.prototype[name] = method;
	Object['defineProperty'] && !Array.prototype.hasOwnProperty(name)
		? Object.defineProperty(Array.prototype, name, { value: method }) : Array.prototype[name] = method;
	
	//	add as a jQuery extension
	try {
		if (window.hasOwnProperty('jQuery') && jQuery) {
			jQuery.defaultPX || (jQuery.extend({
				defaultPX: function() {
					var args = Array.prototype.slice.call(arguments, 0),
						nArgs = [];
					for (var x in args) {
						if (args[x] instanceof jQuery) args[x].each(function(i) { if (this instanceof Element) nArgs.push(this); });
						else if (args[x] instanceof Element) nArgs.push(args[x]);
						else if (args[x] instanceof HTMLCollection) nArgs = nArgs.concat(args[x]);
						else if (/boolean|number/.test(typeof args[x])) nArgs.push(args[x]);
					}
					return defaultPX.apply(window, nArgs);
				}
			}),
			jQuery.fn.extend({
				defaultPX: function() {
					var args = Array.prototype.slice.call(arguments, 0);
					return jQuery.defaultPX.apply(this, args.concat([jQuery(this)]))
				}
			}))
		}
	}
	catch (err) {}
})();
