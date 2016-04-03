'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'UserApp'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {templateUrl: 'partials/topics.html', controller: 'HomeCtrl'})
  .when('/ask', {templateUrl: 'partials/addquestion.html', controller: 'HomeCtrl'})
  .when('/answer/:id', {templateUrl: 'partials/addanswer.html', controller: 'TopicController'})
  .when('/topics/:id', {templateUrl: 'partials/showtopic.html', controller: 'TopicController'})
  .when('/topics', {templateUrl: 'partials/topics.html', controller: 'HomeCtrl'})
  .when('/login', {templateUrl: 'partials/login.html', login: true})
  .when('/signup', {templateUrl: 'partials/signup.html', public: true})

  .otherwise({redirectTo: '/'});
}])

// key for UserAPP library
.run(function(user) {
  user.init({ appId: '55a84c513c0a3' });
});
