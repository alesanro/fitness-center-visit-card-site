var controller = require('./controller');

module.exports = function(app) {
	app.get('/admin', controller.mainAdmin);
	
};