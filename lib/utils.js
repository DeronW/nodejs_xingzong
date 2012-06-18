
var fs = require('fs');
var nowjs = require('./nowjs');
var mongodb = require('./mongodb');
var Log = require('log');
var log = new Log('debug');

// check does has such prototype
var hasEmpty = exports.hasEmpty = function(object, prototypeN) {
    for(var i = 1; i < arguments.length; i++) {
        if(!object[arguments[i]]) {
            return {
                error : arguments[i] + ' is empty',
                success : false
            }
        }
    }
    return {
        success : true
    }
}

// validation
var validation = function(){ }
validation.isNotEmpty = function(data){
    if(data){
        return {success: true}
    } else {
        return {success: false}
    }
}
exports['validation'] = validation;

// get param from query
var query = exports['query'] = function(obj, name, defaultValue){
    if(obj && obj.hasOwnProperty(name)){
        return obj[name];
    } else {
        return defaultValue;
    }
}

/*
 * notify watcher
 */

var messageNotify = exports['messageNotify'] = function messageNotify(msg, next) {
    var deviceid = msg.deviceid,
        timestamp = msg.timestamp,
        latitude = msg.latitude,
        longitude = msg.longitude,
        elevation = msg.elevation,
        accuray = msg.accuray,
        speed = msg.speed;

    if(deviceid && timestamp && latitude && longitude && elevation && accuray && speed){
        fs.createWriteStream(__dirname + '/../track/' + msg.deviceid + '.csv', {
            flags: 'a',
            encoding: 'utf8',
            mode: 448
        }).write([timestamp, longitude, latitude, elevation, accuray, speed].join(',') + '\n');
        mongodb.updateMessage(msg, next);
    } else {
        next({err:'ivalid data'});
    }
}

var print = exports['print'] = function(msg){
    console.log('****************************************************************');
    console.log(Date(Date.now()));
    console.log(msg);
    console.log('****************************************************************');
}

