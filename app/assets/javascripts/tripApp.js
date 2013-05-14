// create the trip app 


var tripApp = angular.module('tripApp', ['ngResource'])

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

tripApp.service('DataService', ['$location', 'StopsResource', function ($location, StopsResource) {

  return {

    setData:function(data) {
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


// stop resource item 
tripApp.factory('StopsResource', [ '$resource', function ($resource) {
	var stopResource = $resource('/stops/:job');

  return stopResource;
}]);


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