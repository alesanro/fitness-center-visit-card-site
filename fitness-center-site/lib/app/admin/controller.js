var controller = {
	mainAdmin: function(page, model, params, next) {
		model.set("_session.admin", "true");
		page.render('admin');
	},

};

module.exports = controller;