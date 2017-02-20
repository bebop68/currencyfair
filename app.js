var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var index = require('./routes/index');
var backdoor = require('./routes/backdoor');
var parseSetup = require('./dbsetup/parse_setup');

//parse schema setup
parseSetup();

/*
	Api init
 */
var api = new ParseServer({
	databaseURI: process.env.CFMONGO || 'mongodb://localhost:27017/currencyfair', // Connection string for your MongoDB
	appId: process.env.PARSECFAPP || 'token123456',
	masterKey: process.env.PARSECFMASTER || 'secret123456', //this is not public, protect it, it's like a root pass
	serverURL: process.env.PARSECFURL || 'http://localhost:1338/parse', //public api url
	cloud: './cloud/main.js', //Cloud code include path
	appName: 'Currency Fair',
	enableAnonymousUsers: false,
	allowClientClassCreation: false, //No spam objects
	liveQuery: {
	  classNames: ['Trade','Stats','Country','Currency']
	}
});
var dashboard = new ParseDashboard({
	"apps": [
		{
			"serverURL": process.env.PARSECFURL || 'http://localhost:1338/parse',
			"appId": process.env.PARSECFAPP || 'token123456',
			"masterKey": process.env.PARSECFMASTER || 'secret123456',
			"appName": 'Currency Fair'
		}
	],
	"trustProxy": 1
});

var app = express();
var parseApp = express();
var dashboardApp = express();
parseApp.use('/parse', api);
dashboardApp.use('/',dashboard);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', index);
app.use('/backdoor/', backdoor);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var parseHttpServer = require('http').createServer(parseApp);
parseHttpServer.listen(1338);
var dashboardHttpServer = require('http').createServer(dashboardApp);
dashboardHttpServer.listen(4041);
/*
	Web Socket live query server
 */
ParseServer.createLiveQueryServer(parseHttpServer);
module.exports = app;
