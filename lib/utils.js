var fs = require('fs');
var nowjs = require('./nowjs');
var mongodb = require('./mongodb');
var Log = require('log');
var log = new Log('debug');

// check does has such prototype
var hasEmpty = exports.hasEmpty = function(object, prototypeN) {
	for (var i = 1; i < arguments.length; i++) {
		if (!object[arguments[i]]) {
			return {
				error: arguments[i] + ' is empty',
				success: false
			}
		}
	}
	return {
		success: true
	}
}

// validation
var validation = function() {}
validation.isNotEmpty = function(data) {
	if (data) {
		return {
			success: true
		}
	} else {
		return {
			success: false
		}
	}
}
exports['validation'] = validation;

// get param from query
var query = exports['query'] = function(obj, name, defaultValue) {
	if (obj && obj.hasOwnProperty(name)) {
		return obj[name];
	} else {
		return defaultValue;
	}
}

/*
 * notify watcher
 */

var messageNotify = exports['messageNotify'] = function(msg, next) {
	var deviceid = msg.deviceid,
	timestamp = msg.timestamp,
	latitude = msg.latitude,
	longitude = msg.longitude,
	elevation = msg.elevation,
	accuray = msg.accuray,
	speed = msg.speed;

	if (deviceid && timestamp && latitude && longitude && elevation && accuray && speed) {
		// record this point
		fs.createWriteStream(__dirname + '/../track/' + msg.deviceid + '-' + today() + '.csv', {
			flags: 'a',
			encoding: 'utf8',
			mode: 448
		}).write([timestamp, longitude, latitude, elevation, accuray, speed].join(',') + '\n');
		// update database point
		mongodb.updateMessage(msg, next);
		// notify watcher
		mongodb.findWatchers(deviceid, function(watchers) {
			if (watchers) {
				watchers.forEach(function(watcher) {
					mongodb.findNowjsClientId(watcher, function(clientId) {
						nowjs.notifyWatcher(clientId, msg);
					});
				});
			}
		});
	} else {
		next({
			err: 'ivalid data'
		});
	}
}

var today = exports['getFullDate'] = function() {
	var d = new Date();
	return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
}

var type = exports['type'] = function(obj){
    return obj == null ? String(obj) : class2type[ toString.call(obj) ] || "object";
}

var isFunction = exports['isFunction'] = function(obj){
    return type(obj) == "function";
}

var class2type = exports['class2type'] = {}
"Boolean Number String Function Array Date RegExp Object".split(" ").forEach(function(name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// extend function is copyed & modified from jQuery
var extend = exports['extend'] = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if ( typeof target !== "object" && ! isFunction(target) ) {
        target = {};
    }
    if ( length === i ) {
        target = this;
        --i;
    }
    for ( ; i < length; i++ ) {
        if ( (options = arguments[ i ]) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];
                if ( target === copy ) {
                    continue;
                }
                if ( deep && copy && (copyIsArray = Array.isArray(copy)) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src ? src : {};
                    }
                    target[ name ] = extend( deep, clone, copy );
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }
    return target;
};

var print = exports['print'] = function(msg) {
	console.log('****************************************************************');
	console.log(Date(Date.now()));
	console.log(msg);
	console.log('****************************************************************');
}

