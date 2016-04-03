var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    flash = require('connect-flash'),
    _ = require('underscore'),
    UserAppStrategy = require('passport-userapp').Strategy;

var bodyParser = require('body-parser');


// Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    var user = _.find(users, function (user) {
        return user.username == username;
    });
    if (user === undefined) {
        done(new Error('No user with username "' + username + '" found.'));
    } else {
        done(null, user);
    }
});

// Use the UserAppStrategy within Passport
passport.use(
    new UserAppStrategy({
        appId: '55a84c513c0a3' 
    },
    function (userprofile, done) {
        process.nextTick(function () {
            var exists = _.any(users, function (user) {
                return user.id == userprofile.id;
            });
            
            if (!exists) {
                users.push(userprofile);
            }

            return done(null, userprofile);
        });
    }
));

var app = express();

app.use(bodyParser.json());

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);


// Configure Express
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'secret' }));
    app.use(flash());
    
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


// Start the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
