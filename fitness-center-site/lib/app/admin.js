module.exports = function(app) {
	this.app = app;

	app.get('/admin', function(page, model, params, next) {
		model.set("_session.admin", "true");
		page.render('admin');
	})
}