var crypto = require('crypto');
var Log = require('log');
var mongodb = require('../lib/mongodb');
var utils = require('../lib/utils.js');

var log = new Log('debug');
var messageNotify = utils.messageNotify;
var print = utils.print;
var authenticate = mongodb.authenticate;

exports['index'] = function(req, res) {
    var user = req.session.user;
    // user = {username:'u'}
	res.render('index', {
        locals: {
            user: user
        }
	});
}
exports['loginForm'] = function(req, res) {
	res.render('login', {
		loginError: ''
	});
}
exports['login'] = function(req, res) {
	authenticate(req.body['email'], req.body['password'], function(err, user) {
		if (err) {
			res.render('login', {
				loginError: err.err
			});
		} else {
			req.session.user = user;
			res.cookie('userid', user._id, {
                path: '/',
				maxAge: 1000 * 3600 * 12
			});
			res.redirect('/follow');
		}
	});
}
exports['logout'] = function(req, res) {
	res.send('ok');
	req.session.user = null;
}
exports['follow'] = function(req, res) {
	var user = req.session.user;
	if (user) {
		res.render('follow', {});
	} else {
		res.send('403', 403);
	}
}
exports['createUser'] = function(req, res) {
	mongodb.createUser({
		email: req.body['email'],
		nickname: req.body['nickname'],
		password: req.body['password']
	},
	function(err) {
		res.send(err ? err.err: '欢迎加入');
	});
}
exports['bind'] = function(req, res) {
	mongodb.bindUser({
		email: req.body['email'],
		password: req.body['password'],
		deviceid: req.body['deviceid']
	},
	function(err) {
		res.send(err ? err.err: '绑定成功');
	});
}
exports['report'] = function(req, res) {
	res.send('ok')
	// message example: deviceid,timestamp,latitude,longitude,elevation,accuray,speed
	var msg = req.param('message', '').split(',');
	if (msg && msg.length == 7) {
		messageNotify({
			deviceid: msg[0],
			timestamp: msg[1],
			longitude: msg[2],
			latitude: msg[3],
			elevation: msg[4],
			accuray: msg[5],
			speed: msg[6]
		},
		function(err) {
			// res.send(err ? err.err : 'ok');
		});
	}
}
exports['req404'] = function(req, res) {
	res.send('404', 404);
}

