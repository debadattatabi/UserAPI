// file: util/thinky.js
var env = require(__dirname+'/../../env'),
	config = require(__dirname+'/../../config/'+ env.name),
	redis = require('redis'),
	redis_cli = redis.createClient(config.redis); 

exports.getIdPath = function(id){
	return id.split('-').join('/');
};

exports.saveToken = function(token,value){
	return redis_cli.set(token,value);
};

exports.deleteToken = function(token){
	if(redis_cli.exists(token)){
		return redis_cli.del(token);
	}else{
		return false;
	}
};

