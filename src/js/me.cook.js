/*
 * CookMe 1.0.0 (https://github.com/QuatreCentQuatre/cookMe/)
 * make cookie usage easy
 *
 * Licence : GLP v2
 *
 * Dependencies :
 *  - jQuery (http://jquery.com/)
 *
 * Methods :
 *  - Constructor :
 *  	- __construct : inital method
 *  	- __dependencies : check any depency support and send some errors
 *
 * 	- Public :
 * 		-
 *
 * 	- Private :
 *		-
 *
 * Updates Needed :
 *
 * */

(function($, window, document, undefined){
	'use strict';

	var CookMe = function(){
		this.__construct();
	};
	var proto = CookMe.prototype;

    /* -------- DEFAULTS OPTIONS ------- */
    proto.__name     = "CookMe";
    proto.__version  = 1.00;

    proto.__defaults = {};

	//--------Methods--------//
    proto.__construct = function() {
        if (!this.__dependencies()) {return this;}
        return this;
    };

    proto.__dependencies = function() {
        var isOk = true;

        if (!window.$) {
            console.warn(proto.__name + " :: " + "required jquery (http://jquery.com/)");
            isOk = false;
        }

        return isOk;
    };

    proto.setOptions = function(options) {
        this.options = $.extend({}, this.__defaults, options);
        return this;
    };

    proto.getOptions = function() {
        return this.options;
    };

    proto.get = function(c_name) {
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0; i < cookies.length; i++) {
            var item = cookies[i].split("=");
            if (decodeURIComponent(item[0]) === c_name) {
                var val = decodeURIComponent(item[1]);
                if (typeof val === "object") {
                    val = JSON.parse(val);
                }
                return val;
            }
        }
        return false;
    };

	proto.set = function(c_name, c_val, expire_day, path, domain, secure) {
		var value = {};
		if (typeof c_val === "object") {
			value.value = {};
			$.each(c_val, function(index, val){
				value.value[index] = val;
			});
		} else {
			value.value = c_val;
		}
		value.key = c_name;

		if (expire_day) {
			var date = new Date();
			if (expire_day == -1) {
				expire_day = 365;
			}
			date.setDate(date.getDate() + expire_day);
			value.expire = date;
		}

		if (!path) {
			path = "/";
		}

		var cookie = [
			encodeURIComponent(c_name), '=', encodeURIComponent(JSON.stringify(c_val)),
			value.expire ? '; expires=' + value.expire.toUTCString() : '',
			'; path=' + path,
			domain  ? '; domain=' + domain : '',
			secure  ? '; secure' : ''
		].join("");
		document.cookie = cookie;
		return this;
	};

	proto.remove = function(c_name, path, domain, secure) {
		if (!path) {
			path = "/";
		}
		var cookie = [
			encodeURIComponent(c_name), '=', null,
			'; expires=-1',
			'; path=' + path,
			domain  ? '; domain=' + domain : '',
			secure  ? '; secure' : ''
		].join("");
		document.cookie = cookie;
		return this;
	};

	proto.has = function(c_name) {
		return this.get(c_name) ? true : false;
	};

    proto.toString = function() {
        return this.__name;
    };

    var privateMethods = {
    };

    if(!window.Me) {
        window.Me = {};
    }

    Me.cook = new CookMe();
}(jQuery, window, document));