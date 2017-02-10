var env 		= require(__dirname+'/env'),
    config 		= require(__dirname+'/config/'+ env.name),
    express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    jwt    		= require('jsonwebtoken'),
    apiRoutes 	= express.Router(),
    redis = require('redis'),
    redis_cli = redis.createClient(config.redis),
    log = require('./app/middleware/logger'),
    errorhandler = require('./app/middleware/errorHandler');

var userService = require(__dirname+'/app/service/userservice');



var port = process.env.PORT || config.port || 8088;
app.set('superSecret', config.secret);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan('dev'));


app.use(log.log);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    };
    //next();
});


app.use('/api', apiRoutes);

app.get('/', function(req, res) {
    res.send('API is up and running!! at http://localhost:' + port + '/api');
});


app.route('/api/user').post(userService.addUser);
app.route('/api/user').put(userService.updateUser);
app.route('/api/user/:id').get(userService.getUser);
app.route('/api/user/:id').delete(userService.deleteUser);
app.route('/api/users').get(userService.listUsers);

app.use(errorhandler.notFound);
app.use(errorhandler.error);
app.use(errorhandler.unAuthorised);

// start the server
app.listen(port);
console.log('API server is up and running');

