var crypto = require('crypto');
var utils = require('./utils');
var print = utils.print;
var Log = require('log');
var log = new Log('debug');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/xingzong');

var md5 = exports['md5'] = function(s) {
	return crypto.createHash('md5').update(s).digest('hex');
}

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	nickname: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
	default:
		true
	},
	joinedDate: {
		type: Date,
	default:
		Date.now()
	},
});
UserSchema.methods.checkPassword = function(password) {
	return this.password === md5(password);
}

var MessageSchema = new Schema({
	deviceid: {
		type: String,
		unique: true,
		required: true
	},
	timestamp: {
		type: Number,
		required: true
	},
	coordinate: {
		type: [Number, Number],
		index: '2d',
		required: true
	},
	elevation: {
		type: Number,
		required: true
	},
	accuray: {
		type: Number,
	default:
		50
	},
	speed: {
		type: Number,
		required: true
	},
	watcher: [ObjectId]
});

var SessionSchema = new Schema({
	userid: {
		type: ObjectId,
		required: true
	}
});

var User2ClientSchema = new Schema({
	userid: {
		type: ObjectId,
		unique: true,
		required: true
	},
	clientid: {
		type: String,
		unique: true,
		required: true
	}
});

var MessageModel = mongoose.model('message', MessageSchema);
var UserModel = mongoose.model('user', UserSchema);
var SessionModel = mongoose.model('session', SessionSchema);
var User2ClientModel = mongoose.model('user2client', User2ClientSchema);

var authenticate = exports['authenticate'] = function(email, password, next) {
	UserModel.findOne({
		'email': email
	},
	function(err, user) {
		if (user) {
			if (user.checkPassword(password)) {
				next(null, user);
			} else {
				next({
					err: '密码错误'
				});
			}
		} else {
			next({
				err: '用户名错误'
			});
		}
	});
}

var createUser = exports['createUser'] = function(data, next) {
	var user = new UserModel();
	user.email = data.email;
	user.nickname = data.nickname;
	user.password = md5(data.password);
	user.save(function(err) {
		if (err) {
			next(err);
		} else {
			next();
		}
	});
}

var bindUser = exports['bindUser'] = function(data, next) {
	var deviceid = data.deviceid,
	email = data.email,
	password = data.password,
	timestamp = data.timestamp || Date.now()
	longitude = data.longitude || 0,
	latitude = data.latitude || 0,
	elevation = data.elevation || 0,
	accuray = data.elevation || 0,
	speed = data.speed || 0;

	UserModel.findOne({
		'email': email
	},
	function(err, user) {
		if (user) {
			if (user.checkPassword(password)) {
				MessageModel.findOne({
					'deviceid': deviceid
				},
				function(err, message) {
					if (message) {
						message.watcher.push(user._id);
						message.save(function(err) {
							if (err) {
								next(err);
							} else {
								next();
							}
						});
					} else {
						createMessage({
							deviceid: deviceid,
							timestamp: Date.now(),
							longitude: longitude,
							latitude: latitude,
							elevation: elevation,
							accuray: accuray,
							speed: speed,
							watcher: user._id
						},
						next);
					}
				});

			} else {
				next({
					err: '用户名或密码错误'
				});
			}
		} else {
			next({
				err: '用户不存在'
			});
		}
	});
}

var createMessage = exports['createMessage'] = function(msg, next) {
	MessageModel.findOne({
		'deviceid': msg.deviceid
	},
	function(err, doc) {
		if (doc) {
			next('error');
		} else {
			var message = new MessageModel({
				deviceid: msg.deviceid,
				timestamp: msg.timestamp,
				coordinate: [msg.longitude, msg.latitude],
				elevation: msg.elevation,
				accuray: msg.accuray,
				speed: msg.speed,
				watcher: [msg.watcher]
			});
			message.save(function(err) {
				next();
			});
		}
	});
}

var updateMessage = exports['updateMessage'] = function(msg, next) {
	var deviceid = msg.deviceid,
	timestamp = msg.timestamp,
	longitude = msg.longitude,
	latitude = msg.latitude,
	elevation = msg.elevation,
	accuray = msg.accuray,
	speed = msg.speed;

	MessageModel.findOne({
		'deviceid': deviceid
	},
	function(err, message) {
		if (message) {
			message.timestamp = timestamp;
			message.coordinate = [longitude, latitude];
			message.elevation = elevation;
			message.accuray = accuray;
			message.speed = speed;
			message.save(function(err) {
				if (err) {
					next(err);
				} else {
					next();
				}
			});
		} else {
			next({
				err: 'unregisted deviceid'
			});
		}
	});
}

var getLastPosition = exports['getLastPosition'] = function(userId, next){
    MessageModel.find({watcher: userId}, function(err, msgs){
        if(next){
            next(msgs);
        }
    });
}

var relateUser2Client = exports['relateUser2Client'] = function(userId, clientId, next) {
	User2ClientModel.findOne({userid: userId}, function(err, doc) {
		if (doc) {
			doc.clientid = clientId;
            doc.save(function(err, doc){
                if(next){
                    next();
                }
            });
		} else {
			var user2client = new User2ClientModel();
			user2client._id = userId;
			user2client.userid = userId;
            user2client.clientid = clientId;
            user2client.save(function(err){
                if(err){
                    next(err);
                } else {
                    next();
                }
            });
		}
	});
}

var findWatchers = exports['findWatchers'] = function(deviceid, next){
    MessageModel.findOne({deviceid: deviceid}, function(err, msg){
        if(next){
            next(msg.watcher);
        }
    });
}

var findNowjsClientId = exports['findNowjsClientId'] = function(userId, next){
    User2ClientModel.findOne({userid: userId}, function(err, doc){
        if(doc){
            next(doc.clientid);
        }    
    });
}
