var config = {
  filename: __filename
, styles: '../styles/ui'
, scripts: {
    connectionAlert: require('./connectionAlert'),
    commonHeader: require('./commonHeader'),
  }
};

module.exports = function(app, options) {
  app.createLibrary(config, options);
};