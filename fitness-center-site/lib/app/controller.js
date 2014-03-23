var controller = {
	home: function(page, model, params, next) {
		model.set("_session.admin", "false");
	    page.render('home');   
	},

	news: function(page, model, params, next) {
		model.set("_session.admin", "false");
		var newsQuery = model.query("news", {});
		newsQuery.fetch(function(error) {
			if (error) {
				return next(error);
			}
			var news = newsQuery.get();
			model.set("_page.news", news);

			var discountsQuery = model.query("discounts", {});
			discountsQuery.fetch(function(error) {
				if (error) {
					return next(error);
				}

				var discounts = discountsQuery.get();
				var discountsScope = model.at('_page.discounts');
				discountsScope.set("list", discounts);
				discountsScope.set("index", discounts.length - 1);
				discountsScope.set("currentDiscount", discounts[discountsScope.get("index")]);
			});
			
			page.render('news');
		});
	},

	profile: function(page, model, params, next) {
		model.set("_session.admin", "false");
	    page.render('profile');
	},

	trainings: function(page, model, params, next) {
		model.set("_session.admin", "false");
    	page.render('trainings');
	}
};

module.exports = controller;