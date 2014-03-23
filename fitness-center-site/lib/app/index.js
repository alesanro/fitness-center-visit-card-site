var app = require('derby').createApp(module)
.use(require('derby-ui-boot'))
.use(require('../../ui'));

// ROUTES //

// Derby routes are rendered on the client and the server
var routes = require('./routes')(app);
var admin = require('./admin/routes')(app);

// Export functions
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