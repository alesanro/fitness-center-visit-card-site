var app = require('derby').createApp(module)
.use(require('derby-ui-boot'))
.use(require('../../ui'));

var util = require('util');

// ROUTES //
var admin = require('./admin.js')(app);

// Derby routes are rendered on the client and the server
app.get('/', function(page, model, params, next) {
	model.set("_session.admin", "false");
    page.render('home');   
    
});

app.get('/news', function(page, model, params, next){
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
			model.set("_page.discounts.list", discounts);
			model.set("_page.discounts.index", discounts.length - 1);
			model.set("_page.discounts.currentDiscount", discounts[model.get("_page.discounts.index")]);
		});

		page.render('news');
	});
});

app.get('/profile', function(page, model, params, next){
	model.set("_session.admin", "false");
    page.render('profile');
});

app.get('/trainings', function(page, model, params, next){
	model.set("_session.admin", "false");
    page.render('trainings');
});


exports.previousDiscount = function() {
	updateDiscountIndex(this.model, -1);
}

exports.nextDiscount = function() {
	updateDiscountIndex(this.model, 1);
}

function updateDiscountIndex(model, value) {
	var discounts = model.at("_page.discounts");
	var index = discounts.get("index") + value;
	var allDiscounts = discounts.get("list");
	if (index == allDiscounts.length) {
		index = 0;
	} else if (index < 0) {
		index = allDiscounts.length - 1;
	}
	discounts.set("index", index);
	discounts.set("currentDiscount", allDiscounts[index]);
}