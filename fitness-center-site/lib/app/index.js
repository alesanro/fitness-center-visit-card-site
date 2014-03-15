var app = require('derby').createApp(module)
.use(require('derby-ui-boot'))
.use(require('../../ui'));

var util = require('util');


// ROUTES //

// Derby routes are rendered on the client and the server
app.get('/', function(page, model, params, next) {
    page.render('home');   
    
});

app.get('/news', function(page, model, params, next){
    page.render('news');
});

app.get('/profile', function(page, model, params, next){
    page.render('profile');
});

app.get('/trainings', function(page, model, params, next){
    page.render('trainings');
});