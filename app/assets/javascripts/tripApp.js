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

tripApp.service('DataService', function() {

  var saved_data = {};

  return {

    setData:function(data) {
      saved_data = data;
    }, 

    getData:function () {
      return saved_data;
    }

  };

});


// stop resource item 
tripApp.factory('StopsResource', [ '$resource', function ($resource) {
	return $resource('/stops');
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