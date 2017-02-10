var config = {
	host: 'http://localhost:8088',
	port: 8088,
	url: '',
	secret:'',
	database:{
		host: 'localhost',
		port: 28015,
		db: 'api'
	},
	redis: {
		url:'redis://localhost:6379'
	},
};

module.exports = config;