'use strict';
/* Controllers */

angular.module('myApp.controllers', [])
	
// **********   MAIN FACTORY *************************

.factory('TopicFactory', function($http, $location){

	var factory = {};

	var topics = {};

	var topic = {};

	//LOAD ALL QUESTIONS ON MAIN PAGE

	factory.getTopics = function(callback){
		$http
		.get('/topics')
		.success(function(output){
			topics = output;
		})
		.finally(function(){
			callback(topics);
		})
	}

	// LOAD ONE QUESTION BY ID

	factory.getTopicById = function(tid, callback){
		$http
		.get('/getTopicById/' + tid)
		.success(function(output){
			topic = output;
		})
		.finally(function(){
			callback(topic);
		})
	}

	// ADD QUESTION 
	factory.addTopic = function(newTopic, callback){
		
		$http.post('/topics/add', newTopic);
		callback();

	}


	// ADD ANSWER

	factory.addPost = function(newPost, callback){
	
		var topic_id = newPost.topic_id;
		$http.post('/topics/post/'+topic_id, newPost)
		.success(function(data){

		callback(data);
			
		})
	
	}


	// ADD LIKE FACTORY

	factory.addLike = function(postLike, callback){

		var post_id = postLike._id;
		postLike.like += 1;

		$http.post('/post/like/'+post_id, postLike);
		callback();

	}		

	return factory;

})

// .factory('promptFactory', function( $window, $q ) {
//         // Define promise-based prompt() method.
//         function prompt( message, defaultValue ) {
//             var defer = $q.defer();
//             // The native prompt will return null or a string.
//             var response = $window.prompt( message, defaultValue );
//             if ( response === null ) {
//                 defer.reject();
//             } else {
//                 defer.resolve( response );
//             }
//             return( defer.promise );
//         }
//         return( prompt );
//     }
// )


// *************** CONTROLLERS **********************


// *************** HOME CONTROLLER ***************

.controller('HomeCtrl', ['$scope','$rootScope', 'TopicFactory', '$location', '$routeParams',
	function($scope,$rootScope, TopicFactory,  $location, $routeParams) {
	
	$scope.addQuestion = function(){
			
		if($scope.questionForm.$valid){
	     
	     	TopicFactory.addTopic($scope.newTopic, function(){
					
				$location.path('/');
				$rootScope.message = "Question successfully added";
				$scope.newTopic = {};
			})
	    }
	    else {
	      $scope.questionForm.$setPristine = false;
	      $scope.questionForm.submitted = true;

	    }
	}

   
    // .then(
    //     function( response ) {
    //         console.log( "Prompt accomplished with", response );
    //     },
    //     function() {
    //         console.log( "Prompt failed :(" )
    //     }
    // )

 	// console.log( "Testing completed." );

  	// LOAD ALL QUESTIONS

	TopicFactory.getTopics(function(data){
		 // prompt( "please enter your name" );
		$scope.topics = data;
		
	})


	// ADD QUESTION
	


}])


//*************** TOPIC CONTROLLER ***************

 .controller('TopicController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'TopicFactory',
  function($scope, $rootScope, $http, $location, $routeParams, TopicFactory){

		$rootScope.message = null;

		
	// LOAD QUESTION BY ID

	var tid = $routeParams.id;

	TopicFactory.getTopicById(tid, function(topic){
		
		$scope.topic = topic;

	})
	

	// ADD ANSWER UNDER THE QUESTION
		

	$scope.addAnswer = function(topic){
			
		if($scope.answerForm.$valid){
  			
			$scope.newPost.topic_id = tid;

			TopicFactory.addPost($scope.newPost, function(topic){
				
			$scope.newPost = {};
			$location.path('/topics/'+tid);

			})
		}	
    	else {
			$scope.answerForm.$setPristine = false;
			$scope.answerForm.submitted = true;
    	}
	}



	// ADD LIKE TO ANSWER 

		$scope.addLike = function(post){

				var postLike = post;	

				TopicFactory.addLike(postLike, function(){
					
					postLike = "";
				})

		}



	

  }])