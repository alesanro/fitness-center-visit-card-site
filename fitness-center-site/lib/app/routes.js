var controller = require('./controller');

module.exports = function (app) {
	app.get('/', controller.home);
	app.get('/news', controller.news);
	app.get('/profile', controller.profile);
	app.get('/trainings', controller.trainings);

};