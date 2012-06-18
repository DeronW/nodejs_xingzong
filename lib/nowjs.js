var utils = require('./utils');
var nowjs = require('now');
var mongodb = require('./mongodb.js');

var print = utils.print;

exports['listen'] = function(app) {
	var everyone = nowjs.initialize(app);
	everyone.now.relateUser2Client = function(userId) {
		if (userId) {
			var clientId = this.user.clientId;
			mongodb.relateUser2Client(userId, userId);
		}
	};
	everyone.now.getLastPosition = function(userId, next) {
		if (userId) {
			mongodb.getLastPosition(userId, function(points) {
				next(Position(points));
			});
		}
	}
	everyone.now.log = function(s) {}
}

nowjs.on('connect', function() {
	// console.log('nowjs connected');
});

nowjs.on('disconnect', function() {
	//  console.log(this.user.clientId + ' disconnected');
});

exports['notifyWatcher'] = function(clientId, position) {
	nowjs.getClient(clientId, function() {
		if (this.now) {
			this.now.updatePosition(position);
		} else {}
	});
}

function Position(ps) {
	var result = [];
	ps.forEach(function(p) {
		if (p) {
			result.push({
                deviceid: p.deviceid,
				timestamp: p.timestamp,
				longitude: p.longitude,
				latitude: p.latitude,
				elevation: p.elevation,
				speed: p.speed,
				accuray: p.accuray
			});
		}
    });
	return result;
}

