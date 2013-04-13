/**
 *                                                                                                 
              ,--,                                                                                 
            ,--.'|         ,---,                           ,----,   ,---.        ,---,             
 ,--,  ,--, |  |,      ,-+-. /  |  ,----._,.             .'   .`|  '   ,'\   ,-+-. /  |  ,----._,. 
 |'. \/ .`| `--'_     ,--.'|'   | /   /  ' /          .'   .'  .' /   /   | ,--.'|'   | /   /  ' / 
 '  \/  / ; ,' ,'|   |   |  ,"' ||   :     |        ,---, '   ./ .   ; ,. :|   |  ,"' ||   :     | 
  \  \.' /  '  | |   |   | /  | ||   | .\  .        ;   | .'  /  '   | |: :|   | /  | ||   | .\  . 
   \  ;  ;  |  | :   |   | |  | |.   ; ';  |        `---' /  ;--,'   | .; :|   | |  | |.   ; ';  | 
  / \  \  \ '  : |__ |   | |  |/ '   .   . |          /  /  / .`||   :    ||   | |  |/ '   .   . | 
./__;   ;  \|  | '.'||   | |--'   `---`-'| |        ./__;     .'  \   \  / |   | |--'   `---`-'| | 
|   :/\  \ ;;  :    ;|   |/       .'__/\_: |        ;   |  .'      `----'  |   |/       .'__/\_: | 
`---'  `--` |  ,   / '---'        |   :    :        `---'                  '---'        |   :    : 
             ---`-'                \   \  /                                              \   \  /  
                                    `--`-'                                                `--`-'   
 *
 **/

var express = require('express');
var nowjs = require('./lib/nowjs');
var routes = require('./routes');

var server = module.exports = express.createServer();

// Configuration

server.configure(function() {
    server.set('views', __dirname + '/views');
    server.set('view engine', 'jade');
    
    server.set('view options', {
        layout: false
    });
    server.set('environment', 'production');
    server.use(express.cookieParser());
    server.use(express.session({
        secret: 'xz'
    }));
    server.use(express.logger({ format: ':method :url' }));
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use('/public', express.static(__dirname + '/public'));
    server.use(server.router);
});

server.configure('development', function() {
    server.use(express.errorHandler({
        dumpExceptions : true,
        showStack : true
    }));
});

server.configure('production', function() {
    server.use(express.errorHandler());
});

// user now js
nowjs.listen(server);

// Routes
server.get('/', routes.index);
server.get('/follow', routes.follow);
server.get('/track', routes.track);
server.get('/track/record', routes.trackRecord);
server.post('/accounts/create', routes.createUser);
server.get('/accounts/login', routes.loginForm);
server.post('/accounts/login', routes.login);
server.get('/accounts/logout', routes.logout);
server.post('/report', routes.report);
server.post('/bind', routes.bind);
server.post('/unbind', routes.unbind);
server.get('*', routes.req404)
server.post('*', routes.req404)
server.put('*', routes.req404)
server.del('*', routes.req404)

// listen on HTTP
server.listen(3001, function() {
    console.log("Express server listening on port %d in %s mode", server.address().port, server.settings.env);
});

// listen on socket
/*
server.listen('/tmp/express.sock', function(){
    console.log('Express server listening on socket')
})
*/

