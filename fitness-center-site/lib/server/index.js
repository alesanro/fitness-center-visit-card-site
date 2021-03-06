var express = require('express');
var derby = require('derby');
var racerBrowserChannel = require('racer-browserchannel');
var liveDbMongo = require('livedb-mongo');
var MongoStore = require('connect-mongo')(express);
var app = require('../app');
var error = require('./error');
var util = require('util');

var expressApp = module.exports = express();

// Get Redis configuration
if (process.env.REDIS_HOST) {
  var redis = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  redis.auth(process.env.REDIS_PASSWORD);
} else if (process.env.REDISCLOUD_URL) {
  var redisUrl = require('url').parse(process.env.REDISCLOUD_URL);
  var redis = require('redis').createClient(redisUrl.port, redisUrl.hostname);
  redis.auth(redisUrl.auth.split(":")[1]);
} else {
  var redis = require('redis').createClient();
}
redis.select(process.env.REDIS_DB || 1);
// Get Mongo configuration 
var mongoUrl = process.env.MONGO_URL || process.env.MONGOHQ_URL ||
  'mongo://alex_rudyak:alex_rudyak@oceanic.mongohq.com:10047/fitness-center-db';

// The store creates models and syncs data
var store = derby.createStore({
    db: {
        db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true}),
        redis: redis
    }
});

function createUserId(req, res, next) {
  var model = req.getModel();
  var userId = req.session.userId || (req.session.userId = model.id());
  model.set('_session.userId', userId);
  next();
}

function loadMenus(req, res, next){
  var model = req.getModel();
  var isNavigationExists = model.get('_session.navigationItems');
  if (!isNavigationExists){
    var navigationQuery = model.query('navigations', {position: 'top-horizontal'});
    navigationQuery.fetch(function(error){
      var result = navigationQuery.get()[0];
      model.set('_session.navigationItems', result.menus);

      var adminNavigationQuery = model.query('navigations', {position: 'left-vertical-admin'});
      adminNavigationQuery.fetch(function(error) {
        var result = adminNavigationQuery.get()[0];
        model.set('_session.adminNavigationItems', result.menus);
        next();
      });
    })
  } else {
   next();
  }
};

expressApp
  .use(express.favicon())
  // Gzip dynamically
  .use(express.compress())
  // Respond to requests for application script bundles
  .use(app.scripts(store))
  // Serve static files from the public directory
  // .use(express.static(__dirname + '/../../public'))

  // Add browserchannel client-side scripts to model bundles created by store,
  // and return middleware for responding to remote client messages
  .use(racerBrowserChannel(store))
  // Add req.getModel() method
  .use(store.modelMiddleware())

  // Parse form data
//   .use(express.bodyParser())
//   .use(express.methodOverride())

  // Session middleware
  .use(express.cookieParser())
  .use(express.session({
    secret: process.env.SESSION_SECRET || 'YOUR SECRET HERE'
  , store: new MongoStore({url: mongoUrl, safe: true})
  }))
  .use(createUserId)
  .use(loadMenus)

  // Create an express middleware from the app's routes
  .use(app.router())
  .use(expressApp.router)
  .use(error())


// SERVER-SIDE ROUTES //

expressApp.all('*', function(req, res, next) {
  next('404: ' + req.url);
});
