// create the trip app 


var tripApp = angular.module('tripApp', ['ngResource']);

tripApp.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

tripApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'templates/form.html',
    controller: 'homeCtrl'
  });

  $routeProvider.when('/trip', {
    templateUrl: 'templates/trip.html',
    controller: 'tripCtrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}]);



tripApp.service('DataService', ['$q', '$timeout', '$location', 'StopsResource', function ($q, $timeout, $location, StopsResource) {


  var queryJob = function ( deferred, job_id ) {

    // set the timer to every 2 seconds 
    $timeout(function() {

      // get the job from stops 
      StopsResource.get({job:job_id},

        function (success) {

          // process the job status
          // if complete, we resolve
          // if working, we query again 
          // if failed, we reject 

          // window.console.log(" success ", success);

          if ( success.status == "complete" ) {

            if ( success.data.directions ) {
              // resove with the data
              deferred.resolve(success.data);
            } else {
              // no direction was found
              deferred.reject();
            }
          }

          if ( success.status == "working") {
            // window.console.log("readoing work > ", job_id);
            queryJob(deferred,job_id); // repeat for next loop
          }

          if ( success.status == "failed" ) {
            deferred.reject();
          }

        },

        function (failure) {
          // promise failed for some reason
          deferred.reject();
        }
      );
    }, 2000);
  };

  return {

    getJobData: function (job_id) {
      var deferred = $q.defer();

      // run the timeout function 
      queryJob(deferred,job_id);

      return deferred.promise;

    },

    setData: function ( data ) {
      saved_data = data;
    },

    getData:function () {
      return saved_data;
    },

    hasData:function () {
      return (typeof saved_data !== "undefined" );
    }

  };

}]);

// how to talk to rails stops resource  
tripApp.factory('StopsResource', [ '$resource', function ($resource) {
	var stopResource = $resource('/stops/:job');
  return stopResource;
}]);

// directive for setting background image
tripApp.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        }); 
    };
});

